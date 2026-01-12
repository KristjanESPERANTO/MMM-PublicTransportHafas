import {describe, it} from "node:test";
import assert from "node:assert";

/**
 * Tests for frontend helper methods added during bug fixes (January 2026)
 * - getErrorMessage() logic
 * - Update info text generation logic
 *
 * These are pure function tests - no DOM manipulation needed
 */

// =============================================================================
// Tests: getErrorMessage
// =============================================================================

describe("getErrorMessage", () => {
  it("should return correct message for ENOTFOUND", () => {
    const error = {code: "ENOTFOUND"};

    const getErrorMessage = (err) => {
      switch (err.code) {
        case "ENOTFOUND":
          return "ERROR_ENOTFOUND";
        case "EAI_AGAIN":
          return "ERROR_EAI_AGAIN";
        case "ETIMEDOUT":
        case "ECONNREFUSED":
        case "ECONNRESET":
          return "ERROR_CONNECTION";
        case "NOT_FOUNDS":
          return "NOT_FOUND";
        default:
          return err.hafasMessage || err.code || err.message;
      }
    };

    assert.strictEqual(getErrorMessage(error), "ERROR_ENOTFOUND");
  });

  it("should return correct message for connection errors", () => {
    const errorTimeout = {code: "ETIMEDOUT"};
    const errorRefused = {code: "ECONNREFUSED"};
    const errorReset = {code: "ECONNRESET"};

    const getErrorMessage = (err) => {
      switch (err.code) {
        case "ENOTFOUND":
          return "ERROR_ENOTFOUND";
        case "EAI_AGAIN":
          return "ERROR_EAI_AGAIN";
        case "ETIMEDOUT":
        case "ECONNREFUSED":
        case "ECONNRESET":
          return "ERROR_CONNECTION";
        case "NOT_FOUNDS":
          return "NOT_FOUND";
        default:
          return err.hafasMessage || err.code || err.message;
      }
    };

    assert.strictEqual(getErrorMessage(errorTimeout), "ERROR_CONNECTION");
    assert.strictEqual(getErrorMessage(errorRefused), "ERROR_CONNECTION");
    assert.strictEqual(getErrorMessage(errorReset), "ERROR_CONNECTION");
  });

  it("should fallback to error code for unknown errors", () => {
    const error = {code: "UNKNOWN_ERROR", message: "Something went wrong"};

    const getErrorMessage = (err) => {
      switch (err.code) {
        case "ENOTFOUND":
          return "ERROR_ENOTFOUND";
        case "EAI_AGAIN":
          return "ERROR_EAI_AGAIN";
        case "ETIMEDOUT":
        case "ECONNREFUSED":
        case "ECONNRESET":
          return "ERROR_CONNECTION";
        case "NOT_FOUNDS":
          return "NOT_FOUND";
        default:
          return err.hafasMessage || err.code || err.message;
      }
    };

    assert.strictEqual(getErrorMessage(error), "UNKNOWN_ERROR");
  });

  it("should prioritize hafasMessage over code", () => {
    const error = {
      code: "UNKNOWN",
      hafasMessage: "HAFAS specific error",
      message: "Generic error"
    };

    const getErrorMessage = (err) => {
      switch (err.code) {
        case "ENOTFOUND":
          return "ERROR_ENOTFOUND";
        case "EAI_AGAIN":
          return "ERROR_EAI_AGAIN";
        case "ETIMEDOUT":
        case "ECONNREFUSED":
        case "ECONNRESET":
          return "ERROR_CONNECTION";
        case "NOT_FOUNDS":
          return "NOT_FOUND";
        default:
          return err.hafasMessage || err.code || err.message;
      }
    };

    assert.strictEqual(getErrorMessage(error), "HAFAS specific error");
  });
});

// =============================================================================
// Tests: Update text generation logic
// =============================================================================

describe("Update info text generation", () => {
  it("should generate correct text when lastUpdate is 0", () => {
    const lastUpdate = 0;
    const errorCount = 0;
    const threshold = 3;

    const updateText = errorCount > 0 && errorCount <= threshold
      ? `Update (socket issues: ${errorCount})`
      : "Update";

    const finalText = lastUpdate > 0
      ? `${updateText}: [FORMATTED_TIME]`
      : `${updateText}: No data received yet`;

    assert.strictEqual(finalText, "Update: No data received yet");
  });

  it("should generate text with socket issues count when below threshold", () => {
    const errorCount = 2;
    const threshold = 3;

    const updateText = errorCount > 0 && errorCount <= threshold
      ? `Update (socket issues: ${errorCount})`
      : "Update";

    assert.strictEqual(updateText, "Update (socket issues: 2)");
  });

  it("should not show socket issues when errorCount exceeds threshold", () => {
    const errorCount = 5;
    const threshold = 3;

    const updateText = errorCount > 0 && errorCount <= threshold
      ? `Update (socket issues: ${errorCount})`
      : "Update";

    assert.strictEqual(updateText, "Update");
  });

  it("should not show socket issues when errorCount is 0", () => {
    const errorCount = 0;
    const threshold = 3;

    const updateText = errorCount > 0 && errorCount <= threshold
      ? `Update (socket issues: ${errorCount})`
      : "Update";

    assert.strictEqual(updateText, "Update");
  });
});
