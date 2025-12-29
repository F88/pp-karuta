import { useState, useEffect } from 'react';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { getPromidasRepository } from '@/lib/repository/promidas-repo';

export type UsePromidasRepositoryResult = {
  repository: ProtopediaInMemoryRepository | null;
  loading: boolean;
  error: string | null;
};

/**
 * Custom hook for accessing PROMIDAS repository
 * Handles initialization, loading state, and error handling
 */
export function usePromidasRepository(): UsePromidasRepositoryResult {
  const [repository, setRepository] =
    useState<ProtopediaInMemoryRepository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initRepository = async () => {
      try {
        const repo = await getPromidasRepository();
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
