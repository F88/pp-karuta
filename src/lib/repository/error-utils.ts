import {
  ConfigurationError,
  DataSizeExceededError,
  SizeEstimationError,
  StoreError,
} from '@f88/promidas/store';
import type { SnapshotOperationFailure } from '@f88/promidas/repository';

export type ErrorCategory =
  | 'configuration'
  | 'data-size'
  | 'size-estimation'
  | 'store'
  | 'api'
  | 'network'
  | 'authentication'
  | 'fetcher'
  | 'unknown';

export interface ParsedError {
  category: ErrorCategory;
  message: string;
  originalError: unknown;
}

export interface ParsedSnapshotError extends ParsedError {
  status?: number;
  code?: string;
  kind?: string;
}

/**
 * Parse setupSnapshot failure result
 * Analyzes SnapshotOperationFailure and returns detailed categorized information
 */
export function parseSnapshotFailure(
  failure: SnapshotOperationFailure,
): ParsedSnapshotError {
  switch (failure.origin) {
    case 'fetcher': {
      let category: ErrorCategory = 'fetcher';
      let message = `Fetch failed: ${failure.message}`;

      if (failure.status === 401 || failure.status === 403) {
        category = 'authentication';
        message = `Authentication failed: ${failure.message}`;
      } else if (failure.status && failure.status >= 500) {
        category = 'api';
        message = `API server error: ${failure.message}`;
      } else if (failure.kind === 'network') {
        category = 'network';
        message = `Network error: ${failure.message}`;
      }

      return {
        category,
        message,
        status: failure.status,
        code: failure.code,
        kind: failure.kind,
        originalError: failure,
      };
    }

    case 'store':
      return {
        category: 'store',
        message: `Store error: ${failure.message}`,
        code: failure.code,
        kind: failure.kind,
        originalError: failure,
      };

    case 'unknown':
    default:
      return {
        category: 'unknown',
        message: `Unknown error: ${failure.message}`,
        originalError: failure,
      };
  }
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
