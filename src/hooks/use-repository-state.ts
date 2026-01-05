/**
 * @fileoverview Hook for reactively monitoring PROMIDAS repository state changes.
 * Provides efficient polling-based state monitoring with smart equality checking
 * to minimize unnecessary re-renders.
 */

import { useState, useEffect } from 'react';
import { promidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';

/**
 * Compares two RepositoryState objects for deep equality.
 *
 * Performs type-specific comparison to determine if two repository states
 * are functionally equivalent. This prevents unnecessary re-renders when
 * polling detects no actual state change.
 *
 * @param a - First repository state to compare
 * @param b - Second repository state to compare
 * @returns true if the states are equal, false otherwise
 */
function isStateEqual(a: RepositoryState, b: RepositoryState): boolean {
  if (a.type !== b.type) return false;

  if (a.type === 'token-invalid' && b.type === 'token-invalid') {
    return a.error === b.error;
  }

  if (a.type === 'created-token-valid' && b.type === 'created-token-valid') {
    return a.repository === b.repository;
  }

  return true; // not-created or validating - type equality is sufficient
}

/**
 * Custom React hook for reactively monitoring PROMIDAS repository state.
 *
 * This hook continuously polls the repository manager to detect state changes,
 * such as transitions between 'not-created', 'validating', 'created-token-valid',
 * and 'token-invalid' states.
 *
 * Features:
 * - Configurable polling interval for performance tuning
 * - Smart equality checking to prevent unnecessary re-renders
 * - Automatic cleanup of polling interval on unmount
 * - Immediate state initialization with current repository state
 *
 * @param pollingInterval - Interval in milliseconds between state checks (default: 1000ms)
 * @returns The current repository state
 *
 * @example
 * ```tsx
 * function RepositoryStatusComponent() {
 *   const repoState = useRepositoryState(2000); // Poll every 2 seconds
 *
 *   switch (repoState.type) {
 *     case 'not-created':
 *       return <div>Repository not initialized</div>;
 *     case 'validating':
 *       return <div>Validating token...</div>;
 *     case 'created-token-valid':
 *       return <div>Repository ready</div>;
 *     case 'token-invalid':
 *       return <div>Error: {repoState.error}</div>;
 *   }
 * }
 * ```
 */
export function useRepositoryState(pollingInterval = 1000): RepositoryState {
  const [state, setState] = useState<RepositoryState>(
    promidasRepositoryManager.getState(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = promidasRepositoryManager.getState();
      setState((prevState) => {
        // Only update if state has actually changed
        if (isStateEqual(prevState, newState)) {
          return prevState;
        }
        return newState;
      });
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  return state;
}
