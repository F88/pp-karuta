import { useState, useEffect } from 'react';
import { getRepositoryState } from '@/lib/repository/promidas-repository-manager';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';

/**
 * Compare two RepositoryState objects for equality
 * @param a - First state
 * @param b - Second state
 * @returns true if states are equal, false otherwise
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
 * Custom hook to reactively monitor repository state
 * Polls the repository state at regular intervals to detect changes
 * Only triggers re-renders when the state actually changes
 */
export function useRepositoryState(pollingInterval = 1000): RepositoryState {
  const [state, setState] = useState<RepositoryState>(getRepositoryState());

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = getRepositoryState();
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
