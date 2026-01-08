/* eslint-disable no-console */
/**
 * Mock for MagicMirror logger
 * Simply redirects all logging to console
 */
export default {
  info: console.info,
  log: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug
};
