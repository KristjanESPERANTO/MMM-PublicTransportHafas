/* eslint-disable no-console */
import * as readline from "node:readline";
import process from "node:process";

let profileName;
const productMap = {};

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

function getUserInput () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(
      "Enter an address or station name: ",
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
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
  const stationName = await getUserInput();
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
    let profile;
    let createClient;

    if (process.argv.length === 3 && process.argv[2] !== "db" && process.argv[2] !== "dbweb") {
      profileName = process.argv[2];
      console.info(`Using hafas-client profile: ${profileName}\n`);
      const hafasClient = await import("hafas-client");
      const createHafasClient = hafasClient.createClient;
      const hafas = await import(`hafas-client/p/${profileName}/index.js`);
      profile = hafas.profile;
      createClient = createHafasClient;
    } else {
      profileName = "db";
      if (process.argv[2] === "dbweb") {
        console.info(`
          Since the 'dbweb' profile doesn't resolve station names,
          the 'db' profile is used here instead. You can still use the
          given station IDs with the 'dbweb' profile in the config.
          `);
      }
      console.info(`Using db-vendo profile: ${profileName}\n`);
      const vendoClient = await import("db-vendo-client");
      const createVendoClient = vendoClient.createClient;
      const vendo = await import(`db-vendo-client/p/${profileName}/index.js`);
      profile = vendo.profile;
      createClient = createVendoClient;
    }

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

