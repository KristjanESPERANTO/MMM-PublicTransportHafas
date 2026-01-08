/**
 * Validates and sanitizes the module configuration.
 * Ensures all values are within acceptable ranges and internally consistent.
 *
 * @param {object} config - The configuration object to validate
 * @param {object} defaults - Default values to use for bounds checking
 * @returns {object} The sanitized configuration object
 */
export function sanitizeConfig (config, defaults) {
  const sanitized = {...config};

  // Minimum update interval is 30 seconds to avoid API rate limiting
  if (sanitized.updatesEvery < 30) {
    sanitized.updatesEvery = 30;
  }

  // Time to station cannot be negative
  if (sanitized.timeToStation < 0) {
    sanitized.timeToStation = 0;
  }

  // Time in future must be at least timeToStation + 30 minutes
  // to ensure we see departures after walking to the station
  if (sanitized.timeInFuture < sanitized.timeToStation + 30) {
    sanitized.timeInFuture = sanitized.timeToStation + 30;
  }

  // Cannot show negative unreachable departures
  if (sanitized.maxUnreachableDepartures < 0) {
    sanitized.maxUnreachableDepartures = 0;
  }

  // Cannot show negative reachable departures - reset to default
  if (sanitized.maxReachableDepartures < 0) {
    sanitized.maxReachableDepartures = defaults.maxReachableDepartures;
  }

  return sanitized;
}
