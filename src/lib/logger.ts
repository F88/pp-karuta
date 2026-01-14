/**
 * @fileoverview Simple logger utility
 *
 * Provides logging functions that respect VITE_LOG_LEVEL environment variable.
 * Logs are output if their level is equal to or higher than the configured level.
 * Order: debug < info < warn < error
 *
 * Default level: 'info'
 *
 * @module Logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Parse log level from env, default to 'info'
const envLevel = (import.meta.env.VITE_LOG_LEVEL as string) || 'info';
const CURRENT_LEVEL =
  LOG_LEVELS[envLevel.toLowerCase() as LogLevel] ?? LOG_LEVELS.info;

/**
 * Logger utility for conditional debug output
 */
export const logger = {
  /**
   * Log debug messages (only in debug mode)
   * @param args - Arguments to pass to console.debug
   */
  debug: (...args: unknown[]) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.debug) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log informational messages
   * @param args - Arguments to pass to console.info
   */
  info: (...args: unknown[]) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.info) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages
   * @param args - Arguments to pass to console.warn
   */
  warn: (...args: unknown[]) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.warn) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages
   * @param args - Arguments to pass to console.error
   */
  error: (...args: unknown[]) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.error) {
      console.error('[ERROR]', ...args);
    }
  },
};
