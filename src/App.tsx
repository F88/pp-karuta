import { useEffect, useState } from 'react';
import { getPromidasRepository } from './lib/promidas';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import './App.css';

function App() {
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

    initPromidas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">HELLO WORLD</h1>

        {loading && <div className="text-gray-600">Loading PROMIDAS...</div>}

        {error && (
          <div
            className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {stats && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              PROMIDAS Stats
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Loaded prototypes:
                </dt>
                <dd className="text-lg text-gray-900">{stats.size}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Cached at:
                </dt>
                <dd className="text-lg text-gray-900">
                  {stats.cachedAt
                    ? new Date(stats.cachedAt).toLocaleString('ja-JP')
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Is expired:
                </dt>
                <dd className="text-lg text-gray-900">
                  {stats.isExpired ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
