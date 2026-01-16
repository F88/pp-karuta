import { RepoStateIndicatorPresentation } from './repo-state-indicator-presentation';

import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';

interface RepoStateIndicatorProps {
  state: RepositoryState;
  onClick?: () => void;
}

export function RepoStateIndicator({
  state,
  onClick,
}: RepoStateIndicatorProps) {
  return <RepoStateIndicatorPresentation state={state} onClick={onClick} />;
}
