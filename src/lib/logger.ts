/**
 * @fileoverview Simple logger utility
 *
 * Provides logging functions that respect VITE_DEBUG_MODE environment variable.
 * Debug logs are only output when VITE_DEBUG_MODE is set to 'true'.
 *
 * @module Logger
 */

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

/**
 * Logger utility for conditional debug output
 */
export const logger = {
  /**
   * Log general messages (always shown)
   * @param args - Arguments to pass to console.log
   */
  log: (...args: unknown[]) => {
    console.log('[LOG]', ...args);
  },

  /**
   * Log debug messages (only in debug mode)
   * @param args - Arguments to pass to console.debug
   */
  debug: (...args: unknown[]) => {
    if (DEBUG_MODE) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log informational messages (only in debug mode)
   * @param args - Arguments to pass to console.info
   */
  info: (...args: unknown[]) => {
    if (DEBUG_MODE) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages (always shown)
   * @param args - Arguments to pass to console.warn
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Log error messages (always shown)
   * @param args - Arguments to pass to console.error
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },
};
