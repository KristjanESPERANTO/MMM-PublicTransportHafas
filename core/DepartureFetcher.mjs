/* eslint-disable no-console */
import {createRequire} from "node:module";
import packageJson from "../package.json" with {type: "json"};

const fallbackLogger = {
  debug: console.info.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  log: console.log.bind(console)
};

const require = createRequire(import.meta.url);
let logger = fallbackLogger;

try {
  logger = require("logger");
} catch {
  logger = fallbackLogger;
}

const DEFAULT_FETCH_RETRIES = 2;
const DEFAULT_RETRY_BACKOFF_MS = 350;

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableFetchError (error) {
  const message = String(error?.message || "").toLowerCase();
  const code = String(error?.code || error?.errno || "").toLowerCase();

  if (["err_stream_premature_close", "econnreset", "etimedout", "eai_again", "enotfound"].includes(code)) {
    return true;
  }

  return [
    "premature close",
    "invalid response body",
    "fetch failed",
    "network",
    "timed out"
  ].some((term) => message.includes(term));
}

function isBlockedFetchError (error) {
  return error?.code === "OPS_BLOCKED" || Number(error?.response?.status ?? error?.status) === 452;
}

function createBlockedFetchError (error, direction) {
  const refId = error?.response?.body?.errorRefId ?? error?.errorRefId;
  const message = [
    `[MMM-PublicTransportHafas] DB departures endpoint is blocked (OPS_BLOCKED / 452) for direction ${direction || "all"}.`,
    refId && `errorRefId: ${refId}.`,
    "Try setting hafasProfile to \"dbweb\" or another regional profile."
  ].filter(Boolean).join(" ");

  return new Error(message, {cause: error});
}

/**
 * Helper function to determine the difference between two arrays.
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @returns {Array} An array that contains the elements from arrayA that are not contained in arrayB.
 */
function getArrayDiff (arrayA, arrayB) {
  return arrayA.filter((element) => !arrayB.includes(element));
}

export default class DepartureFetcher {
  /**
   *
   * @param {object} config The configuration used for this fetcher. It has the following format:
   *        config = {
   *          identifier: *a string identifying this fetcher, must be unique for all instances of the module*
   *          hafasProfile: *a valid hafas-client profile name*,
   *          stationID: *a valid station id*,
   *          timeToStation: *an integer describing how long it takes to get to the station (in minutes)*,
   *          timeInFuture: *an integer describing how far in the future the departure can lie*
   *          directions: *an array of station ids*,
   *          ignoredLines: *an array of line names which are to be ignored*,
   *          excludedTransportationTypes: *an array of product names which are not to be shown*,
   *          excludeDirections: *an array of destination names to omit from the display*,
   *          maxReachableDepartures: *an integer describing how many departures should be fetched*,
   *          maxUnreachableDepartures: *an integer describing how many unreachable departures should be fetched*
   *        }
   */
  constructor (config) {
    this.leadTime = 20; // Minutes
    this.config = config;
  }

  async init () {
    let createClient;
    let profile;
    if (this.config.hafasProfile === "db" || this.config.hafasProfile === "dbweb") {
      logger.info("Using vendo client");
      const vendoClient = await import("db-vendo-client");
      const createVendoClient = vendoClient.createClient;
      createClient = createVendoClient;
      const vendo = await import(`db-vendo-client/p/${this.config.hafasProfile}/index.js`);
      profile = vendo.profile;
    } else {
      logger.info("Using HAFAS client");
      const hafasClient = await import("hafas-client");
      const createHafasClient = hafasClient.createClient;
      createClient = createHafasClient;
      const hafas = await import(`hafas-client/p/${this.config.hafasProfile}/index.js`);
      profile = hafas.profile;
    }

    this.hafasClient = createClient(
      profile,
      `MMM-PublicTransportHafas v${packageJson.version}`
    );

    // Possible transportation types given by profile
    this.possibleTransportationTypes = profile.products.map((product) => product.id);

    // Remove the excluded types from the possible types
    this.config.includedTransportationTypes = getArrayDiff(
      this.possibleTransportationTypes,
      this.config.excludedTransportationTypes
    );
  }

  getIdentifier () {
    return this.config.identifier;
  }

  getStationID () {
    return this.config.stationID;
  }

  async fetchDepartures () {
    const directions = Array.isArray(this.config.directions) && this.config.directions.length > 0
      ? this.config.directions
      : [null];

    const results = await this.fetchAllDirections(directions);
    const {departures, failures} = DepartureFetcher.processResults(results, directions);

    if (failures.length > 0) {
      logger.warn(`[MMM-PublicTransportHafas] Failed to fetch ${failures.length} of ${directions.length} direction(s), continuing with successful results`);
    }

    const sortedDepartures = DepartureFetcher.sortDepartures(departures);
    const uniqueDepartures = DepartureFetcher.removeDuplicates(sortedDepartures);
    const filteredDepartures = this.applyAllFilters(uniqueDepartures);

    const maxElements = this.config.maxReachableDepartures + this.config.maxUnreachableDepartures;
    return filteredDepartures.slice(0, maxElements);
  }

  fetchAllDirections (directions) {
    const promises = directions.map((direction) => {
      const departureTime = this.getDepartureTime();
      const options = {
        duration: this.getTimeInFuture(),
        when: new Date(departureTime.epochMilliseconds)
      };

      if (direction) {
        options.direction = direction;
      }

      return this.fetchDeparturesWithRetry(options, direction);
    });

    return Promise.allSettled(promises);
  }

  getFetchRetries () {
    const retries = Number(this.config.fetchRetries);

    if (!Number.isFinite(retries)) {
      return DEFAULT_FETCH_RETRIES;
    }

    return Math.min(5, Math.max(0, Math.floor(retries)));
  }

  fetchDeparturesWithRetry (options, direction) {
    const retries = this.getFetchRetries();
    const maxAttempts = retries + 1;

    const runAttempt = async (attempt) => {
      try {
        return await this.hafasClient.departures(this.config.stationID, options);
      } catch (error) {
        if (isBlockedFetchError(error)) {
          throw createBlockedFetchError(error, direction);
        }

        const shouldRetry = attempt < maxAttempts && isRetryableFetchError(error);

        if (!shouldRetry) {
          throw error;
        }

        const backoffMs = Math.min(3000, DEFAULT_RETRY_BACKOFF_MS * attempt);
        logger.warn(`[MMM-PublicTransportHafas] Retry ${attempt}/${maxAttempts} for direction ${direction || "all"} in ${backoffMs}ms: ${error?.message || error}`);
        await sleep(backoffMs);
        return runAttempt(attempt + 1);
      }
    };

    return runAttempt(1);
  }

  /**
   * Process Promise.allSettled results from HAFAS API calls.
   * Handles both old API (array) and new API (object with .departures property).
   *
   * @param {Array} results - Array of Promise.allSettled results
   * @param {Array} directions - Array of direction IDs
   * @returns {{departures: Array, failures: Array}} Processed departures and failures
   */
  static processResults (results, directions) {
    const departures = [];
    const failures = [];

    for (const [index, result] of results.entries()) {
      if (result.status === "fulfilled") {
        const departuresData = Array.isArray(result.value)
          ? result.value
          : result.value?.departures || [];

        if (departuresData.length > 0) {
          departures.push(...departuresData);
        } else {
          logger.warn(`[MMM-PublicTransportHafas] No departures found for direction ${directions[index] || "all"}`);
        }
      } else {
        failures.push({direction: directions[index], error: result.reason});
        logger.error(
          `[MMM-PublicTransportHafas] Failed to fetch departures for direction ${directions[index]}:`,
          result.reason
        );
      }
    }

    return {departures, failures};
  }

  /**
   * Sort departures by time (when or plannedWhen).
   * Creates a copy to avoid mutating the original array.
   *
   * @param {Array} departures - Array of departure objects
   * @returns {Array} Sorted copy of departures
   */
  static sortDepartures (departures) {
    return [...departures].sort((dep1, dep2) => {
      const timeA = new Date(dep1.when || dep1.plannedWhen || 0).getTime();
      const timeB = new Date(dep2.when || dep2.plannedWhen || 0).getTime();
      return timeA - timeB;
    });
  }

  /**
   * Remove duplicate departures based on tripId, time, and stop.
   *
   * @param {Array} departures - Array of departure objects
   * @returns {Array} Departures with duplicates removed
   */
  static removeDuplicates (departures) {
    const seen = new Set();
    return departures.filter((dep) => {
      const id = `${dep.tripId || dep.line?.id || "unknown"}-${dep.when || dep.plannedWhen}-${dep.stop?.id || ""}`;
      if (seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    });
  }

  applyAllFilters (departures) {
    let filtered = this.filterByTransportationTypes(departures);
    filtered = this.filterByIgnoredLines(filtered);

    if (this.config.ignoreRelatedStations) {
      filtered = this.filterByStopId(filtered);
    }

    filtered = this.filterByExcludedDirections(filtered);
    filtered = this.filterByPlatforms(filtered);
    filtered = this.departuresMarkedWithReachability(filtered);
    return this.departuresRemovedSurplusUnreachableDepartures(filtered);
  }

  getDepartureTime () {
    let departureTime = this.getReachableTime();

    if (this.config.maxUnreachableDepartures > 0) {
      departureTime = departureTime.subtract({minutes: this.leadTime});
    }

    return departureTime;
  }

  getReachableTime () {
    return Temporal.Now.zonedDateTimeISO().add({minutes: this.config.timeToStation});
  }

  getTimeInFuture () {
    let {timeInFuture} = this.config;
    if (this.config.maxUnreachableDepartures > 0) {
      timeInFuture += this.leadTime;
    }

    return timeInFuture;
  }

  filterByTransportationTypes (departures) {
    return departures.filter((departure) => {
      const index = this.config.includedTransportationTypes.indexOf(departure.line.product);

      return index !== -1;
    });
  }

  filterByIgnoredLines (departures) {
    return departures.filter((departure) => {
      const line = departure.line.name;
      const index = this.config.ignoredLines.indexOf(line);

      return index === -1;
    });
  }

  /**
   * Filter departures from the related stations.
   *
   * Some stations have related stations. By default, their departures are also displayed. The hafas-client
   * has the option to deactivate this via `includeRelatedStations:false`, unfortunately not all endpoints
   * support this option. That is why there is this filter instead of the hafas-client option.
   * (This was noticed with the endpoint insa and the stationID 7393 (Magdeburg, Hauptbahnhof/Nord)).
   * @param {any} departures
   * @returns {any} Filtered departures.
   */
  filterByStopId (departures) {
    return departures.filter((departure) => departure.stop.id === this.config.stationID);
  }

  filterByExcludedDirections (departures) {
    if (!this.config.excludeDirections || this.config.excludeDirections.length === 0) {
      return departures;
    }

    return departures.filter((departure) => !this.config.excludeDirections.includes(departure.direction));
  }

  filterByPlatforms (departures) {
    if (!this.config.platformsToShow || this.config.platformsToShow.length === 0) {
      return departures;
    }

    return departures.filter((departure) => {
      const platform = departure.platform ?? departure.plannedPlatform;
      return platform && this.config.platformsToShow.includes(platform);
    });
  }

  departuresMarkedWithReachability (departures) {
    return departures.map((departure) => {
      this.departure = departure;
      this.departure.isReachable = this.isReachable(departure);
      return this.departure;
    });
  }

  departuresRemovedSurplusUnreachableDepartures (departures) {
    // Get all unreachable departures
    const unreachableDepartures = departures.filter((departure) => !departure.isReachable);

    // Adjust lead time for next request
    this.adjustLeadTime(unreachableDepartures);
    // Remove surplus unreachable departures
    unreachableDepartures.splice(
      0,
      unreachableDepartures.length - this.config.maxUnreachableDepartures
    );

    // Get all reachable departures
    const reachableDepartures = departures.filter((departure) => departure.isReachable);

    // Output reachableDepartures for debugging
    logger.debug(reachableDepartures);

    // Merge unreachable and reachable departures
    const result = [].concat(unreachableDepartures, reachableDepartures);

    return result;
  }

  adjustLeadTime (unreachableDepartures) {
    /**
     * This method dynamically adjusts the lead time. This is only relevant if
     * 'this.config.maxUnreachableDepartures' is greater than 0. The dynamic
     * adjustment is useful because there are stops where are many departures
     * in the lead time and some where are very few.
     */
    if (unreachableDepartures.length > this.config.maxUnreachableDepartures) {
      this.leadTime = Math.round(this.leadTime / 2) + 1;
    } else if (this.leadTime <= 45) {
      this.leadTime += 5;
    }
  }

  isReachable (departure) {
    // Use when if available, otherwise fall back to plannedWhen
    const departureTime = departure.when || departure.plannedWhen;

    // If neither when nor plannedWhen is available, treat as unreachable
    if (!departureTime) {
      logger.warn("[MMM-PublicTransportHafas] Departure has no when or plannedWhen, treating as unreachable");
      return false;
    }

    const departureInstant = Temporal.Instant.from(departureTime);
    const reachableInstant = this.getReachableTime().toInstant();
    return Temporal.Instant.compare(departureInstant, reachableInstant) >= 0;
  }
}
