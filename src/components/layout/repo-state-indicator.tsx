import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import { RepoStateIndicatorPresentation } from './repo-state-indicator-presentation';

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
