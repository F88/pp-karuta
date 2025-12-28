import { useEffect, useState } from 'react';
import type { RepositoryState } from '@/lib/repository/promidas-repo';
import { getRepositoryState } from '@/lib/repository/promidas-repo';
import { RepoStateIndicatorPresentation } from './repo-state-indicator-presentation';

export function RepoStateIndicator() {
  const [state, setState] = useState<RepositoryState>(getRepositoryState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getRepositoryState());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <RepoStateIndicatorPresentation state={state} />;
}
