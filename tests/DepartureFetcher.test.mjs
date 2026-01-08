import {beforeEach, describe, it} from "node:test";
// Mock the logger before importing DepartureFetcher
import Log from "./__mocks__/logger.mjs";
import assert from "node:assert";

globalThis.Log = Log;

// Import DepartureFetcher after mocking the logger
const DepartureFetcher = (await import("../core/DepartureFetcher.mjs")).default;

/**
 * Unit tests for DepartureFetcher.
 *
 * These tests verify the filtering, sorting and other algorithms used in DepartureFetcher
 * using the actual class methods.
 */

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Helper to create mock departure objects matching HAFAS API structure
 */
function createDeparture (overrides = {}) {
  const now = new Date();
  const when = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now

  return {
    tripId: "trip-123",
    when: when.toISOString(),
    plannedWhen: when.toISOString(),
    delay: 0,
    direction: "Hauptbahnhof",
    line: {
      id: "line-1",
      name: "STR 11",
      product: "tram"
    },
    stop: {
      id: "8012202",
      name: "Wilhelm-Leuschner-Platz"
    },
    ...overrides
  };
}

/**
 * Helper to create a DepartureFetcher instance without calling init()
 */
function createFetcher (configOverrides = {}) {
  const defaultConfig = {
    identifier: "test-fetcher",
    hafasProfile: "db",
    stationID: "8012202",
    timeToStation: 10,
    timeInFuture: 60,
    directions: [],
    ignoredLines: [],
    ignoreRelatedStations: false,
    excludedTransportationTypes: [],
    includedTransportationTypes: ["tram", "bus", "suburban", "subway", "regional"],
    maxReachableDepartures: 7,
    maxUnreachableDepartures: 3
  };

  return new DepartureFetcher({...defaultConfig, ...configOverrides});
}

// =============================================================================
// Tests: filterByTransportationTypes
// =============================================================================

describe("filterByTransportationTypes", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({
      includedTransportationTypes: ["tram", "bus"]
    });
  });

  it("should keep departures with included transportation types", () => {
    const departures = [
      createDeparture({line: {id: "1", name: "STR 11", product: "tram"}}),
      createDeparture({line: {id: "2", name: "BUS 89", product: "bus"}}),
      createDeparture({line: {id: "3", name: "S1", product: "suburban"}})
    ];

    const result = fetcher.filterByTransportationTypes(departures);

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].line.product, "tram");
    assert.strictEqual(result[1].line.product, "bus");
  });

  it("should return empty array when no types match", () => {
    fetcher = createFetcher({
      includedTransportationTypes: ["ferry"]
    });

    const departures = [
      createDeparture({line: {id: "1", name: "STR 11", product: "tram"}}),
      createDeparture({line: {id: "2", name: "BUS 89", product: "bus"}})
    ];

    const result = fetcher.filterByTransportationTypes(departures);

    assert.strictEqual(result.length, 0);
  });

  it("should return all departures when all types are included", () => {
    fetcher = createFetcher({
      includedTransportationTypes: ["tram", "bus", "suburban"]
    });

    const departures = [
      createDeparture({line: {id: "1", name: "STR 11", product: "tram"}}),
      createDeparture({line: {id: "2", name: "BUS 89", product: "bus"}}),
      createDeparture({line: {id: "3", name: "S1", product: "suburban"}})
    ];

    const result = fetcher.filterByTransportationTypes(departures);

    assert.strictEqual(result.length, 3);
  });
});

// =============================================================================
// Tests: filterByIgnoredLines
// =============================================================================

describe("filterByIgnoredLines", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({ignoredLines: []});
  });

  it("should filter out ignored lines", () => {
    fetcher = createFetcher({
      ignoredLines: ["STR 11", "BUS 89"]
    });

    const departures = [
      createDeparture({line: {id: "1", name: "STR 11", product: "tram"}}),
      createDeparture({line: {id: "2", name: "STR 10", product: "tram"}}),
      createDeparture({line: {id: "3", name: "BUS 89", product: "bus"}})
    ];

    const result = fetcher.filterByIgnoredLines(departures);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].line.name, "STR 10");
  });

  it("should keep all departures when ignoredLines is empty", () => {
    const departures = [
      createDeparture({line: {id: "1", name: "STR 11", product: "tram"}}),
      createDeparture({line: {id: "2", name: "STR 10", product: "tram"}})
    ];

    const result = fetcher.filterByIgnoredLines(departures);

    assert.strictEqual(result.length, 2);
  });

  it("should be case-sensitive", () => {
    fetcher = createFetcher({
      ignoredLines: ["str 11"] // lowercase
    });

    const departures = [createDeparture({line: {id: "1", name: "STR 11", product: "tram"}})];

    const result = fetcher.filterByIgnoredLines(departures);

    // Should NOT filter because case doesn't match
    assert.strictEqual(result.length, 1);
  });

  it("should handle exact spacing", () => {
    // double space in line name
    const departures = [createDeparture({line: {id: "1", name: "BUS  89", product: "bus"}})];

    // Single space should not match double space
    const result = fetcher.filterByIgnoredLines(departures);
    assert.strictEqual(result.length, 1);

    // Double space should match
    fetcher = createFetcher({ignoredLines: ["BUS  89"]});
    const result2 = fetcher.filterByIgnoredLines(departures);
    assert.strictEqual(result2.length, 0);
  });
});

// =============================================================================
// Tests: filterByStopId
// =============================================================================

describe("filterByStopId", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({stationID: "8012202"});
  });

  it("should filter departures from related stations", () => {
    const departures = [
      createDeparture({stop: {id: "8012202", name: "Wilhelm-Leuschner-Platz"}}),
      createDeparture({stop: {id: "8012203", name: "Related Station"}}),
      createDeparture({stop: {id: "8012202", name: "Wilhelm-Leuschner-Platz"}})
    ];

    const result = fetcher.filterByStopId(departures);

    assert.strictEqual(result.length, 2);
    assert.ok(result.every((dep) => dep.stop.id === "8012202"));
  });

  it("should return empty array when no departures match station", () => {
    const departures = [createDeparture({stop: {id: "8012203", name: "Other Station"}})];

    const result = fetcher.filterByStopId(departures);

    assert.strictEqual(result.length, 0);
  });
});

// =============================================================================
// Tests: adjustLeadTime
// =============================================================================

describe("adjustLeadTime", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({maxUnreachableDepartures: 3});
  });

  it("should halve lead time when too many unreachable departures", () => {
    fetcher.leadTime = 20;

    // 5 unreachable departures, but max is 3
    const unreachableDepartures = Array.from({length: 5}, () => createDeparture());

    fetcher.adjustLeadTime(unreachableDepartures);

    // Should be Math.round(20 / 2) + 1 = 11
    assert.strictEqual(fetcher.leadTime, 11);
  });

  it("should increase lead time when few unreachable departures", () => {
    fetcher.leadTime = 20;

    // Only 2 unreachable departures, max is 3
    const unreachableDepartures = Array.from({length: 2}, () => createDeparture());

    fetcher.adjustLeadTime(unreachableDepartures);

    // Should increase by 5
    assert.strictEqual(fetcher.leadTime, 25);
  });

  it("should not increase lead time above 45", () => {
    fetcher.leadTime = 46;

    const unreachableDepartures = Array.from({length: 2}, () => createDeparture());

    fetcher.adjustLeadTime(unreachableDepartures);

    // Should NOT increase because leadTime > 45
    assert.strictEqual(fetcher.leadTime, 46);
  });

  it("should still increase at exactly 45", () => {
    fetcher.leadTime = 45;

    const unreachableDepartures = Array.from({length: 2}, () => createDeparture());

    fetcher.adjustLeadTime(unreachableDepartures);

    assert.strictEqual(fetcher.leadTime, 50);
  });
});

// =============================================================================
// Tests: Time-based helper methods
// =============================================================================

describe("getTimeInFuture", () => {
  it("should return timeInFuture when no unreachable departures configured", () => {
    const fetcher = createFetcher({
      timeInFuture: 60,
      maxUnreachableDepartures: 0
    });

    const result = fetcher.getTimeInFuture();

    assert.strictEqual(result, 60);
  });

  it("should add leadTime when unreachable departures are configured", () => {
    const fetcher = createFetcher({
      timeInFuture: 60,
      maxUnreachableDepartures: 3
    });
    fetcher.leadTime = 20;

    const result = fetcher.getTimeInFuture();

    assert.strictEqual(result, 80); // 60 + 20
  });
});

describe("getArrayDiff helper", () => {
  it("should work with transportation type filtering use case", () => {
    // Simulate what happens in init() - all types minus excluded types
    const allTypes = ["tram", "bus", "suburban", "subway", "regional", "national"];
    const getArrayDiff = (arrayA, arrayB) => arrayA.filter((element) => !arrayB.includes(element));

    const includedTypes = getArrayDiff(allTypes, ["national", "regional"]);

    assert.deepStrictEqual(includedTypes, ["tram", "bus", "suburban", "subway"]);
  });
});
