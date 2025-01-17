# MMM-PublicTransportHafas [![GitHub license](https://img.shields.io/github/license/KristjanESPERANTO/mmm-publictransporthafas?style=plastic)](https://github.com/KristjanESPERANTO/mmm-publictransporthafas/blob/master/LICENSE) [![GitHub issues](https://img.shields.io/github/issues/KristjanESPERANTO/mmm-publictransporthafas)](https://github.com/KristjanESPERANTO/mmm-publictransporthafas/issues) [![GitHub forks](https://img.shields.io/github/forks/KristjanESPERANTO/mmm-publictransporthafas)](https://github.com/KristjanESPERANTO/mmm-publictransporthafas/network) [![GitHub stars](https://img.shields.io/github/stars/KristjanESPERANTO/mmm-publictransporthafas)](https://github.com/KristjanESPERANTO/mmm-publictransporthafas/stargazers)

**MMM-PublicTransportHafas** is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) to display public transport departures.

- [Description](#description)
- [How it works](#how-it-works)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Update](#update)
- [How to get the `stationID`](#how-to-get-the-stationid)
- [Configuration](#configuration)
- [Multiple instances](#multiple-instances)
- [Providing a custom CSS file](#providing-a-custom-css-file)
- [Technical background details](#technical-background-details)
- [Special Thanks](#special-thanks)
- [Contributing](#contributing)

## Description

This module shows live public transport information in Germany for all stations known to the Deutsche Bahn system. Most public transportation providers in Germany providing information for that system so the coverage should be quite good.

For the default profile `db` the data is provided by the [db-vendo-client](https://github.com/public-transport/db-vendo-client). For other profiles the data is provided by the [hafas-client](https://github.com/public-transport/hafas-client).

Even in other european countries this module should work as HAFAS is widely used throughout Europe.

You can very easy adapt the shapes and line colors of your local transport companies. See [Providing a custom CSS file](#providing-a-custom-css-file).

## How it works

After you installed MMM-PublicTransportHafas you just configure it to your needs and that’s it. The only config you really need to set is the stationID property. This determines the station you want to display. Everything else is covered by defaults but can be configured by you anyway. For instance you can enter a time you need to get to the station (`timeToStation` in config). The module then only shows departures you can reach respecting the set time.

For more information see the [Configuration](#configuration) section.

## Screenshots

<!-- prettier-ignore-start -->
|![Example: Goerdelerring Leipzig, all directions](img/Goerdelerring_all.png)<br>_Leipzig, Goerdelerring (all directions)_|![Example: Goerdelerring Leipzig, heading to main station](img/Goerdelerring_to_hbf.png)<br>_Leipzig, Goerdelerring (heading to main station)_|
|---|---|
|![Example: Hauptbahnhof, Leipzig, only tram](img/Hauptbahnhof_tram_only.png)<br>_Hauptbahnhof, Leipzig (displaying only trams and two unreachable departures)_|![Example: Hauptbahnhof, Leipzig, only regional and national trains](img/Hauptbahnhof_train_only.png)<br>_Hauptbahnhof, Leipzig (displaying only regional and national trains)_|
|![Example: Leuschner Platz with relative departure time and reordered columns](img/Leuschner_Platz_relative.png)<br>_Leuschner Platz, Leipzig (displaying departure times in relative format and reordered columns)_| |

![Example: Multiple instances in Berlin, showing the last update time](img/UpdateTimeDisplayed.png)<br>_Several instances in Berlin, showing the last update time_
<!-- prettier-ignore-end -->

## Installation

Just clone the module into your modules directory and install the dependencies:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas
cd MMM-PublicTransportHafas
npm ci
```

## Update

Just enter the module's directory, pull the update and install the dependencies:

```bash
cd ~/MagicMirror/modules/MMM-PublicTransportHafas
git pull
npm ci
```

## How to get the `stationID`

You need the `stationId` for the station whose departures should be displayed.

Here's how to find out the `stationId`:

1. You have to be in the modules directory (`~/MagicMirror/modules/MMM-PublicTransportHafas`).
2. Then run the following command: `npm run query`.
3. Enter a station name. It is useful to enter a city name too since the system knows a lot of stations even outside Germany.
4. The result could contain one or more possible stations with valid IDs.
5. Use the appropriate ID as `stationId` in the configuration of the module.

The following example shows a query for "Leipzig, Wilhelm-Leuschner-Platz". This station is included two times in the result. You have to experiment which ID gives the best results.

```bash
Enter an address or station name: Leipzig, Wilhelm-Leuschner-Platz

Stops found for 'Leipzig, Wilhelm-Leuschner-Platz':

 > Stop: Leipzig Wilhelm-Leuschner-Platz
   ID: 8012202
   Transport product(s): Regio, S-Bahn, Bus, Tram

 > Stop: Wilhelm-Leuschner-Platz, Leipzig
   ID: 955252
   Transport product(s): Regio, S-Bahn, Bus, Tram

 > Stop: Wilhelm-Leuschner-Platz, Weiterstadt
   ID: 115849
   Transport product(s): Regio, Bus

 > Stop: Wilhelm-Liebknecht-Platz, Leipzig
   ID: 956558
   Transport product(s): Bus, Tram
```

By default, the module uses the `db` profile. In some cases it can be advantageous to use a different profile - e.g. the default profile often does not provide platform information from local transport companies. [Here](https://github.com/public-transport/hafas-client/blob/master/p/readme.md) you can find the name of all supported interfaces. Just add the name as a parameter to the command. Like `sbb` for the profile of Swiss Railways.

```bash
npm run query sbb
```

## Configuration

### Configuration options

The module is quite configurable. The only option you really have to set is `stationID` - all other options are **optional**.

<!-- prettier-ignore-start -->
| Option                            | Description    |
|-----------------------------------|----------------|
| `hafasProfile`                    | <p>The name of the hafas profile.</p><p>**Type:** `string`<br>**Example:** `"insa"`<br>**Default value:** `"db"`</p><p>**Note:** In most cases you don't need to change the value. You can find supported profiles and there names [here](https://github.com/public-transport/hafas-client/blob/master/p/readme.md).</p><p>Each profile uses its own StationIDs. So if you change the profile, you have to find out the StationID again.</p>|
| `stationID`                       | <p>The ID you want to display departures for.</p><p>**REQUIRED**<br>**Type:** `string`<br>**Example:** `"8012202"`<br>**Default value:** none</p><p>**Note:** How to get the ID is described [here](#how-to-get-the-stationid).</p>|
| `stationName`                     | <p>The name of the station as it should appear on the display.</p><p>**Type:** `string`<br>**Example:** `"Wilhelm-Leuschner-Platz"`<br>**Default value:** none</p><p>**Note:** If you leave this setting, `headerPrefix` and `headerAppendix` blank the module will show an empty header.</p>|
| `headerPrefix`                    | <p>The text to be prepended to the `stationName`.</p><p>**Type:** `string`<br>**Example:** `"von"` (Will result in “von Wilhelm-Leuschner-Platz” being displayed.)<br>**Default value:** `""`</p><p>**Note:** A blank between `headerPrefix` and `stationName` is automatically inserted.</p>|
| `headerAppendix`                  | <p>The text to be prepended to the `stationName`.</p><p>**Type:** `string`<br>**Example:** `"(Richtung HBF)"`<br>**Default value:** `""`</p><p>**Note:** A blank between `headerAppendix` and `stationName` is automatically inserted.</p>|
| `updatesEvery`                    | <p>The time in seconds when the displayed departures should be updated.</p><p>**Type:** `integer`<br>**Example:** `60` (The departures will be refreshed every minute.)<br>**Default value:** `120`<br>**Unit:** `seconds`</p><p>**Note:** The minimal refresh time is 30 seconds.</p>|
| `direction`                       | <p>An ID of a station. It is used to display only those departures heading to this station.</p><p>**Type:** `string`<br>**Example:** `"954609"`<br>**Default value:** `""`</p><p>**Note:** It is not necessary to find the ID of the end station. Just use the next station which is on the route you are after.<br>It is not possible to list multiple IDs. If you want to display different directions for one station use multiple instances of this module.</p>|
| `ignoredLines`                    | <p>An array of strings describing the lines you want to exclude from the displayed departures.</p><p>**Type:** `array`<br>**Example:** `[ "STR 11", "STR 10" ]` (Displays all lines except tram 10 and 11.)<br>**Default value:** `[]`</p><p>**Note:** You need to provide the line names exactly as they are otherwise displayed. This setting is case sensitive. Blanks need to be exactly as they are display. If a line is usually displays as `BUS  89` (two blanks) you need to type exactly that into the array.</p>|
| `ignoreRelatedStations`           | <p>Ignore departures from related stations or not.</p><p>**Type:** `boolean`<br>**Default value:** `false`<br>**Possible values:** `true` and `false`<p>**Note:** Usually you don't need to touch this option.</p>|
| `excludedTransportationTypes`     | <p>An array of strings describing the transportation types you want to exclude from the displayed departures.</p><p>**Type:** `array`<br>**Example:** `[ "suburban", "bus" ]`<br>**Default value:** `[]`<br>**Possible values:** <table><tr><th>Type</th><th>Use in Germany</th></tr><tr><td>`"bus"`</td><td>bus</td></tr><tr><td>`"ferry"`</td><td>F&auml;hre</td></tr><tr><td>`"express"`</td><td>?</td></tr><tr><td>`"national"`</td><td>IC trains</td></tr><tr><td>`"nationalExpress"`</td><td>ICE trains</td></tr><tr><td>`"regional"`</td><td>RB or RE</td></tr><tr><td>`"suburban"`</td><td>S-Bahn</td></tr><tr><td>`"subway"`</td><td>U-Bahn</td></tr><tr><td>`"tram"`</td><td>Tram</td></tr><tr><td>`"taxi"`</td><td>Taxi</td></tr></table></p>|
| `timeToStation`                   | <p>An integer indicating how long it takes you to get to the station.</p><p>**Type:** `integer`<br>**Example:** `5`<br>**Default value:** `10`<br>**Unit:** `minutes`</p>|
| `timeInFuture`                    | <p>An integer indicating how far in the future a departure can be to be still included in the shown departures.</p><p>**Type:** `integer`<br>**Example:** `60` (Show departures for the next hour.)<br>**Default value:** `40`<br>**Unit:** `minutes`</p><p>**Note:** Use this setting on stations where there is a big time gap between departures. This way you will see more than one or two departures. **Don’t use** this setting to limit the amount of displayed departures! The module will set this value to be at least `timeToStation + 30` anyway. Use the option `maxReachableDepartures` to limit the displayed departures.</p>|
| `marqueeLongDirections`           | <p>A boolean value indicating whether you want scrolling long destination name or not.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` destination names longer than 24 characters will scroll through the display. If set to `false` names will be truncated at 24 characters.</p>|
| `replaceInDirections`             | <p>An object defining strings which are to be replaced in the displayed directions.</p><p>**Type:** `object`<br>**Example:** `{ "Leipzig": "LE", "\\(Saale\\)": "", "Hbf": "" }`<br>**Default value:** `{}`</p><p>**Note:** The strings which appear as the keys of the object will be replaced by their values. Given a direction `"Leipzig, Hbf"` and the above mentioned example setting the displayed direction will be `"LE,"`. `"Leipzig"` was replaced by `"LE"` and `"Hbf"` was replaced by the empty string. If you want to replace special symbols like `"("`, `")"` or `"-"` you must escape these characters by placing **two** `"\"` in front of the character (see example above).</p>|
| `showColoredLineSymbols`          | <p>A boolean value indicating whether the line symbols should be colored or black and white.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` it is possible to decorate the line labels with the colors which are used in your town. This module comes with decorations for Leipzig. To provide your own colors see [Providing a custom CSS file](#providing-a-custom-css-file).</p>|
| `useColorForRealtimeInfo`         | <p>A boolean value indicating whether delays should be displayed in color.</p><p>**Type:** `boolean`**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` a delay will be displayed in red. Values `<= 0` (transport arrives in time or early) will be displayed in green. If you want to customize that see [Providing a custom CSS file](#customizing-the-color-for-delays).</p>|
| `showAbsoluteTime`                | <p>A boolean indicating whether the departure time should be displayed as an absolute value or not.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` the departure time would be displayed as “10:15+0”. If set to `false` the departure time would be displayed in a relative manner like so: `in 5 minutes`. The displayed string is determined by your locale. If your locale is set to `de` the string would be `in 5 Minuten`.</p> |
| `noRealtimeDelayString`           | <p>The string that is displayed as delay if no real-time departure time data is available.</p><p>**Type:** `String`<br>**Default value:** `"+?"`</p><p>**Note:** Set it to `""` if you don't want to display a delay string if there is no real-time data. Use an emoji like `"⚠"` if you want mark departures without real-time data with a symbol.<br>This is only relevant if `showAbsoluteTime` is set to `true`.</p> |
| `showRelativeTimeOnlyUnder`       | <p>Display the time only relatively if the departure takes place in less than 10 minutes (600000 milliseconds).</p><p>**Type:** `integer`<br>**Default value:** `10*60*1000` (10 minutes)<br></p><p>**Note:** The value is only relevant if `showAbsoluteTime: false`.</p> |
| `showTableHeaders`                | <p>A boolean indicating whether a table header should be shown or not.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `false` no table headings like “time” or “direction” will be shown. Also no symbols are shown.</p>|
| `showTableHeadersAsSymbols`       | <p>A boolean value indicating whether table headers should be shown as symbols or text.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` table headers will use symbols, else text will be shown. This setting is only effective if `showTableHeaders` is set to `true`. The shown text is available in English and German. Feel free to add translations to this project.</p> |
| `showWarningRemarks`              | <p>A boolean value indicating whether warnings attached to a trip should be shown.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` and a warning is attached to a trip it will be shown in a additional row. This default width of this row is `80ch`, the whole table is then given this width. If you want to change that, set a different value in your `custom.css` such as: `.mmm-pth-warning-remarks { width: 70ch; }`.</p> |
| `warningRemarksFilter`            | <p>An array containing strings. If a warning contains any of these strings, it is not displayed.</p><p>**Type:** `array`<br>**Example:** `[ "verlegt", "beendet" ]`<br>**Default value:** `[ ]`</p>|
| `showWarningsOnce`                | <p>A boolean value indicating whether the same warning is hidden for next departures. </p><p>**Type:** `boolean`<br>**Default value:** `false`<br>**Possible values:** `true` and `false`</p>|
| `tableHeaderOrder`                | <p>An array determining the order of the table headers.</p><p>**Type:** `array`<br>**Example:** `[ "line", "direction", "time", "platform" ]`<br>**Default value:** `[ "time", "line", "direction", "platform" ]`</p><p>**Note 1:** If the HAFAS API does not provide information about the platforms of your station, you can remove the column here by removing `"platform"`.</p><p>**Note 2:** Sort the table headings as you like it. Please keep in mind that you can only use the values `"line"`, `"time"`, `"direction"` and `"platform"`.</p>|
| `maxUnreachableDepartures`        | <p>An integer value denoting how many unreachable departures should be displayed.</p><p>**Type:** `integer`<br>**Example:** `3`<br>**Default value:** `0`</p><p>**Note:** A departure is unreachable if you can't reach the station in time for the departure with respect to your `timeToStation` setting.<br>Sometimes it is useful to set this option to a value greater than `0` if you are the type of person which walks really fast. Maybe other users of the mirror usually take 10 minutes to the station but you take only 5. So you’ll see also departures the other users couldn’t reach.</p>|
| `maxReachableDepartures`          | <p>An integer value denoting how many reachable departures should be displayed.</p><p>**Type:** `integer`<br>**Example:** `5`<br>**Default value:** `7`</p><p>**Note:** A departure is reachable if you can make it to the station in time for the departure with respect to your `timeToStation` setting.</p>|
| `fadeUnreachableDepartures`       | <p>A boolean value indicating whether unreachable departures should be dimmed.</p><p>**Type:** `boolean`<br>**Example:** `false`<br>**Default value:** `true`</p>|
| `fadeReachableDepartures`         | <p>A boolean value indicating whether reachable departures should be faded out.</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` departures after `fadePointForReachableDepartures` will be gradually faded out so that the last departure is barely visible.</p>|
| `fadePointForReachableDepartures` | <p>A floating point value indicating where to start the fading of departure rows.</p><p>**Type:** `float`<br>**Example:** `0.5` (Start fading after half of the rows.)<br>**Default value:** `0.25`</p><p>**Note:** This value is actually a percentage. The Default value of `0.25` denotes that after a quarter of the visible rows set by `maxReachableDepartures` the fading should start. This setting is only effective if `fadeReachableDepartures` is set to `true`.</p>|
| `customLineStyles`                | <p>A string value describing the name of a custom CSS file.</p><p>**Type:** `string`<br>**Example:** `"dresden"`<br>**Default value:** `"leipzig"`</p><p>**Note:** If the setting `showColoredLineSymbols` is `true` the module will try to use colored labels for the line name. Per default it uses the colors used in Leipzig. This style works best if `showOnlyLineNumbers` is set to `true`. If it doesn’t suit your taste you can provide your own settings. See [Providing a custom CSS file](#providing-a-custom-css-file).</p>|
| `showOnlyLineNumbers`             | <p>A boolean value denoting whether the line name should be displayed as a number only or the full name should be used.</p><p>**Type:** `boolean`<br>**Default value:** `false`<br>**Possible values:** `true` and `false`</p><p>**Note:** If set to `true` the module will try to separate line numbers from the line name and display only these. If the line name is “STR 11” only “11” will be displayed. This only works if there are blanks present in the line name. This setting is only tested with departures in Leipzig. If you encounter problems [let me know](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues).</p>|
| `displayLastUpdate`               | <p>If true this will display the last update time at the end of the task list. See screenshot above</p><p>**Type:** `boolean`<br>**Default value:** `true`<br>**Possible values:** `true` and `false`</p>|
| `displayLastUpdateFormat`         | <p>Format to use for the time display if displayLastUpdate:true</p><p>**Type:** `string`<br>**Example:** `'HH:mm:ss'`<br>**Default value:** `'dd - HH:mm:ss'`</p>See [dayjs.js formats](https://day.js.org/docs/en/parse/string-format) for the other format possibilities.</p>|
| `animationSpeed`                  | <p>Speed of the update animation.</p><p>**Type:** `integer`<br>**Possible values:** `0` - `5000`<br>**Default value:** `2000`<br>**Unit:** `milliseconds`</p>|
<!-- prettier-ignore-end -->

### Configuration example

Here is an example for an entry in the modules array in your `config.js`:

```javascript
    {
      module: "MMM-PublicTransportHafas",
      position: "bottom_right",

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
```

## Multiple instances

It is possible to use multiple instances of this module just by adding another entry of the MMM-PublicTransportHafas module to the `config.js` of your mirror.

You can even use the same `stationID` in different instances. So you can display in one instance something like “main station heading eastbound” and in another instance “main station heading westbound”.

## Providing a custom CSS file

**Note:** For some cities, separate CSS files have already been created that contain the local line colors. You can look them up in the `css` directory. If you create a file for another city, feel free to send it to us.

### Colored line labels

If you set `showColoredLineSymbols` to `true` the module will try to colorize the line symbols. This is done by appending a CSS class to the line symbol. This class is named after the line name but blanks are left out and all letters are lower case. So if the line name is “STR 11” the appended CSS class name is `.str11`.

To provide your own classes create a CSS file in the `css` directory of the module. It must be named like `<your custom name>-lines.css`, where `<your custom name>` can be any valid filename but should not contain blanks or dots. The part `<your custom name>` is then used in the config file as value for the `customLineStyles` property.

In the example above “leipzig” is used as value for the `customLineStyles` property. Therefore there must be a file named `leipzig-lines.css` inside the `css` directory. If this is not the case the module won’t be started and it will not be visible. The browser’s console will show an error.

Basically you can set whatever you want in the CSS file but it is recommended to only set the foreground and background color and the width. In some cases it is useful to change the border radius too. See the file `css/leipzig-lines.css` for reference and as a guideline.

#### Example

In Leipzig the tram lines 2, 8 and 9 use a yellow color. Since the lines share the same settings the CSS class names are listed with commas so that the settings apply to each listed class.

```css
.str2,
.str8,
.str9 {
  background-color: #f8c623; /* yellow background */
  color: black; /* text color black */
}
```

Some night buses in Leipzig use an orange-ish color.

```css
.busn1,
.busn1e,
.busn5,
.busn5e,
.busn8,
.busn8e {
  background-color: #ee9f2e; /* orange-ish background */
  color: #164585; /* blue-ish text color */
}
```

### Customizing the color for delays

Alongside the departure time a small figure displays the delay as reported by the transport provider.

Delays are displayed as red.

![Time with delay](img/time_with_delay.png)

No delay or negative delays (the transport will arrive early) are displayed in green.

![Time without delay](img/time_without_delay.png)

Sometimes there is no real-time data for a departure, in that case it is displayed with a question mark:

![Time without real time data](img/time_without_real_time_data.png)

If you want to customize that include the classes `mmm-pth-has-delay` and `mmm-pth-to-early` in your custom CSS file and make the appropriate settings.

## Technical background details

To limit the server request only when the module is displayed and/or the user is present, the update will be stopped when no instance of the module are displayed (module hidden e.g. by a [MMM-Carousel](https://github.com/lawrence-jeff/MMM-Carousel), [MMM-Pages](https://github.com/edward-shen/MMM-pages) or [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control)). The update will also be stopped by the use of a PIR sensor using the module [MMM-PIR-Sensor](https://github.com/paviro/MMM-PIR-Sensor) (that sends the notification 'USER_PRESENCE'). No special configuration is needed for this behavior.

Thanks to @AgP42 for this functionality!

## Special Thanks

- [Michael Teeuw](https://github.com/MichMich) for creating the inspiring project [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror). You can sponsor the MagicMirror² project through [GitHub](https://magicmirror.builders/#donate).
- [Jannis Redmann](https://github.com/derhuerst) for creating the [db-vendo-client](https://github.com/public-transport/db-vendo-client) and the [hafas-client](https://github.com/derhuerst/hafas-client) which provides the data for this module. You can support him and many of his public transport projects via [GitHub](https://github.com/sponsors/derhuerst) or [Patreon](https://www.patreon.com/derhuerst).
- [deg0nz](https://github.com/deg0nz) for creating the [MMM-PublicTransportBerlin](https://github.com/deg0nz/MMM-PublicTransportBerlin) module, on which this one is originally based.
- [Ray Wojciechowski](https://github.com/raywo) for initiating this module and maintaining it until 2018.
- The community of MagicMirror² for help in the development process and all contributors for finding and fixing errors in this module.

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### Developer commands

- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.
- `npm run release` - Bump version for release.
- `npm run test` - Run linting and formatter checks + Run spelling check.
- `npm run test:spelling` - Run spelling check.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Changelog

All notable changes to this project will be documented in the [CHANGELOG.md](./CHANGELOG.md) file.
