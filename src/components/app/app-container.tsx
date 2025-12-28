import { usePromidasRepository } from '@/hooks/use-promidas-repository';
import { AppPresentation } from './app-presentation';

export function AppContainer() {
  const { repository, loading, error } = usePromidasRepository();

  const stats = repository ? repository.getStats() : null;

  return <AppPresentation loading={loading} error={error} stats={stats} />;
}
