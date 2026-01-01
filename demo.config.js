let config = {
  address: "0.0.0.0",
  ipWhitelist: [],
  logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
  modules: [
    {
      module: "clock",
      position: "top_left"
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "top_left",
      config: {
        hafasProfile: "rejseplanen",
        stationID: "8600626",
        stationName: "rejseplanen somewhere",
        timeToStation: 600, // in minutes
        showColoredLineSymbols: true,
        updatesEvery: 30, // in seconds
        displayLastUpdate: true,
        useColorForRealtimeInfo: true,
        showTableHeadersAsSymbols: true,
        marqueeLongDirections: false,
        maxUnreachableDepartures: 0,
        maxReachableDepartures: 6,
        customLineStyles: "halle",
        replaceInDirections: {"Halle (Saale), ": "", " (Tram/Bus)": ""},
        showOnlyLineNumbers: true,
        showAbsoluteTime: false,
        showTableHeaders: false,
        tableHeaderOrder: ["line", "direction", "time", "platform"],
        timeInFuture: 90 // in minutes
      }
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "top_center",

      config: {
        // Departures options
        stationID: "8012202",                   // Replace with your stationID!
        stationName: "Wilhelm-Leuschner-Platz", // Replace with your station name!
        direction: "",                    // Show only departures heading to this station. (A station ID.)
        excludedTransportationTypes: [],  // Which transportation types should not be shown on the mirror? (comma-separated list of types) possible values: "tram", "bus", "suburban", "subway", "regional" and "national"
        ignoredLines: [],                 // Which lines should be ignored? (comma-separated list of line names)
        timeToStation: 10,                // How long do you need to walk to the next Station?

        // Look and Feel
        displayLastUpdate: true,          // Display the last time of module update.
        maxUnreachableDepartures: 0,      // How many unreachable departures should be shown?
        maxReachableDepartures: 7,        // How many reachable departures should be shown?
        showColoredLineSymbols: true,     // Want colored line symbols?
        customLineStyles: "",             // Prefix for the name of the custom css file. ex: Leipzig-lines.css (case sensitive)
        showOnlyLineNumbers: false,       // Display only the line number instead of the complete name, i. e. "11" instead of "STR 11"
        showTableHeadersAsSymbols: true,  // Table Headers as symbols or text?
        useColorForRealtimeInfo: true     // Want colored real time information (timeToStation, early)?
      }
    },
    {
      module: "MMM-PublicTransportHafas",
      position: "top_right",
      disabled: false,
      config: {
        hafasProfile: "insa",
        stationID: "3937",
        stationName: "Betriebshof Freiimfelder Straße",
        timeToStation: 1, // In minutes
        showColoredLineSymbols: true,
        updatesEvery: 30, // In seconds
        displayLastUpdate: true,
        useColorForRealtimeInfo: true,
        showTableHeadersAsSymbols: true,
        marqueeLongDirections: false,
        maxUnreachableDepartures: 0,
        maxReachableDepartures: 5,
        customLineStyles: "halle",
        replaceInDirections: {"Halle (Saale), ": "", " (Tram/Bus)": "", "Betriebshof Freiimfelder Str.": "Otto-Stomps-Str."},
        showOnlyLineNumbers: true,
        showAbsoluteTime: false,
        showTableHeaders: false,
        tableHeaderOrder: ["line", "direction", "time", "platform"],
        timeInFuture: 690 // In minutes
      }
    }
  ]
};

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
