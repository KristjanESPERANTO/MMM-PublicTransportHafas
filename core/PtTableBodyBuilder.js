/* global dayjs */

dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_localizedFormat);

// eslint-disable-next-line no-unused-vars
class PtTableBodyBuilder {
  constructor (config) {
    this.config = config;
    this.remarksCollector = [] ;  // the array with warnings that are already displayed
  }

  getDeparturesTableBody (departures, noDepartureMessage) {
    const tBody = document.createElement("tbody");
    tBody.className = "light";

    if (departures.length === 0) {
      const row = this.getDeparturesTableNoDeparturesRow(noDepartureMessage);
      tBody.appendChild(row);

      return tBody;
    }

    const reachableCount = departures.length;
    const unreachableCount = departures.filter((departure) => !departure.isReachable).length;

    for (const [index, departure] of departures.entries()) {
      const row = this.getDeparturesTableRow(
        departure,
        index,
        reachableCount,
        unreachableCount
      );
      tBody.appendChild(row);

      if (this.config.showWarningRemarks) {
        // Next line is for testing if there are no warning remarks - uncomment it to append to every departure a warning remark
        // This is a list of dictionaries. There is also a "hint" type but that does not contain a summary.
        // departure.remarks.push({ "id": "326169", "type": "warning", "summary": "Meldung für Linie 8", "text": "Es kommt zu betriebsbedingten Fahrtausfällen. \nDie entfallenden Fahrten sind in der App MOOVME sowie unter www.havag.com/fahrtenplaner gekennzeichnet.", "icon": { "type": "HIM3", "title": null }, "priority": 50, "products": { "nationalExpress": true, "national": true, "regional": true, "suburban": true, "tram": true, "bus": true, "tourismTrain": true }, "company": "HAVAG - Hallesche Verkehrs-AG", "categories": [3], "validFrom": "2021-12-03T09:17:00+01:00", "validUntil": "2022-12-31T23:59:00+01:00", "modified": "2021-12-03T09:17:46+01:00" });
        const remarksRow = this.getRemarksTableRow(departure);
        if (remarksRow.textContent !== "") {
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
    }

    return tBody;
  }

  insertRulerIfNecessary (tBody, departure, nextDeparture, noDepartureMessage) {
    if (nextDeparture && !departure.isReachable && nextDeparture.isReachable) {
      tBody.appendChild(this.getRulerRow());
    }

    if (!departure.isReachable && !nextDeparture) {
      tBody.appendChild(this.getRulerRow());
      tBody.appendChild(this.getDeparturesTableNoDeparturesRow(noDepartureMessage));
    }
  }

  getTableCell (content, cssClass = "") {
    this.cell = document.createElement("td");
    this.cell.className = cssClass;

    if (typeof content === "string") {
      this.cell.textContent = content;
    } else {
      this.cell.appendChild(content);
    }

    return this.cell;
  }

  getDeparturesTableNoDeparturesRow (noDepartureMessage) {
    this.row = document.createElement("tr");
    this.row.className = "dimmed";

    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = noDepartureMessage;

    this.row.appendChild(cell);

    return this.row;
  }

  getRemarksTableRow (departure) {
    const row = document.createElement("tr");
    row.className = "";

    const cell = document.createElement("td");
    cell.colSpan = this.config.tableHeaderOrder.length;

    const cellContainer = document.createElement("div");
    cellContainer.className = "mmm-pth-warning-remarks";

    const marquee = document.createElement("span");
    marquee.textContent = "";

    for (const remark of departure.remarks) {
      if (remark.type === "warning" &&
        !this.config.warningRemarksFilter.some((removable) => remark.text.includes(removable)) &&
        !this.config.warningRemarksFilter.some((removable) => remark.summary.includes(removable)) &&
        !this.remarksCollector.some((removable) => remark.text.includes(removable)) && 
        !this.remarksCollector.some((removable) => remark.summary.includes(removable))) {
        marquee.textContent += `  ⚠️  ${remark.summary.replaceAll("\n", " ")}:
            ${remark.text.replaceAll("\n", " ")}`;
       
      if (this.config.showWarningsOnce === true) {
        // Add remark.summary and remark.text to the remarksCollector array. Elements in this array will not be displayed again
        this.remarksCollector.push(remark.summary, remark.text);
        }
      }
    }

    if (marquee.textContent !== "") {
      while (marquee.textContent.length < 3000) {
        marquee.textContent += marquee.textContent;
      }
    }

    cellContainer.appendChild(marquee);
    cell.appendChild(cellContainer);
    row.appendChild(cell);

    return row;
  }

  getDeparturesTableRow (departure, index, departuresCount, unreachableCount) {
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

    for (const key of this.config.tableHeaderOrder) {
      const cell = this.getCell(key, departure);
      row.appendChild(cell);
    }

    return row;
  }

  getCell (key, departure) {
    let cell;

    switch (key) {
      case "time": {
        this.time = departure.when;
        // Use planned time if canceled
        if (departure.canceled === true) {
          this.time = departure.plannedWhen;
        }

        // Get time cell
        cell = this.getTimeCell(this.time, departure.delay);

        // Add class if canceled
        if (departure.canceled === true) {
          cell.className += " mmm-pth-canceled";
        }

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
        let {platform} = departure;
        if (platform === null) {
          platform = departure.plannedPlatform;
        }
        if (platform === null) {
          platform = "";
        }
        cell = this.getPlatformCell(platform);
        break;
      }
    }

    return cell;
  }

  getTimeCell (departure, delay) {
    const time = this.getDisplayDepartureTime(departure, delay);
    const cell = document.createElement("td");

    if (dayjs(departure).isValid()) {
      cell.className = "mmm-pth-time-cell";
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

  getDelaySpan (delay) {
    const delaySpan = document.createElement("span");
    delaySpan.textContent = this.getDelay(delay);

    let cssClass = "dimmed";

    if (this.config.useColorForRealtimeInfo && typeof delay === "number") {
      cssClass = delay > 0
        ? "mmm-pth-has-delay"
        : "mmm-pth-to-early";
    }

    delaySpan.className = `mmm-pth-delay ${cssClass}`;

    return delaySpan;
  }

  getDelay (delay) {
    this.delayString = this.config.noRealtimeDelayString;
    if (typeof delay === "number") {
      // convert seconds to minutes
      this.delayString = delay / 60;
      // round to one digit after comma
      this.delayString = Math.round(this.delayString * 10) / 10;
      // add "+" or "-" sign
      const sign = delay < 0
        ? "-"
        : "+";
      this.delayString = sign + this.delayString;
    }

    return this.delayString;
  }

  getDisplayDepartureTime (when, delay) {
    let time = dayjs(when);
    let format = "HH:mm";

    if (this.config.timeFormat === 12) {
      format = "h:mm A";
    }

    if (this.config.showAbsoluteTime) {
      time = dayjs(when).subtract(delay, "seconds");
      return time.format(format);
    }

    if (dayjs(when).diff(dayjs()) > this.config.showRelativeTimeOnlyUnder) {
      return time.format(format);
    }

    return time.fromNow();
  }

  getLineId (lineName) {
    this.lineId = lineName;
    if (lineName.search(" ") === -1) {
      const lineNameWithoutSpaces = lineName.replaceAll(/\s/gu, "");
      const firstNumberPosition = lineNameWithoutSpaces.search(/\d/u);
      this.lineId = lineNameWithoutSpaces;

      if (firstNumberPosition > 0) {
        this.lineId = lineNameWithoutSpaces.slice(firstNumberPosition);
      }
    } else {
      [, this.lineId] = lineName.split(" ");
    }

    return this.lineId;
  }

  getLineCell (lineName) {
    let line;

    if (this.config.showOnlyLineNumbers) {
      line = this.getLineId(lineName);
    } else {
      line = lineName;
    }

    const lineDiv = document.createElement("div");
    lineDiv.textContent = line;
    lineDiv.className = `${this.getLineCssClass(lineName)} mmm-pth-text-center`;

    return this.getTableCell(lineDiv);
  }

  getLineCssClass (lineName) {
    if (this.config.showColoredLineSymbols) {
      return this.getColoredCssClass(lineName);
    }

    return "mmm-pth-sign mmm-pth-bwl-line-sign";
  }

  /**
   * Get product of a line name
   *
   * Some HAFAS interfaces output line names with a space after the product name and
   * some do not. As an example: `RB50` <->` RB 50`.
   * This function returns the product name. In the two examples already mentioned
   * (`RB50` and` RB 50`) the string `RB` would be returned. If there is no product name
   * (if the line name starts with a digit), `undefined` is returned.
   * @param  {string} lineName    The line name as it was delivered by the HAFAS API.
   * @returns {string} product     The product ('RB', 'S', 'U', ...).
   */
  getProduct (lineName) {
    this.product = lineName;
    if (lineName.search(" ") === -1) {
      const lineNameWithoutSpaces = lineName.replaceAll(/\s/gu, "");
      const firstNumberPosition = lineNameWithoutSpaces.search(/\d/u);
      this.product = lineNameWithoutSpaces;

      if (firstNumberPosition > 0) {
        this.product = lineNameWithoutSpaces.slice(0, firstNumberPosition);
      }
    } else {
      [this.product] = lineName.split(" ");
    }

    return this.product;
  }

  /**
   * Get css class names
   *
   * Class names are returned depending on the line name. This enables CSS styles
   * to be defined on the basis of various properties.
   * @param  {string} lineName     The linename as it was delivered by the HAFAS API.
   * @returns {string} classNames   Series of class names
   */
  getColoredCssClass (lineName) {
    let classNames = "mmm-pth-sign";
    const product = this.getProduct(lineName);
    const DBProducts = ["IC", "ICE", "RE", "RB", "S"];
    const ignoreShowOnlyLineNumbers = ["IC", "ICE", "RE", "RB", "S", "U"];

    if (DBProducts.includes(product)) {
      classNames += " mmm-pth-db-standard";
    }

    if (
      ignoreShowOnlyLineNumbers.includes(product) && this.config.showOnlyLineNumbers
    ) {
      classNames += ` mmm-pth-${product.toLowerCase()}-with-product-name`;
    }

    classNames += ` ${product.toLowerCase()}`;
    classNames += ` ${lineName.replaceAll(/\s/gu, "").toLowerCase()}`;

    return classNames;
  }

  getDirectionCell (direction) {
    const truncatePosition = 26;
    let content = this.getProcessedDirection(direction);
    let className = "mmm-pth-direction-cell";

    if (
      this.config.marqueeLongDirections && content.length > truncatePosition
    ) {
      content = document.createElement("span");
      content.textContent = this.getProcessedDirection(direction);
      className += " mmm-pth-marquee";
    }

    if (!this.config.showAbsoluteTime) {
      className += " mmm-pth-text-left";
    }

    return this.getTableCell(content, className);
  }

  getProcessedDirection (direction) {
    const replacements = this.config.replaceInDirections;
    let processed = direction;

    for (const key of Object.keys(replacements)) {
      processed = processed.replaceAll(key, replacements[key]);
    }

    return processed;
  }

  getPlatformCell (platform) {
    const className = "mmm-pth-platform-cell mmm-pth-text-center";
    return this.getTableCell(platform, className);
  }

  getRowOpacity (index, departuresCount) {
    if (!this.config.fadeReachableDepartures) {
      return 1;
    }

    const threshold = departuresCount * this.config.fadePointForReachableDepartures;
    let opacity = 1;
    const startOpacity = 0.8;
    const endOpacity = 0.2;
    const opacityDiff = (startOpacity - endOpacity) / (departuresCount - threshold);

    if (index > threshold) {
      const fadingIndex = index - threshold;
      const currentOpacity = fadingIndex * opacityDiff;
      opacity = startOpacity - currentOpacity;
    }

    return opacity;
  }

  getUnreachableRowOpacity (index, count) {
    if (!this.config.fadeUnreachableDepartures) {
      return 1;
    }

    const startOpacity = 0.3;
    const endOpacity = 0.6;
    const opacityDiff = (endOpacity - startOpacity) / count;

    if (index + 1 === count) {
      return endOpacity;
    }

    return startOpacity + opacityDiff * index;
  }

  getRulerRow () {
    this.row = document.createElement("tr");
    this.cell = document.createElement("td");

    this.cell.colSpan = 3;
    this.cell.className = "mmm-pth-ruler-cell";
    this.row.appendChild(this.cell);

    return this.row;
  }
}
