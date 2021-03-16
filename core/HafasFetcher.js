"use strict";

const moment = require("moment");
const createClient = require("hafas-client");
const profile = require("hafas-client/p/db");
const arrayDiff = require("arr-diff");


module.exports = class HafasFetcher {

  /**
   *
   * @param config The configuration used for this fetcher. It has the following format:
   *        config = {
   *          identifier: *a string identifying this fetcher, must be unique for all instances of the module*
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
  constructor(config) {
    this.leadTime = 40; // minutes
    this.config = config;
    this.hafasClient = createClient(profile, 'MMM-PublicTransportHafas');

    // types given by the api
    this.possibleTypes = [
      "bus",
      "ferry",
      "express",
      "national",
      "nationalExp",
      "regional",
      "suburban",
      "subway",
      "tram",
      "taxi"
    ];

    this.config.includedTransportationTypes = arrayDiff(this.possibleTypes, this.config.excludedTransportationTypes);
  }


  getIdentifier() {
    return this.config.identifier;
  }


  getStationID() {
    return this.config.stationID;
  }


  fetchDepartures() {
    let options = {
      when: this.getDepartureTime(),
      direction: this.config.direction,
      duration: this.config.timeInFuture
    };

    return this.hafasClient.departures(this.config.stationID, options)
      .then((departures) => {
        let maxElements = this.config.maxReachableDepartures + this.config.maxUnreachableDepartures;
        let filteredDepartures = this.filterByTransportationTypes(departures);
        filteredDepartures = this.filterByIgnoredLines(filteredDepartures);
        filteredDepartures = this.departuresMarkedWithReachability(filteredDepartures);
        filteredDepartures = this.departuresRemovedSurplusUnreachableDepartures(filteredDepartures);
        filteredDepartures = filteredDepartures.slice(0, maxElements);

        return filteredDepartures;
      }).catch((e) => {
        throw e;
      });
  }


  getDepartureTime() {
    let departureTime = this.getReachableTime();

    if (this.config.maxUnreachableDepartures > 0) {
      departureTime = moment(departureTime).subtract(this.leadTime, "minutes");
    }

    return departureTime;
  }


  getReachableTime() {
    return moment().add(this.config.timeToStation, "minutes");
  }


  filterByTransportationTypes(departures) {
    return departures.filter((departure) => {
      let product = departure.line.product;
      let index = this.config.includedTransportationTypes.indexOf(product);

      return index !== -1;
    });
  }


  filterByIgnoredLines(departures) {
    return departures.filter((departure) => {
      let line = departure.line.name;
      let index = this.config.ignoredLines.indexOf(line);

      return index === -1;
    });
  }


  departuresMarkedWithReachability(departures) {
    return departures.map((departure) => {
      departure.isReachable = this.isReachable(departure);
      return departure;
    });
  }


  departuresRemovedSurplusUnreachableDepartures(departures) {
    let unreachableDeparturesCount = departures.filter(departure => !departure.isReachable).length;
    let result = departures;

    if (unreachableDeparturesCount > this.config.maxUnreachableDepartures) {
      let toBeRemoved = unreachableDeparturesCount - this.config.maxUnreachableDepartures;

      for (let i = 0; i < toBeRemoved; i++) {
        result.shift();
      }
    }

    return result;
  }


  isReachable(departure) {
    return moment(departure.when).isSameOrAfter(moment(this.getReachableTime()));
  }
};
