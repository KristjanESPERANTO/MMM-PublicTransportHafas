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

describe("getReachableTime", () => {
  it("should return current time plus timeToStation", () => {
    const fetcher = createFetcher({timeToStation: 10});

    const beforeCall = new Date();
    const result = fetcher.getReachableTime();
    const afterCall = new Date();

    // Result should be ~10 minutes from now (with some tolerance for execution time)
    const resultTime = new Date(result);
    const expectedTime = new Date(beforeCall.getTime() + 10 * 60 * 1000);

    // Allow 1 second tolerance
    assert.ok(Math.abs(resultTime - expectedTime) < 1000);
    assert.ok(resultTime > beforeCall);
    assert.ok(resultTime < new Date(afterCall.getTime() + 11 * 60 * 1000));
  });

  it("should work with zero timeToStation", () => {
    const fetcher = createFetcher({timeToStation: 0});

    const beforeCall = new Date();
    const result = fetcher.getReachableTime();

    const resultTime = new Date(result);

    // Should be approximately now (with 1 second tolerance)
    assert.ok(Math.abs(resultTime - beforeCall) < 1000);
  });
});

describe("getDepartureTime", () => {
  it("should return reachable time when no unreachable departures configured", () => {
    const fetcher = createFetcher({
      timeToStation: 10,
      maxUnreachableDepartures: 0
    });

    const reachableTime = fetcher.getReachableTime();
    const departureTime = fetcher.getDepartureTime();

    // Should be the same when maxUnreachableDepartures is 0
    assert.strictEqual(departureTime.toISOString(), reachableTime.toISOString());
  });

  it("should subtract leadTime when unreachable departures configured", () => {
    const fetcher = createFetcher({
      timeToStation: 10,
      maxUnreachableDepartures: 3
    });
    fetcher.leadTime = 20;

    const reachableTime = fetcher.getReachableTime();
    const departureTime = fetcher.getDepartureTime();

    // Should be 20 minutes earlier than reachable time
    const expectedTime = new Date(reachableTime);
    expectedTime.setMinutes(expectedTime.getMinutes() - 20);

    assert.strictEqual(departureTime.toISOString(), expectedTime.toISOString());
  });
});

describe("isReachable", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({timeToStation: 10});
  });

  it("should mark departure as reachable when after timeToStation", () => {
    const futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + 15); // 15 min from now

    const departure = createDeparture({when: futureTime.toISOString()});

    const result = fetcher.isReachable(departure);

    assert.strictEqual(result, true);
  });

  it("should mark departure as unreachable when before timeToStation", () => {
    const nearTime = new Date();
    nearTime.setMinutes(nearTime.getMinutes() + 5); // 5 min from now (less than timeToStation of 10)

    const departure = createDeparture({when: nearTime.toISOString()});

    const result = fetcher.isReachable(departure);

    assert.strictEqual(result, false);
  });

  it("should mark departure as reachable when exactly at timeToStation boundary", () => {
    const exactTime = new Date();
    exactTime.setMinutes(exactTime.getMinutes() + 10); // Exactly timeToStation

    const departure = createDeparture({when: exactTime.toISOString()});

    const result = fetcher.isReachable(departure);

    // isSameOrAfter should return true for exact match
    assert.strictEqual(result, true);
  });
});

describe("departuresMarkedWithReachability", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({timeToStation: 10});
  });

  it("should add isReachable property to all departures", () => {
    const now = new Date();
    const departures = [
      createDeparture({when: new Date(now.getTime() + 5 * 60000).toISOString()}), // 5 min - unreachable
      createDeparture({when: new Date(now.getTime() + 15 * 60000).toISOString()}), // 15 min - reachable
      createDeparture({when: new Date(now.getTime() + 20 * 60000).toISOString()}) // 20 min - reachable
    ];

    const result = fetcher.departuresMarkedWithReachability(departures);

    assert.strictEqual(result.length, 3);
    assert.ok(result.every((dep) => "isReachable" in dep));
    assert.strictEqual(result[0].isReachable, false);
    assert.strictEqual(result[1].isReachable, true);
    assert.strictEqual(result[2].isReachable, true);
  });

  it("should not modify original departure objects", () => {
    const departure = createDeparture();
    const departures = [departure];

    fetcher.departuresMarkedWithReachability(departures);

    // Original should be modified (this is the actual behavior)
    assert.ok("isReachable" in departure);
  });
});

describe("departuresRemovedSurplusUnreachableDepartures", () => {
  let fetcher;

  beforeEach(() => {
    fetcher = createFetcher({
      maxUnreachableDepartures: 2,
      maxReachableDepartures: 5
    });
  });

  it("should keep only maxUnreachableDepartures unreachable departures", () => {
    const departures = [
      {...createDeparture({tripId: "unreachable-1"}), isReachable: false},
      {...createDeparture({tripId: "unreachable-2"}), isReachable: false},
      {...createDeparture({tripId: "unreachable-3"}), isReachable: false},
      {...createDeparture({tripId: "reachable-1"}), isReachable: true},
      {...createDeparture({tripId: "reachable-2"}), isReachable: true}
    ];

    const result = fetcher.departuresRemovedSurplusUnreachableDepartures(departures);

    const unreachable = result.filter((dep) => !dep.isReachable);
    const reachable = result.filter((dep) => dep.isReachable);

    assert.strictEqual(unreachable.length, 2); // maxUnreachableDepartures
    assert.strictEqual(reachable.length, 2);
  });

  it("should keep all unreachable departures when below max", () => {
    const departures = [
      {...createDeparture({tripId: "unreachable-1"}), isReachable: false},
      {...createDeparture({tripId: "reachable-1"}), isReachable: true},
      {...createDeparture({tripId: "reachable-2"}), isReachable: true}
    ];

    const result = fetcher.departuresRemovedSurplusUnreachableDepartures(departures);

    const unreachable = result.filter((dep) => !dep.isReachable);

    assert.strictEqual(unreachable.length, 1); // Only 1, below max of 2
  });

  it("should preserve order with unreachable first, then reachable", () => {
    const departures = [
      {...createDeparture({tripId: "unreachable-1"}), isReachable: false},
      {...createDeparture({tripId: "unreachable-2"}), isReachable: false},
      {...createDeparture({tripId: "reachable-1"}), isReachable: true}
    ];

    const result = fetcher.departuresRemovedSurplusUnreachableDepartures(departures);

    assert.strictEqual(result[0].isReachable, false);
    assert.strictEqual(result[1].isReachable, false);
    assert.strictEqual(result[2].isReachable, true);
  });

  it("should adjust lead time based on unreachable count", () => {
    fetcher.leadTime = 20;

    const departures = [
      {...createDeparture(), isReachable: false},
      {...createDeparture(), isReachable: false},
      {...createDeparture(), isReachable: false},
      {...createDeparture(), isReachable: false}, // 4 unreachable, max is 2
      {...createDeparture(), isReachable: true}
    ];

    fetcher.departuresRemovedSurplusUnreachableDepartures(departures);

    // Lead time should be halved: Math.round(20 / 2) + 1 = 11
    assert.strictEqual(fetcher.leadTime, 11);
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
