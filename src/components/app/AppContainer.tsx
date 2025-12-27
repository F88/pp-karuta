import { usePromidasRepository } from '@/hooks/usePromidasRepository';
import { AppPresentation } from './AppPresentation';

export function AppContainer() {
  const { repository, loading, error } = usePromidasRepository();

  const stats = repository ? repository.getStats() : null;

  return <AppPresentation loading={loading} error={error} stats={stats} />;
}
