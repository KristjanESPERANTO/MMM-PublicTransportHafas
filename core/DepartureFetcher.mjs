/* global */
import Log from "../../../js/logger.js";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import packageJson from "../package.json" with { type: "json" };

dayjs.extend(isSameOrAfter);

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
   *          direction: *an array of station ids*,
   *          ignoredLines: *an array of line names which are to be ignored*,
   *          excludedTransportationTypes: *an array of product names which are not to be shown*,
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
      Log.info("[MMM-PublicTransportHafas] Using vendo client");
      const vendoClient = await import("db-vendo-client");
      const createVendoClient = vendoClient.createClient;
      createClient = createVendoClient;
      const vendo = await import(`db-vendo-client/p/${this.config.hafasProfile}/index.js`);
      profile = vendo.profile;
    } else {
      Log.info("[MMM-PublicTransportHafas] Using HAFAS client");
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
    const options = {
      direction: this.config.direction,
      duration: this.getTimeInFuture(),
      when: this.getDepartureTime()
    };
    const departures = await this.hafasClient.departures(
      this.config.stationID,
      options
    );

    const maxElements = this.config.maxReachableDepartures + this.config.maxUnreachableDepartures;
    let filteredDepartures = this.filterByTransportationTypes(departures.departures);

    filteredDepartures = this.filterByIgnoredLines(filteredDepartures);
    if (this.config.ignoreRelatedStations) {
      filteredDepartures = this.filterByStopId(filteredDepartures);
    }

    filteredDepartures = this.departuresMarkedWithReachability(filteredDepartures);
    filteredDepartures = this.departuresRemovedSurplusUnreachableDepartures(filteredDepartures);
    filteredDepartures = filteredDepartures.slice(0, maxElements);

    return filteredDepartures;
  }

  getDepartureTime () {
    let departureTime = this.getReachableTime();

    if (this.config.maxUnreachableDepartures > 0) {
      departureTime = departureTime.subtract(this.leadTime, "minutes");
    }

    return departureTime;
  }

  getReachableTime () {
    return dayjs().add(this.config.timeToStation, "minutes");
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
    Log.debug("[MMM-PublicTransportHafas]", reachableDepartures);

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
    return dayjs(departure.when).isSameOrAfter(this.getReachableTime());
  }
}
