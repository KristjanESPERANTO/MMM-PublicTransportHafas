const Log = require("../../js/logger");
const NodeHelper = require("../../js/node_helper");
const DepartureFetcher = require("./core/DepartureFetcher.mjs").default;

module.exports = NodeHelper.create({
  start () {
    this.departuresFetchers = [];
    this.fetcherConfigs = {};
  },

  socketNotificationReceived (notification, payload) {
    switch (notification) {
      case "CREATE_FETCHER":
        this.createFetcher(payload);
        break;

      case "FETCH_DEPARTURES":
        this.fetchDepartures(payload);
        break;
    }
  },

  /**
   * Creates a new departure fetcher for a station or returns an existing one.
   * Sends FETCHER_INITIALIZED immediately to start the fetch loop, then initializes
   * the HAFAS client in the background.
   *
   * @param {object} config - Configuration object containing station ID, profile, and other settings
   */
  async createFetcher (config) {
    this.fetcherConfigs[config.identifier] = config;

    let fetcher;

    if (typeof this.departuresFetchers[config.identifier] === "undefined") {
      fetcher = new DepartureFetcher(config);
      this.departuresFetchers[config.identifier] = fetcher;

      // Send initialization complete immediately so the fetch loop can start
      // The actual HAFAS client init will be done on first fetch if needed
      this.sendFetcherLoaded(fetcher);

      // Init in background
      try {
        await fetcher.init();
        Log.info(`Transportation fetcher for station with id '${fetcher.getStationID()}' created.`);
      } catch (error) {
        Log.error(`Failed to initialize fetcher for station id '${config.stationID}'. Will retry on next fetch cycle.`, error);
      }
    } else {
      fetcher = this.departuresFetchers[config.identifier];
      Log.info(`Using existing transportation fetcher for station id '${fetcher.getStationID()}'.`);
      this.sendFetcherLoaded(fetcher);
    }
  },

  sendFetcherLoaded (fetcher) {
    this.sendSocketNotification("FETCHER_INITIALIZED", {
      identifier: fetcher.getIdentifier()
    });
  },

  async fetchDepartures (identifier) {
    const fetcher = this.departuresFetchers[identifier];

    if (typeof fetcher === "undefined") {
      await this.handleMissingFetcher(identifier);
      return;
    }

    await this.fetchWithInitializedFetcher(fetcher);
  },

  /**
   * Handles the case when a fetcher is requested but doesn't exist yet.
   * Attempts to create the fetcher from saved config and retries the fetch.
   *
   * @param {string} identifier - The unique identifier of the fetcher/module instance
   */
  async handleMissingFetcher (identifier) {
    // Fetcher not initialized yet - try to create it now
    const config = this.fetcherConfigs[identifier];
    if (config) {
      Log.log("Fetcher undefined, attempting to create it now.");
      await this.createFetcher(config);
      // Try again after creation attempt
      await this.fetchDepartures(identifier);
      return;
    }

    Log.log("Fetcher is undefined. If this occurs only sporadically, it is not a problem.");
  },

  /**
   * Fetches departures using an existing fetcher instance.
   * Checks if the HAFAS client is initialized and retries initialization if needed.
   * Sends either DEPARTURES_FETCHED or FETCH_ERROR notification based on the result.
   *
   * @param {object} fetcher - The DepartureFetcher instance to use
   */
  async fetchWithInitializedFetcher (fetcher) {
    // Check if fetcher needs initialization (in case it failed before)
    if (!fetcher.hafasClient) {
      Log.log("Fetcher not fully initialized, attempting init now.");
      try {
        await fetcher.init();
        Log.info("Fetcher initialization successful on retry.");
      } catch (error) {
        Log.error("Fetcher initialization failed again.", error);
        const payload = {
          error,
          identifier: fetcher.getIdentifier()
        };
        this.sendSocketNotification("FETCH_ERROR", payload);
        return;
      }
    }

    try {
      const fetchedDepartures = await fetcher.fetchDepartures();
      const payload = {
        departures: fetchedDepartures,
        identifier: fetcher.getIdentifier()
      };
      this.sendSocketNotification("DEPARTURES_FETCHED", payload);
    } catch (error) {
      const payload = {
        error,
        identifier: fetcher.getIdentifier()
      };
      this.sendSocketNotification("FETCH_ERROR", payload);
    }
  }
});
