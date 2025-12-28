import { useState, useEffect } from 'react';
import { getRepositoryState } from '@/lib/repository/promidas-repo';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';

/**
 * Custom hook to reactively monitor repository state
 * Polls the repository state at regular intervals to detect changes
 */
export function useRepositoryState(pollingInterval = 1000): RepositoryState {
  const [state, setState] = useState<RepositoryState>(getRepositoryState());

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = getRepositoryState();
      setState(newState);
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  return state;
}
