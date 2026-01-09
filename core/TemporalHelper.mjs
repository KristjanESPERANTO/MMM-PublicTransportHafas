/**
 * Helper utilities for working with Temporal API.
 * Provides convenience methods for common date/time operations.
 */

/**
 * Get current time as Temporal.Instant.
 *
 * @returns {Temporal.Instant} Current instant
 */
export function getNow () {
  return Temporal.Now.instant();
}

/**
 * Format a Temporal Instant or ZonedDateTime to a localized time string.
 *
 * @param {Temporal.Instant|Temporal.ZonedDateTime} temporal - The temporal object to format
 * @param {string} locale - The locale for formatting (e.g., 'en', 'de')
 * @param {number} timeFormat - 12 or 24 hour format
 * @returns {string} Formatted time string
 */
export function formatTime (temporal, locale, timeFormat) {
  const options = {
    hour: "2-digit",
    minute: "2-digit"
  };

  if (timeFormat === 12) {
    options.hour12 = true;
  }

  return temporal.toLocaleString(locale, options);
}

/**
 * Format a Temporal Instant or ZonedDateTime with custom Intl.DateTimeFormat options.
 *
 * @param {Temporal.Instant|Temporal.ZonedDateTime} temporal - The temporal object to format
 * @param {string} locale - The locale for formatting (e.g., 'en', 'de')
 * @param {object} options - Intl.DateTimeFormat options (e.g., {weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'})
 * @returns {string} Formatted date/time string
 */
export function formatDateTime (temporal, locale, options = {}) {
  return temporal.toLocaleString(locale, options);
}

/**
 * Format a relative time string (e.g., "in 5 minutes").
 *
 * @param {Temporal.Instant} when - The target time
 * @param {string} locale - The locale for formatting
 * @returns {string} Relative time string
 */
export function formatRelativeTime (when, locale) {
  const now = getNow();
  const duration = now.until(when);
  const minutes = Math.round(duration.total("minutes"));

  const rtf = new Intl.RelativeTimeFormat(locale, {numeric: "auto"});

  // Choose appropriate unit based on duration
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }

  const hours = Math.round(duration.total("hours"));
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }

  const days = Math.round(duration.total("days"));
  return rtf.format(days, "day");
}

/**
 * Parse an ISO 8601 string to Temporal.Instant.
 *
 * @param {string} isoString - ISO 8601 datetime string
 * @returns {Temporal.Instant} Temporal instant
 */
export function parseInstant (isoString) {
  return Temporal.Instant.from(isoString);
}

/**
 * Check if a value is a valid Temporal object or can be parsed as one.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if valid temporal or parseable
 */
export function isValidTemporal (value) {
  try {
    if (value instanceof Temporal.Instant || value instanceof Temporal.ZonedDateTime) {
      return true;
    }

    if (typeof value === "string") {
      Temporal.Instant.from(value);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Convert Unix timestamp (seconds) to Temporal.Instant.
 *
 * @param {number} unixSeconds - Unix timestamp in seconds
 * @returns {Temporal.Instant} Temporal instant
 */
export function fromUnixSeconds (unixSeconds) {
  // Convert seconds to nanoseconds (BigInt required)
  const nanoseconds = BigInt(Math.floor(unixSeconds)) * 1_000_000_000n;
  return Temporal.Instant.fromEpochNanoseconds(nanoseconds);
}
