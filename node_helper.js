const Log = require("logger");
const NodeHelper = require("node_helper");
const DepartureFetcher = require("./core/DepartureFetcher.mjs").default;

module.exports = NodeHelper.create({
  start () {
    this.departuresFetchers = [];
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

  async createFetcher (config) {
    let fetcher;

    if (typeof this.departuresFetchers[config.identifier] === "undefined") {
      fetcher = new DepartureFetcher(config);
      await fetcher.init();
      this.departuresFetchers[config.identifier] = fetcher;
      Log.info(`[MMM-PublicTransportHafas] Transportation fetcher for station with id '${fetcher.getStationID()}' created.`);

      this.sendFetcherLoaded(fetcher);
    } else {
      fetcher = this.departuresFetchers[config.identifier];
      Log.info(`[MMM-PublicTransportHafas] Using existing transportation fetcher for station id '${fetcher.getStationID()}'.`);

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
      Log.log("[MMM-PublicTransportHafas] fetcher is undefined. If this occurs only sporadically, it is not a problem.");
    } else {
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
  }
});
