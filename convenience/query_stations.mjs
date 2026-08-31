/* eslint-disable no-console */
import * as readline from "node:readline";
import process from "node:process";
import {readdir} from "node:fs/promises";

let profileName;
const productMap = {};
const profileNames = {
  avv: "Aachener Verkehrsverbund",
  bart: "Bay Area Rapid Transit",
  bls: "BLS AG",
  bvg: "Berliner Verkehrsbetriebe",
  cfl: "Société Nationale des Chemins de Fer Luxembourgeois",
  cmta: "Capital Metropolitan Transportation Authority",
  dart: "Des Moines Area Regional Transit Authority",
  "db-busradar-nrw": "DB Busradar NRW",
  insa: "Nahverkehr Sachsen-Anhalt / INSA",
  invg: "Ingolstädter Verkehrsgesellschaft",
  "irish-rail": "Iarnród Éireann / Irish Rail",
  ivb: "Innsbrucker Verkehrsbetriebe",
  kvb: "Kölner Verkehrs-Betriebe",
  "mobil-nrw": "mobil.nrw",
  "mobiliteit-lu": "Mobilitéitszentral Luxembourg",
  nahsh: "Nahverkehrsverbund Schleswig-Holstein",
  nvv: "Nordhessischer Verkehrsverbund",
  oebb: "Österreichische Bundesbahnen",
  ooevv: "Oberösterreichischer Verkehrsverbund",
  pkp: "Polskie Koleje Państwowe",
  rejseplanen: "Rejseplanen Denmark",
  rmv: "Rhein-Main-Verkehrsverbund",
  rsag: "Rostocker Straßenbahn AG",
  saarfahrplan: "Saarfahrplan / VGS",
  salzburg: "Salzburg",
  "sbahn-muenchen": "S-Bahn München",
  sncb: "Belgian National Railways",
  stv: "Steirischer Verkehrsverbund",
  svv: "Salzburger Verkehrsverbund",
  tpg: "Transports publics genevois",
  vbb: "Verkehrsverbund Berlin-Brandenburg",
  vbn: "Verkehrsverbund Bremen/Niedersachsen",
  vkg: "Verkehrsverbund Kärnten",
  vmt: "Verkehrsverbund Mittelthüringen",
  vor: "Verkehrsverbund Ost-Region",
  vos: "Verkehrsgemeinschaft Osnabrück",
  vrn: "Verkehrsverbund Rhein-Neckar",
  vsn: "Verkehrsverbund Süd-Niedersachsen",
  vvt: "Verkehrsverbund Tirol",
  vvv: "Verkehrsverbund Vorarlberg",
  zvv: "Zürcher Verkehrsverbund"
};

/**
 * Create an array without values that occur multiple times.
 * @param {Array} array An array that could have duplicate values.
 * @returns {Array} An array without duplicate values.
 */
function arrayUnique (array) {
  return [...new Set(array)];
}

/**
 * Get proper names for the product keys.
 * @param {object} products An object with the available transport products as a keys.
 * @returns {string} A list of transport products as a string.
 */
function refineProducts (products) {
  if (!products) {
    return "none";
  }

  const availableProducts = Object.keys(products).filter((key) => products[key]);

  const availableProductsReadable = arrayUnique(availableProducts.map((product) => productMap[product]));

  return availableProductsReadable.join(", ");
}

/**
 * Output the information about the station on the console.
 * @param {object} station The station it's about.
 */
function printStationInfo (station) {
  if (station.id && station.name) {
    console.info(` > Stop: ${station.name}\n   ID: ${
      station.id
    }\n   Transport product(s): ${refineProducts(station.products)} \n`);
  }
}

function getUserInput (question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(
      question,
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
}

async function getProfileName () {
  const profileArgument = process.argv[2];
  const profileDirectory = new URL("../node_modules/hafas-client/p/", import.meta.url);
  const availableProfiles = (await readdir(profileDirectory, {withFileTypes: true}))
    .filter((entry) => entry.isDirectory() && entry.name !== "db")
    .map((entry) => entry.name)
    .sort();

  if (profileArgument) {
    if (!availableProfiles.includes(profileArgument)) {
      throw new Error(`Unknown or unsupported query profile: ${profileArgument}`);
    }
    return profileArgument;
  }

  console.info("Select a regional hafas-client profile (DB profiles are currently unavailable for this query):\n");
  availableProfiles.forEach((profile, index) => {
    console.info(` ${index + 1}. ${profile} - ${profileNames[profile]}`);
  });

  const selection = await getUserInput("Enter profile number: ");
  const profile = availableProfiles[Number(selection) - 1];
  if (!profile) {
    throw new Error("Invalid profile selection");
  }
  return profile;
}

async function requestStations (client, stationName) {
  const opt = {
    addresses: false,
    poi: false,
    results: 10,
    stations: true
  };
  const response = await client.locations(
    stationName,
    opt
  );
  console.info(`\nStops found for '${stationName}':\n`);
  for (const station of response) {
    printStationInfo(station);
  }
}

async function query (profile, createClient) {
  const stationName = await getUserInput("Enter an address or station name: ");
  if (profile) {
    const client = createClient(
      profile,
      "MMM-PublicTransportHafas"
    );

    try {
      await requestStations(
        client,
        stationName
      );
    } catch (error) {
      console.error(`\n Error occurred while searching for '${stationName}': ${error.message || error}\n`);
    }
  }
}

async function importProfile () {
  try {
    profileName = await getProfileName();
    console.info(`Using hafas-client profile: ${profileName}\n`);
    const hafasClient = await import("hafas-client");
    const createClient = hafasClient.createClient;
    const hafas = await import(`hafas-client/p/${profileName}/index.js`);
    const profile = hafas.profile;

    Object.keys(profile.products).forEach((key) => {
      const productMapKey = profile.products[key].id;
      const productMapName = profile.products[key].name;
      productMap[productMapKey] = productMapName;
    });

    query(
      profile,
      createClient
    );
  } catch (error) {
    console.error(
      "\nError: Did you choose the right profile name?\n\n",
      error.message || error,
      "\n"
    );
  }
}

importProfile();

