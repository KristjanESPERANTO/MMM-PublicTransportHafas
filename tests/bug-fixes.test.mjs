import {describe, it} from "node:test";
import assert from "node:assert";

/**
 * Tests for recent bug fixes (January 2026)
 * - HAFAS API compatibility (array vs object with .departures)
 * - Null handling for departure.when
 * - lastUpdate timestamp display
 */

const DepartureFetcher = (await import("../core/DepartureFetcher.mjs")).default;

// =============================================================================
// Helper functions
// =============================================================================

function createDeparture (overrides = {}) {
  const now = new Date();
  const when = new Date(now.getTime() + 15 * 60 * 1000);

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
      name: "Test Station"
    },
    ...overrides
  };
}

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
    includedTransportationTypes: ["tram", "bus", "suburban"],
    maxReachableDepartures: 7,
    maxUnreachableDepartures: 3
  };

  return new DepartureFetcher({...defaultConfig, ...configOverrides});
}

// =============================================================================
// Tests: processResults - HAFAS API compatibility
// =============================================================================

describe("DepartureFetcher.processResults - API compatibility", () => {
  it("should handle old API format (array response)", () => {
    const departures = [
      createDeparture({tripId: "1"}),
      createDeparture({tripId: "2"})
    ];

    const results = [{status: "fulfilled", value: departures}];

    const {departures: processed} = DepartureFetcher.processResults(results, [null]);

    assert.strictEqual(processed.length, 2);
    assert.strictEqual(processed[0].tripId, "1");
    assert.strictEqual(processed[1].tripId, "2");
  });

  it("should handle new API format (object with .departures property)", () => {
    const departures = [
      createDeparture({tripId: "1"}),
      createDeparture({tripId: "2"})
    ];

    const results = [{status: "fulfilled", value: {departures, realtimeDataUpdatedAt: 123456}}];

    const {departures: processed} = DepartureFetcher.processResults(results, [null]);

    assert.strictEqual(processed.length, 2);
    assert.strictEqual(processed[0].tripId, "1");
    assert.strictEqual(processed[1].tripId, "2");
  });

  it("should handle empty departures array gracefully", () => {
    const results = [{status: "fulfilled", value: {departures: []}}];

    const {departures: processed, failures} = DepartureFetcher.processResults(results, [null]);

    assert.strictEqual(processed.length, 0);
    assert.strictEqual(failures.length, 0);
  });

  it("should handle undefined .departures property", () => {
    const results = [{status: "fulfilled", value: {}}];

    const {departures: processed} = DepartureFetcher.processResults(results, [null]);

    assert.strictEqual(processed.length, 0);
  });

  it("should collect failures from rejected promises", () => {
    const error = new Error("Network error");
    const results = [
      {status: "fulfilled", value: {departures: [createDeparture()]}},
      {status: "rejected", reason: error}
    ];

    const {departures: processed, failures} = DepartureFetcher.processResults(results, [null, "123"]);

    assert.strictEqual(processed.length, 1);
    assert.strictEqual(failures.length, 1);
    assert.strictEqual(failures[0].direction, "123");
    assert.strictEqual(failures[0].error, error);
  });
});

// =============================================================================
// Tests: sortDepartures - Null handling
// =============================================================================

describe("DepartureFetcher.sortDepartures - Null handling", () => {
  it("should sort departures with valid when times", () => {
    const now = Date.now();
    const departures = [
      createDeparture({tripId: "2", when: new Date(now + 20 * 60000).toISOString()}),
      createDeparture({tripId: "1", when: new Date(now + 10 * 60000).toISOString()}),
      createDeparture({tripId: "3", when: new Date(now + 30 * 60000).toISOString()})
    ];

    const sorted = DepartureFetcher.sortDepartures(departures);

    assert.strictEqual(sorted[0].tripId, "1");
    assert.strictEqual(sorted[1].tripId, "2");
    assert.strictEqual(sorted[2].tripId, "3");
  });

  it("should fallback to plannedWhen when when is null", () => {
    const now = Date.now();
    const departures = [
      createDeparture({tripId: "2", when: null, plannedWhen: new Date(now + 20 * 60000).toISOString()}),
      createDeparture({tripId: "1", when: null, plannedWhen: new Date(now + 10 * 60000).toISOString()})
    ];

    const sorted = DepartureFetcher.sortDepartures(departures);

    assert.strictEqual(sorted[0].tripId, "1");
    assert.strictEqual(sorted[1].tripId, "2");
  });

  it("should handle mix of null and valid when times", () => {
    const now = Date.now();
    const departures = [
      createDeparture({tripId: "3", when: new Date(now + 30 * 60000).toISOString()}),
      createDeparture({tripId: "1", when: null, plannedWhen: new Date(now + 10 * 60000).toISOString()}),
      createDeparture({tripId: "2", when: new Date(now + 20 * 60000).toISOString()})
    ];

    const sorted = DepartureFetcher.sortDepartures(departures);

    assert.strictEqual(sorted[0].tripId, "1");
    assert.strictEqual(sorted[1].tripId, "2");
    assert.strictEqual(sorted[2].tripId, "3");
  });

  it("should not mutate the original array", () => {
    const departures = [
      createDeparture({tripId: "2"}),
      createDeparture({tripId: "1"})
    ];
    const original = [...departures];

    DepartureFetcher.sortDepartures(departures);

    assert.strictEqual(departures[0].tripId, original[0].tripId);
    assert.strictEqual(departures[1].tripId, original[1].tripId);
  });
});

// =============================================================================
// Tests: removeDuplicates - Deduplication with null times
// =============================================================================

describe("DepartureFetcher.removeDuplicates", () => {
  it("should remove exact duplicates based on tripId, time, and stop", () => {
    const departure = createDeparture({tripId: "123"});
    const departures = [
      departure,
      {...departure}
    ];

    const unique = DepartureFetcher.removeDuplicates(departures);

    assert.strictEqual(unique.length, 1);
  });

  it("should handle null when times in deduplication", () => {
    const plannedTime = new Date().toISOString();
    const departures = [
      createDeparture({tripId: "123", when: null, plannedWhen: plannedTime, stop: {id: "1"}}),
      createDeparture({tripId: "123", when: null, plannedWhen: plannedTime, stop: {id: "1"}})
    ];

    const unique = DepartureFetcher.removeDuplicates(departures);

    assert.strictEqual(unique.length, 1);
  });

  it("should keep departures with different times", () => {
    const now = Date.now();
    const departures = [
      createDeparture({tripId: "123", when: new Date(now + 10 * 60000).toISOString()}),
      createDeparture({tripId: "123", when: new Date(now + 20 * 60000).toISOString()})
    ];

    const unique = DepartureFetcher.removeDuplicates(departures);

    assert.strictEqual(unique.length, 2);
  });

  it("should use line.id fallback when tripId is missing", () => {
    const time = new Date().toISOString();
    const departures = [
      createDeparture({tripId: null, when: time, line: {id: "line-1", name: "Test"}, stop: {id: "1"}}),
      createDeparture({tripId: null, when: time, line: {id: "line-1", name: "Test"}, stop: {id: "1"}})
    ];

    const unique = DepartureFetcher.removeDuplicates(departures);

    assert.strictEqual(unique.length, 1);
  });
});

// =============================================================================
// Tests: isReachable - Null handling
// =============================================================================

describe("DepartureFetcher.isReachable - Null handling", () => {
  it("should use when if available", () => {
    const fetcher = createFetcher({timeToStation: 10});
    const futureTime = new Date(Date.now() + 20 * 60000).toISOString();

    const departure = createDeparture({
      when: futureTime,
      plannedWhen: new Date(Date.now() + 15 * 60000).toISOString()
    });

    const isReachable = fetcher.isReachable(departure);

    assert.strictEqual(isReachable, true);
  });

  it("should fallback to plannedWhen when when is null", () => {
    const fetcher = createFetcher({timeToStation: 10});
    const plannedTime = new Date(Date.now() + 20 * 60000).toISOString();

    const departure = createDeparture({
      when: null,
      plannedWhen: plannedTime
    });

    const isReachable = fetcher.isReachable(departure);

    assert.strictEqual(isReachable, true);
  });

  it("should return false when both when and plannedWhen are null", () => {
    const fetcher = createFetcher({timeToStation: 10});

    const departure = createDeparture({
      when: null,
      plannedWhen: null
    });

    const isReachable = fetcher.isReachable(departure);

    assert.strictEqual(isReachable, false);
  });

  it("should return false when departure is not reachable in time", () => {
    const fetcher = createFetcher({timeToStation: 10});
    const soonTime = new Date(Date.now() + 5 * 60000).toISOString();

    const departure = createDeparture({
      when: soonTime,
      plannedWhen: soonTime
    });

    const isReachable = fetcher.isReachable(departure);

    assert.strictEqual(isReachable, false);
  });
});

// =============================================================================
// Null direction handling tests
// =============================================================================

describe("PtTableBodyBuilder - Null direction handling", async () => {
  // Dynamically import to avoid top-level issues
  const PtTableBodyBuilder = (await import("../core/PtTableBodyBuilder.mjs")).default;

  it("should handle null direction gracefully", () => {
    const config = {
      replaceInDirections: {},
      marqueeLongDirections: false,
      showAbsoluteTime: true
    };

    const builder = new PtTableBodyBuilder(config);
    const processed = builder.getProcessedDirection(null);

    assert.strictEqual(processed, "");
  });

  it("should handle undefined direction gracefully", () => {
    const config = {
      replaceInDirections: {},
      marqueeLongDirections: false,
      showAbsoluteTime: true
    };

    const builder = new PtTableBodyBuilder(config);
    const processed = builder.getProcessedDirection();

    assert.strictEqual(processed, "");
  });

  it("should process valid direction normally", () => {
    const config = {
      replaceInDirections: {},
      marqueeLongDirections: false,
      showAbsoluteTime: true
    };

    const builder = new PtTableBodyBuilder(config);
    const processed = builder.getProcessedDirection("Hauptbahnhof");

    assert.strictEqual(processed, "Hauptbahnhof");
  });
});
