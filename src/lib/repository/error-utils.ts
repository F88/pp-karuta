import {
  ConfigurationError,
  DataSizeExceededError,
  SizeEstimationError,
  StoreError,
} from '@f88/promidas/store';

export type ErrorCategory =
  | 'configuration'
  | 'data-size'
  | 'size-estimation'
  | 'store'
  | 'api'
  | 'unknown';

export interface ParsedError {
  category: ErrorCategory;
  message: string;
  originalError: unknown;
}

/**
 * Parse PromidasRepository initialization error
 * Analyzes error and returns categorized information
 */
export function parsePromidasRepositoryInitError(err: unknown): ParsedError {
  if (err instanceof ConfigurationError) {
    return {
      category: 'configuration',
      message: `Configuration error: ${err.message}`,
      originalError: err,
    };
  }

  if (err instanceof DataSizeExceededError) {
    return {
      category: 'data-size',
      message: `Data size exceeded: ${err.message}`,
      originalError: err,
    };
  }

  if (err instanceof SizeEstimationError) {
    return {
      category: 'size-estimation',
      message: `Size estimation failed: ${err.message}`,
      originalError: err,
    };
  }

  if (err instanceof StoreError) {
    return {
      category: 'store',
      message: `Store error: ${err.message}`,
      originalError: err,
    };
  }

  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    if (
      message.includes('fetch') ||
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('api')
    ) {
      return {
        category: 'api',
        message: `API error: ${err.message}`,
        originalError: err,
      };
    }

    return {
      category: 'unknown',
      message: `Repository creation failed: ${err.message}`,
      originalError: err,
    };
  }

  return {
    category: 'unknown',
    message: `Unknown error: ${String(err)}`,
    originalError: err,
  };
}
