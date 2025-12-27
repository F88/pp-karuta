import { useEffect, useState } from 'react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { getPromidasRepository } from '@/lib/promidas';
import { AppPresentation } from './AppPresentation';

export function AppContainer() {
  const [stats, setStats] = useState<PrototypeInMemoryStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPromidas = async () => {
      try {
        const repo = await getPromidasRepository();
        const repoStats = repo.getStats();
        setStats(repoStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void initPromidas();
  }, []);

  return <AppPresentation loading={loading} error={error} stats={stats} />;
}
