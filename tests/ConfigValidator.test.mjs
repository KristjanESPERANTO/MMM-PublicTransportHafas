import {describe, it} from "node:test";
import assert from "node:assert";
import {sanitizeConfig} from "../core/ConfigValidator.mjs";

const defaultConfig = {
  updatesEvery: 120,
  timeToStation: 10,
  timeInFuture: 40,
  maxUnreachableDepartures: 0,
  maxReachableDepartures: 7
};

describe("ConfigValidator", () => {
  describe("sanitizeConfig", () => {
    describe("updatesEvery", () => {
      it("should enforce minimum of 30 seconds", () => {
        const config = {updatesEvery: 15};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.updatesEvery, 30);
      });

      it("should allow values >= 30", () => {
        const config = {updatesEvery: 120};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.updatesEvery, 120);
      });

      it("should handle boundary value of 30", () => {
        const config = {updatesEvery: 30};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.updatesEvery, 30);
      });

      it("should handle zero", () => {
        const config = {updatesEvery: 0};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.updatesEvery, 30);
      });

      it("should handle negative values", () => {
        const config = {updatesEvery: -10};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.updatesEvery, 30);
      });
    });

    describe("timeToStation", () => {
      it("should enforce minimum of 0", () => {
        const config = {timeToStation: -5};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeToStation, 0);
      });

      it("should allow zero", () => {
        const config = {timeToStation: 0};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeToStation, 0);
      });

      it("should allow positive values", () => {
        const config = {timeToStation: 15};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeToStation, 15);
      });
    });

    describe("timeInFuture", () => {
      it("should enforce minimum of timeToStation + 30", () => {
        const config = {timeToStation: 10, timeInFuture: 20};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeInFuture, 40); // 10 + 30
      });

      it("should allow values >= timeToStation + 30", () => {
        const config = {timeToStation: 10, timeInFuture: 60};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeInFuture, 60);
      });

      it("should handle boundary value", () => {
        const config = {timeToStation: 10, timeInFuture: 40};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeInFuture, 40);
      });

      it("should adjust for zero timeToStation", () => {
        const config = {timeToStation: 0, timeInFuture: 10};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeInFuture, 30); // 0 + 30
      });

      it("should handle large timeToStation values", () => {
        const config = {timeToStation: 100, timeInFuture: 50};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.timeInFuture, 130); // 100 + 30
      });
    });

    describe("maxUnreachableDepartures", () => {
      it("should enforce minimum of 0", () => {
        const config = {maxUnreachableDepartures: -3};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxUnreachableDepartures, 0);
      });

      it("should allow zero", () => {
        const config = {maxUnreachableDepartures: 0};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxUnreachableDepartures, 0);
      });

      it("should allow positive values", () => {
        const config = {maxUnreachableDepartures: 5};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxUnreachableDepartures, 5);
      });
    });

    describe("maxReachableDepartures", () => {
      it("should reset to default when negative", () => {
        const config = {maxReachableDepartures: -2};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxReachableDepartures, 7);
      });

      it("should allow zero", () => {
        const config = {maxReachableDepartures: 0};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxReachableDepartures, 0);
      });

      it("should allow positive values", () => {
        const config = {maxReachableDepartures: 10};
        const result = sanitizeConfig(config, defaultConfig);
        assert.strictEqual(result.maxReachableDepartures, 10);
      });
    });

    describe("full config validation", () => {
      it("should handle multiple invalid values", () => {
        const config = {
          updatesEvery: -5,
          timeToStation: -10,
          timeInFuture: 5,
          maxUnreachableDepartures: -3,
          maxReachableDepartures: -1
        };
        const result = sanitizeConfig(config, defaultConfig);

        assert.strictEqual(result.updatesEvery, 30);
        assert.strictEqual(result.timeToStation, 0);
        assert.strictEqual(result.timeInFuture, 30);
        assert.strictEqual(result.maxUnreachableDepartures, 0);
        assert.strictEqual(result.maxReachableDepartures, 7);
      });

      it("should preserve valid values", () => {
        const config = {
          updatesEvery: 120,
          timeToStation: 10,
          timeInFuture: 60,
          maxUnreachableDepartures: 3,
          maxReachableDepartures: 10,
          customField: "preserved"
        };
        const result = sanitizeConfig(config, defaultConfig);

        assert.strictEqual(result.updatesEvery, 120);
        assert.strictEqual(result.timeToStation, 10);
        assert.strictEqual(result.timeInFuture, 60);
        assert.strictEqual(result.maxUnreachableDepartures, 3);
        assert.strictEqual(result.maxReachableDepartures, 10);
        assert.strictEqual(result.customField, "preserved");
      });

      it("should not mutate original config", () => {
        const config = {updatesEvery: 15};
        const original = {...config};
        sanitizeConfig(config, defaultConfig);

        assert.deepStrictEqual(config, original);
      });
    });
  });
});
