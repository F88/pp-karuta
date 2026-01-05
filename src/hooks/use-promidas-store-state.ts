/**
 * @fileoverview Hook for monitoring PROMIDAS store state and lifecycle.
 * Provides real-time store state monitoring based on repository statistics,
 * using promidas-utils to categorize state as 'not-stored', 'stored', or 'expired'.
 * Automatically polls for state changes to detect expiration.
 */

import { useState, useEffect } from 'react';
import { getStoreState } from '@f88/promidas-utils/store';
import type { StoreState } from '@f88/promidas-utils/store';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { promidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';

/**
 * Result object returned by the usePromidasStoreState hook.
 */
export interface UsePromidasStoreStateResult {
  /** Current state of the PROMIDAS store ('not-stored', 'stored', or 'expired') */
  storeState: StoreState;
  /** Repository statistics from PROMIDAS, or null if repository is not available */
  stats: PrototypeInMemoryStats | null;
  /** Flag indicating whether the store is ready for use (true when storeState is 'stored') */
  isReady: boolean;
}

/**
 * Custom React hook for monitoring the PROMIDAS store state.
 *
 * This hook continuously monitors the PROMIDAS repository store state and provides:
 * - Current store state classification (not-stored, stored, or expired)
 * - Repository statistics
 * - A ready flag for conditional rendering
 *
 * The hook automatically polls the repository every 10 seconds to detect state changes
 * and expiration. It only fetches stats when the repository is in a valid state.
 *
 * @returns An object containing the current store state, repository stats, and readiness flag
 *
 * @example
 * ```tsx
 * function StoreStatusComponent() {
 *   const { storeState, stats, isReady } = usePromidasStoreState();
 *
 *   if (!isReady) {
 *     return <div>Store not ready</div>;
 *   }
 *
 *   if (storeState === 'expired') {
 *     return <div>Store expired. Please refresh.</div>;
 *   }
 *
 *   return <div>Prototypes: {stats?.prototypeCount ?? 0}</div>;
 * }
 * ```
 */
export function usePromidasStoreState(): UsePromidasStoreStateResult {
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);
  const [storeState, setStoreState] = useState<StoreState>('not-stored');

  useEffect(() => {
    const updateStats = async () => {
      const repoStatus = promidasRepositoryManager.getState();

      // Only fetch stats if repository is valid
      if (repoStatus.type !== 'created-token-valid') {
        setStats(null);
        setStoreState('not-stored');
        return;
      }

      try {
        const repo = await promidasRepositoryManager.getRepository();
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
