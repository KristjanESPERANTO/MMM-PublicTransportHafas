/* global dayjs PtDomBuilder Module Log config */

/*
 * UserPresence Management (PIR sensor)
 * (The variable UserPresence must currently still be declared with var, as several modules use this
 * variable. If someone wants to change this, they would have to adapt the other modules as well.)
 */
// eslint-disable-next-line no-var
var UserPresence = true; // true by default, so no impact for user without a PIR sensor

Module.register("MMM-PublicTransportHafas", {
  defaults: {
    // Module misc
    name: "MMM-PublicTransportHafas",
    hafasProfile: "db",                 // Which profile should be used?
    hidden: false,
    updatesEvery: 120,                  // How often should the table be updated in s?
    timeFormat: config.timeFormat,      // Since we don't use moment.js, we need to handle the time format ourselves. This is the default time format of the mirror.

    // Header
    headerPrefix: "",
    headerAppendix: "",

    // Display last update time
    displayLastUpdate: true,            // Add line after the tasks with the last server update time
    displayLastUpdateFormat: "dd - HH:mm:ss", // Format to display the last update. See dayjs.js documentation for all display possibilities

    // Departures options
    direction: "",                      // Show only departures heading to this station. (A station ID.)
    ignoredLines: [],                   // Which lines should be ignored? (comma-separated list of line names)
    ignoreRelatedStations: false,       // For some stations there are related stations. By default, their departures are also displayed.
    excludedTransportationTypes: [],    // Which transportation types should not be shown on the mirror? (comma-separated list of types) possible values: "tram", "bus", "suburban", "subway", "regional" and "national"
    timeToStation: 10,                  // How long do you need to walk to the Station? (in minutes)
    timeInFuture: 40,                   // Show departures for the next *timeInFuture* minutes.

    // Look and Feel
    marqueeLongDirections: true,        // Use Marquee effect for long station names?
    replaceInDirections: {},            // key-value pairs which are used to replace `key` by `value` in the displayed directions
    showColoredLineSymbols: true,       // Want colored line symbols?
    useColorForRealtimeInfo: true,      // Want colored real time information (timeToStation, early)?
    showAbsoluteTime: true,             // How should the departure time be displayed? "15:10" (absolute) or "in 5 minutes" (relative)
    noRealtimeDelayString: "+?",        // Only relevant if 'showAbsoluteTime: true'. The string that is displayed as delay if no real-time departure time data is available.
    showRelativeTimeOnlyUnder: 10 * 60 * 1000,  // Display the time only relatively if the departure takes place in less than 10 minutes (600000 milliseconds). The value is only relevant if showAbsoluteTime: false.
    showTableHeaders: true,             // Show table headers?
    showTableHeadersAsSymbols: true,    // Table Headers as symbols or written?
    showWarningRemarks: true,           // Show warning remarks?
    warningRemarksFilter: [],           // list of strings (case-intensitive) to filter remarks
    showWarningsOnce: false,            // Hide same warning in next departure?
    tableHeaderOrder: ["time", "line", "direction", "platform"], // In which order should the table headers appear?
    maxUnreachableDepartures: 0,        // How many unreachable departures should be shown?
    maxReachableDepartures: 7,          // How many reachable departures should be shown?
    fadeUnreachableDepartures: true,
    fadeReachableDepartures: true,
    fadePointForReachableDepartures: 0.25,
    customLineStyles: "",               // Prefix for the name of the custom css file. ex: Leipzig-lines.css (case sensitive)
    showOnlyLineNumbers: false,         // Display only the line number instead of the complete name, i. e. "11" instead of "STR 11"
    animationSpeed: 1_500               // Refresh animation speed in milliseconds
  },

  start () {
    Log.info(`Starting module: ${this.name} with identifier: ${this.identifier}`);

    this.ModulePublicTransportHafasHidden = false; // By default we display the module (if no carousel or other module)
    this.updatesIntervalID = 0; // To stop and start auto update for each module instance
    this.lastUpdate = 0; // Timestamp of the last module update. set at 0 at start-up

    this.departures = [];
    this.initialized = false;
    this.error = {};
    this.errorCount = 0;

    this.sanitizeConfig();

    if (!this.config.stationID) {
      this.error.message = this.translate("NO_STATION_ID_SET");
      return;
    }

    const fetcherOptions = {
      identifier: this.identifier,
      hafasProfile: this.config.hafasProfile,
      stationID: this.config.stationID,
      timeToStation: this.config.timeToStation,
      timeInFuture: this.config.timeInFuture,
      direction: this.config.direction,
      ignoredLines: this.config.ignoredLines,
      ignoreRelatedStations: this.config.ignoreRelatedStations,
      excludedTransportationTypes: this.config.excludedTransportationTypes,
      maxReachableDepartures: this.config.maxReachableDepartures,
      maxUnreachableDepartures: this.config.maxUnreachableDepartures
    };

    this.sendSocketNotification("CREATE_FETCHER", fetcherOptions);

    // Set locale
    dayjs.locale(config.language);
  },

  suspend () {
    // Core function called when the module is hidden
    this.ModulePublicTransportHafasHidden = true; // Module hidden
    Log.debug(`[MMM-PublicTransportHafas] Function suspend - Module is hidden ${this.config.stationName}`);
    this.gestionUpdateIntervalHafas(); // Call the function which manages all the cases
  },

  resume () {
    // Core function called when the module is displayed
    this.ModulePublicTransportHafasHidden = false;
    Log.debug(`[MMM-PublicTransportHafas] Function working - Module is displayed ${this.config.stationName}`);
    this.gestionUpdateIntervalHafas();
  },

  notificationReceived (notification, payload) {
    if (notification === "USER_PRESENCE") {
      // Notification sent by the MMM-PIR-Sensor module. See its doc.
      Log.debug(`[MMM-PublicTransportHafas] NotificationReceived USER_PRESENCE = ${payload}`);
      UserPresence = payload;
      this.gestionUpdateIntervalHafas();
    }
  },

  gestionUpdateIntervalHafas () {
    if (
      UserPresence === true && this.ModulePublicTransportHafasHidden === false
    ) {
      // Make sure to have a user present in front of the screen (PIR sensor) and that the module is displayed
      Log.debug(`[MMM-PublicTransportHafas] ${this.config.stationName} is displayed and user present! Update it`);

      // Update now and start again the update timer
      this.startFetchingLoop(this.config.updatesEvery);
    } else {
      // (UserPresence = false OU ModulePublicTransportHafasHidden = true)
      Log.debug(`[MMM-PublicTransportHafas] No one is watching: Stop the update!${this.config.stationName}`);
      clearInterval(this.updatesIntervalID); // Stop the current update interval
      this.updatesIntervalID = 0; // Reset the variable
    }
  },

  getDom () {
    const domBuilder = new PtDomBuilder(this.config);

    // Error handling
    if (this.hasErrors()) {
      Log.error("[MMM-PublicTransportHafas]", this.error);

      let errorMessage;

      switch (this.error.code) {
        case "ENOTFOUND":
          // HAFAS endpoint not available
          errorMessage = this.translate("ERROR_ENOTFOUND");
          break;
        case "NOT_FOUNDS":
          // Station not found
          errorMessage = this.translate("NOT_FOUND");
          break;
        default:
          errorMessage = this.error.hafasMessage || this.error.code || this.error.message;
          break;
      }

      Log.error("[MMM-PublicTransportHafas]", errorMessage.replace(/<br>/gu, " "));
      errorMessage = `${this.translate("LOADING")}<br><br><small>⚠️ ${errorMessage}</small>`;
      return domBuilder.getSimpleDom(errorMessage);
    }
    this.errorCount = 0;


    if (!this.initialized) {
      return domBuilder.getSimpleDom(this.translate("LOADING"));
    }

    const headings = {
      time: this.translate("PTH_DEPARTURE_TIME"),
      line: this.translate("PTH_LINE"),
      direction: this.translate("PTH_TO"),
      platform: this.translate("PTH_PLATFORM")
    };

    const noDeparturesMessage = this.translate("PTH_NO_DEPARTURES");

    const wrapper = domBuilder.getDom(
      this.departures,
      headings,
      noDeparturesMessage
    );

    // Display the update time at the end, if defined so by the user config
    if (this.config.displayLastUpdate) {
      const updateInfo = document.createElement("div");
      updateInfo.className = "xsmall light align-left";
      updateInfo.textContent = `Update: ${dayjs
        .unix(this.lastUpdate)
        .format(this.config.displayLastUpdateFormat)}`;
      wrapper.appendChild(updateInfo);
    }

    return wrapper;
  },

  getStyles () {
    const styles = [this.file("css/styles.css"), "font-awesome.css"];

    if (this.config.customLineStyles !== "") {
      const customStyle = `css/${this.config.customLineStyles}-lines.css`;
      styles.push(this.file(customStyle));
    }

    return styles;
  },

  getScripts () {
    return [
      this.file("node_modules/dayjs/dayjs.min.js"),
      this.file("node_modules/dayjs/plugin/localizedFormat.js"),
      this.file("node_modules/dayjs/plugin/relativeTime.js"),
      this.file(`node_modules/dayjs/locale/${config.language}.js`),
      this.file("core/PtDomBuilder.js"),
      this.file("core/PtTableBodyBuilder.js")
    ];
  },

  getTranslations () {
    return {
      en: "translations/en.json",
      de: "translations/de.json"
    };
  },

  socketNotificationReceived (notification, payload) {
    if (this.isForThisStation(payload)) {
      switch (notification) {
        case "FETCHER_INITIALIZED":
          this.initialized = true;
          this.startFetchingLoop(this.config.updatesEvery);

          break;

        case "DEPARTURES_FETCHED":
          if (this.config.displayLastUpdate) {
            this.lastUpdate = Date.now() / 1_000; // Save the timestamp of the last update to be able to display it
          }

          Log.log(`[MMM-PublicTransportHafas] Update OK, station : ${
            this.config.stationName
          } at : ${Number(dayjs
            .unix(this.lastUpdate)
            .format(this.config.displayLastUpdateFormat))}`);

          // Reset error object
          this.error = {};
          this.departures = payload.departures;
          this.updateDom(this.config.animationSpeed);
          this.sendNotification("TRANSPORT_HAFAS", payload.departures);
          break;

        case "FETCH_ERROR":
          this.error = payload.error;
          this.errorCount += 1;
          this.departures = [];

          // Only show the error message if it occurs 2 times in a row.
          if (this.errorCount > 1) {
            this.updateDom(this.config.animationSpeed);
          }

          break;
      }
    }
  },

  isForThisStation (payload) {
    return payload.identifier === this.identifier;
  },

  sanitizeConfig () {
    if (this.config.updatesEvery < 30) {
      this.config.updatesEvery = 30;
    }

    if (this.config.timeToStation < 0) {
      this.config.timeToStation = 0;
    }

    if (this.config.timeInFuture < this.config.timeToStation + 30) {
      this.config.timeInFuture = this.config.timeToStation + 30;
    }

    if (this.config.maxUnreachableDepartures < 0) {
      this.config.maxUnreachableDepartures = 0;
    }

    if (this.config.maxReachableDepartures < 0) {
      this.config.maxReachableDepartures = this.defaults.maxReachableDepartures;
    }
  },

  startFetchingLoop (interval) {
    // Start immediately ...
    this.sendSocketNotification("FETCH_DEPARTURES", this.identifier);

    // ... and then repeat in the given interval

    if (this.updatesIntervalID === 0) {
      // If this instance as no auto update defined, then we create one. Otherwise : nothing.

      this.updatesIntervalID = setInterval(() => {
        this.sendSocketNotification("FETCH_DEPARTURES", this.identifier);
      }, interval * 1_000);
    }
  },

  hasErrors () {
    return Object.keys(this.error).length > 0;
  }
});
