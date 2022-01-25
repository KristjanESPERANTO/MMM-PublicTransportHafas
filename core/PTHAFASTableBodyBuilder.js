/* global moment */
// eslint-disable-next-line no-unused-vars
class PTHAFASTableBodyBuilder {
  constructor(config) {
    this.config = config;
  }

  getDeparturesTableBody(departures, noDepartureMessage) {
    const tBody = document.createElement("tbody");
    tBody.className = "light";

    if (departures.length === 0) {
      const row = this.getDeparturesTableNoDeparturesRow(noDepartureMessage);
      tBody.appendChild(row);

      return tBody;
    }

    const reachableCount = departures.length;
    const unreachableCount = departures.filter(
      (departure) => !departure.isReachable
    ).length;

    departures.forEach((departure, index) => {
      const row = this.getDeparturesTableRow(
        departure,
        index,
        reachableCount,
        unreachableCount
      );
      tBody.appendChild(row);

      if (this.config.showWarningRemarks) {
        // Next line is for testing if there are no warning remarks - uncomment it to append to every departure a warning remark
        // departure.remarks.push({ "id": "326169", "type": "warning", "summary": "Meldung für Linie 8", "text": "Es kommt zu betriebsbedingten Fahrtausfällen. \nDie entfallenden Fahrten sind in der App MOOVME sowie unter www.havag.com/fahrtenplaner gekennzeichnet.", "icon": { "type": "HIM3", "title": null }, "priority": 50, "products": { "nationalExpress": true, "national": true, "regional": true, "suburban": true, "tram": true, "bus": true, "tourismTrain": true }, "company": "HAVAG - Hallesche Verkehrs-AG", "categories": [3], "validFrom": "2021-12-03T09:17:00+01:00", "validUntil": "2022-12-31T23:59:00+01:00", "modified": "2021-12-03T09:17:46+01:00" });

        const remarksRow = this.getRemarksTableRow(departure);
        if (remarksRow.innerText !== "") {
          tBody.appendChild(remarksRow);
        }
      }

      const nextDeparture = departures[index + 1];
      this.insertRulerIfNecessary(
        tBody,
        departure,
        nextDeparture,
        noDepartureMessage
      );
    });

    return tBody;
  }

  insertRulerIfNecessary(tBody, departure, nextDeparture, noDepartureMessage) {
    if (nextDeparture && !departure.isReachable && nextDeparture.isReachable) {
      tBody.appendChild(this.getRulerRow());
    }

    if (!departure.isReachable && !nextDeparture) {
      tBody.appendChild(this.getRulerRow());
      tBody.appendChild(
        this.getDeparturesTableNoDeparturesRow(noDepartureMessage)
      );
    }
  }

  getTableCell(content, cssClass = "") {
    this.cell = document.createElement("td");
    this.cell.className = cssClass;

    if (typeof content === "string") {
      this.cell.innerText = content;
    } else {
      this.cell.appendChild(content);
    }

    return this.cell;
  }

  getDeparturesTableNoDeparturesRow(noDepartureMessage) {
    this.row = document.createElement("tr");
    this.row.className = "dimmed";

    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.innerText = noDepartureMessage;

    this.row.appendChild(cell);

    return this.row;
  }

  getRemarksTableRow(departure) {
    const row = document.createElement("tr");
    row.className = "";

    const cell = document.createElement("td");
    cell.colSpan = this.config.tableHeaderOrder.length;

    const cellContainer = document.createElement("div");
    cellContainer.className = "pthWarningRemarks";

    const marquee = document.createElement("span");
    marquee.innerText = "";

    departure.remarks.forEach((remark) => {
      if (remark.type === "warning") {
        marquee.innerText += `  ⚠️  ${remark.summary.replaceAll("\n", " ")}:
          ${remark.text.replaceAll("\n", " ")}`;
      }
    });

    if (marquee.innerText !== "") {
      while (marquee.innerText.length < 3000) {
        marquee.innerText += marquee.innerText;
      }
    }

    cellContainer.appendChild(marquee);
    cell.appendChild(cellContainer);
    row.appendChild(cell);

    return row;
  }

  getDeparturesTableRow(departure, index, departuresCount, unreachableCount) {
    const row = document.createElement("tr");
    row.className = "bright";

    if (departure.isReachable) {
      row.style.opacity = this.getRowOpacity(
        index - unreachableCount,
        departuresCount
      );
    } else {
      row.style.opacity = this.getUnreachableRowOpacity(
        index,
        unreachableCount
      );
    }

    this.config.tableHeaderOrder.forEach((key) => {
      const cell = this.getCell(key, departure);
      row.appendChild(cell);
    });

    return row;
  }

  getCell(key, departure) {
    let cell;

    switch (key) {
      case "time": {
        this.time = departure.when;
        // Use planned time if canceled
        if (departure.canceled === true) this.time = departure.plannedWhen;

        // Get time cell
        cell = this.getTimeCell(this.time, departure.delay);

        // Add class if canceled
        if (departure.canceled === true) cell.className += " pthCanceled";

        break;
      }
      case "line": {
        cell = this.getLineCell(departure.line.name);
        break;
      }
      case "direction": {
        cell = this.getDirectionCell(departure.direction);
        break;
      }
      case "platform": {
        let platform = departure.platform;
        if (platform === null) platform = departure.plannedPlatform;
        if (platform === null) platform = "";
        cell = this.getPlatformCell(platform);
        break;
      }
    }

    return cell;
  }

  getTimeCell(departure, delay) {
    const time = this.getDisplayDepartureTime(departure, delay);

    const cell = document.createElement("td");

    if (moment(departure).isValid()) {
      cell.className = "pthTimeCell";
      cell.appendChild(document.createTextNode(time));

      if (this.config.showAbsoluteTime) {
        cell.appendChild(this.getDelaySpan(delay));
      }
    } else {
      cell.className = "pthTimeCanceled";
      cell.appendChild(document.createTextNode("Fällt aus"));
    }

    return cell;
  }

  getDelaySpan(delay) {
    const delaySpan = document.createElement("span");
    delaySpan.innerText = this.getDelay(delay);

    let cssClass = "dimmed";

    if (this.config.useColorForRealtimeInfo && typeof delay === "number") {
      cssClass = delay > 0 ? "pthHasDelay" : "pthIsTooEarly";
    }

    delaySpan.className = `pthDelay ${cssClass}`;

    return delaySpan;
  }

  getDelay(delay) {
    this.delayString = "+?";
    if (typeof delay === "number") {
      const sign = delay < 0 ? "-" : "+";
      this.delayString = sign + delay / 60;
    }
    return this.delayString;
  }

  getDisplayDepartureTime(when, delay) {
    if (this.config.showAbsoluteTime) {
      const time = moment(when).subtract(delay, "seconds");
      return time.format("LT");
    }
    const time = moment(when);
    return time.fromNow();
  }

  getLineId(lineName) {
    this.lineId = lineName;
    if (lineName.search(" ") === -1) {
      const lineNameWithoutSpaces = lineName.replace(/\s/g, "");
      const firstNumberPosition = lineNameWithoutSpaces.search(/\d/);
      this.lineId = lineNameWithoutSpaces;

      if (firstNumberPosition > 0) {
        this.lineId = lineNameWithoutSpaces.slice(firstNumberPosition);
      }
    } else {
      this.lineId = lineName.split(" ")[1];
    }

    return this.lineId;
  }

  getLineCell(lineName) {
    let line;

    if (this.config.showOnlyLineNumbers) {
      line = this.getLineId(lineName);
    } else {
      line = lineName;
    }

    const lineDiv = document.createElement("div");
    lineDiv.innerText = line;
    lineDiv.className = `${this.getLineCssClass(lineName)} pthTextCenter`;

    return this.getTableCell(lineDiv);
  }

  getLineCssClass(lineName) {
    if (this.config.showColoredLineSymbols) {
      return this.getColoredCssClass(lineName);
    }
    return "pthSign pthBWLineSign";
  }

  /**
   * Get product of a line name
   *
   * Some HAFAS interfaces output line names with a space after the product name and
   * some do not. As an example: `RB50` <->` RB 50`.
   * This function returns the product name. In the two examples already mentioned
   * (`RB50` and` RB 50`) the string `RB` would be returned. If there is no product name
   * (if the line name starts with a digit), `undefined` is returned.
   *
   * @param  {string} lineName    The line name as it was delivered by the HAFAS API.
   * @returns {string} product     The product ('RB', 'S', 'U', ...).
   */
  getProduct(lineName) {
    this.product = lineName;
    if (lineName.search(" ") === -1) {
      const lineNameWithoutSpaces = lineName.replace(/\s/g, "");
      const firstNumberPosition = lineNameWithoutSpaces.search(/\d/);
      this.product = lineNameWithoutSpaces;

      if (firstNumberPosition > 0) {
        this.product = lineNameWithoutSpaces.slice(0, firstNumberPosition);
      }
    } else {
      this.product = lineName.split(" ")[0];
    }

    return this.product;
  }

  /**
   * Get css class names
   *
   * Class names are returned depending on the line name. This enables CSS styles
   * to be defined on the basis of various properties.
   *
   * @param  {string} lineName     The linename as it was delivered by the HAFAS API.
   * @returns {string} classNames   Series of class names
   */
  getColoredCssClass(lineName) {
    let classNames = "pthSign";
    const product = this.getProduct(lineName);
    const dbProducts = ["IC", "ICE", "RE", "RB", "S"];
    const ignoreShowOnlyLineNumbers = ["IC", "ICE", "RE", "RB", "S", "U"];

    if (dbProducts.includes(product)) {
      classNames += " pthDbStandard";
    }
    if (
      ignoreShowOnlyLineNumbers.includes(product) &&
      this.config.showOnlyLineNumbers
    ) {
      classNames += ` ${product.toLowerCase()}WithProductName`;
    }
    classNames += ` ${product.toLowerCase()}`;
    classNames += ` ${lineName.replace(/\s/g, "").toLowerCase()}`;

    return classNames;
  }

  getDirectionCell(direction) {
    const truncatePosition = 26;
    let content = this.getProcessedDirection(direction);
    let className = "pthDirectionCell";

    if (
      this.config.marqueeLongDirections &&
      content.length > truncatePosition
    ) {
      content = document.createElement("span");
      content.innerText = this.getProcessedDirection(direction);
      className += " pthMarquee";
    }

    if (!this.config.showAbsoluteTime) {
      className += " pthTextLeft";
    }

    return this.getTableCell(content, className);
  }

  getProcessedDirection(direction) {
    const replacements = this.config.replaceInDirections;
    let processed = direction;

    Object.keys(replacements).forEach((key) => {
      processed = processed.replaceAll(key, replacements[key]);
    });

    return processed;
  }

  getPlatformCell(platform) {
    const className = "pthPlatformCell pthTextCenter";
    return this.getTableCell(platform, className);
  }

  getRowOpacity(index, departuresCount) {
    if (!this.config.fadeReachableDepartures) {
      return 1.0;
    }

    const threshold =
      departuresCount * this.config.fadePointForReachableDepartures;
    let opacity = 1;
    const startOpacity = 0.8;
    const endOpacity = 0.2;
    const opacityDiff =
      (startOpacity - endOpacity) / (departuresCount - threshold);

    if (index > threshold) {
      const fadingIndex = index - threshold;
      const currentOpacity = fadingIndex * opacityDiff;
      opacity = startOpacity - currentOpacity;
    }

    return opacity;
  }

  getUnreachableRowOpacity(index, count) {
    if (!this.config.fadeUnreachableDepartures) {
      return 1.0;
    }

    const startOpacity = 0.3;
    const endOpacity = 0.6;
    const opacityDiff = (endOpacity - startOpacity) / count;

    if (index + 1 === count) {
      return endOpacity;
    }
    return startOpacity + opacityDiff * index;
  }

  getRulerRow() {
    this.row = document.createElement("tr");
    this.cell = document.createElement("td");

    this.cell.colSpan = 3;
    this.cell.className = "pthRulerCell";
    this.row.appendChild(this.cell);

    return this.row;
  }
}
