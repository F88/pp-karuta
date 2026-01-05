/**
 * @fileoverview Hook for managing PROMIDAS repository access and lifecycle.
 * Provides reactive access to the PROMIDAS repository with loading and error states.
 */

import { useState, useEffect } from 'react';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { promidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';

/**
 * Result object returned by the usePromidasRepository hook.
 */
export type UsePromidasRepositoryResult = {
  /** The initialized PROMIDAS repository instance, or null if not yet loaded or failed to load */
  repository: ProtopediaInMemoryRepository | null;
  /** Whether the repository is currently being initialized */
  loading: boolean;
  /** Error message if repository initialization failed, null otherwise */
  error: string | null;
};

/**
 * Custom React hook for accessing the PROMIDAS repository.
 *
 * This hook manages the lifecycle of the PROMIDAS repository, including:
 * - Asynchronous initialization via promidasRepositoryManager
 * - Loading state tracking during initialization
 * - Error handling and reporting
 *
 * The repository is initialized once when the hook is first mounted.
 *
 * @returns An object containing the repository instance, loading state, and any error that occurred
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { repository, loading, error } = usePromidasRepository();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!repository) return null;
 *
 *   // Use repository...
 * }
 * ```
 */
export function usePromidasRepository(): UsePromidasRepositoryResult {
  const [repository, setRepository] =
    useState<ProtopediaInMemoryRepository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initRepository = async () => {
      try {
        const repo = await promidasRepositoryManager.getRepository();
        setRepository(repo);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRepository(null);
      } finally {
        setLoading(false);
      }
    };

    void initRepository();
  }, []);

  return { repository, loading, error };
}
