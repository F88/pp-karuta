/**
 * Custom hook for managing PROMIDAS store state
 *
 * Provides real-time store state based on repository stats.
 * Uses promidas-utils to categorize state as 'not-stored', 'stored', or 'expired'.
 */
import { useState, useEffect } from 'react';
import { getStoreState } from '@f88/promidas-utils/store';
import type { StoreState } from '@f88/promidas-utils/store';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  getRepositoryState,
  getPromidasRepository,
} from '@/lib/repository/promidas-repository-manager';

export interface UsePromidasStoreStateResult {
  storeState: StoreState;
  stats: PrototypeInMemoryStats | null;
  isReady: boolean;
}

/**
 * Hook to monitor PROMIDAS store state
 *
 * @returns Store state, stats, and readiness flag
 *
 * @example
 * ```tsx
 * const { storeState, stats, isReady } = usePromidasStoreState();
 *
 * if (storeState === 'expired') {
 *   // Prompt user to refresh
 * }
 * ```
 */
export function usePromidasStoreState(): UsePromidasStoreStateResult {
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);
  const [storeState, setStoreState] = useState<StoreState>('not-stored');

  useEffect(() => {
    const updateStats = async () => {
      const repoStatus = getRepositoryState();

      // Only fetch stats if repository is valid
      if (repoStatus.type !== 'created-token-valid') {
        setStats(null);
        setStoreState('not-stored');
        return;
      }

      try {
        const repo = await getPromidasRepository();
        const currentStats = repo.getStats();
        setStats(currentStats);
        setStoreState(getStoreState(currentStats));
      } catch {
        setStats(null);
        setStoreState('not-stored');
      }
    };

    void updateStats();

    // Poll every 10 seconds to detect expiration
    const interval = setInterval(() => {
      void updateStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const isReady = storeState === 'stored';

  return {
    storeState,
    stats,
    isReady,
  };
}
