const config = {
  address: "0.0.0.0",
  ipWhitelist: [],
  logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
  modules: [
    {
      module: "clock",
      position: "middle_center"
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "top_left",
      config: {
        hafasProfile: "rejseplanen",
        stationID: "8600626",
        stationName: "rejseplanen - somewhere",
        timeToStation: 600,
        updatesEvery: 30,
        marqueeLongDirections: false,
        maxReachableDepartures: 6,
        customLineStyles: "halle",
        replaceInDirections: {"Halle (Saale), ": "", " (Tram/Bus)": ""},
        showOnlyLineNumbers: true,
        showAbsoluteTime: false,
        toggleAbsoluteTimeInterval: 10,
        showTableHeaders: false,
        tableHeaderOrder: ["line", "direction", "time", "platform"],
        timeInFuture: 90
      }
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "bottom_left",
      config: {
        stationID: "8012202",
        stationName: "db - Wilhelm-Leuschner-Platz"
      }
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "top_right",
      config: {
        hafasProfile: "insa",
        stationID: "3937",
        stationName: "insa - Betriebshof Freiimfelder Straße",
        timeToStation: 1,
        updatesEvery: 30,
        marqueeLongDirections: false,
        maxReachableDepartures: 5,
        customLineStyles: "halle",
        replaceInDirections: {"Halle (Saale), ": "", " (Tram/Bus)": "", "Betriebshof Freiimfelder Str.": "Otto-Stomps-Str."},
        showOnlyLineNumbers: true,
        showAbsoluteTime: false,
        showTableHeaders: false,
        tableHeaderOrder: ["line", "direction", "time", "platform"],
        timeInFuture: 690
      }
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "bottom_right",
      config: {
        hafasProfile: "vbn",
        stationID: "9013786",
        stationName: "vbn - Brunnenstraße"
      }
    }
  ]
};

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
