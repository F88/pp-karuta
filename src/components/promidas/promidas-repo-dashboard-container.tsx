import { useEffect, useState } from 'react';
import {
  promidasRepositoryManager,
  type RepositoryState,
} from '@/lib/repository/promidas-repository-manager';
import { usePromidasStoreState } from '@/hooks/use-promidas-store-state';
import type { ScreenSize } from '@/types/screen-size';
import { PromidasRepoDashboardPresentation } from './promidas-repo-dashboard-presentation';

interface PromidasRepoDashboardProps {
  screenSize: ScreenSize;
}

export function PromidasRepoDashboard({
  screenSize,
}: PromidasRepoDashboardProps) {
  const [repoState, setRepoState] = useState<RepositoryState>({
    type: 'not-created',
  });
  const [repoError, setRepoError] = useState<string | null>(null);
  const { storeState, stats } = usePromidasStoreState();

  const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

  useEffect(() => {
    const updateRepoState = () => {
      const status = promidasRepositoryManager.getState();
      setRepoState(status);
      setRepoError(status.type === 'token-invalid' ? status.error : null);
    };

    updateRepoState();

    // Poll every 5 seconds to sync with repo state changes
    const interval = setInterval(updateRepoState, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PromidasRepoDashboardPresentation
      repoState={repoState}
      repoError={repoError}
      storeState={storeState}
      storeStats={stats}
      useDummyData={useDummyData}
      screenSize={screenSize}
    />
  );
}
