import type { RepositoryState } from '@/lib/repository/promidas-repo';
import { Button } from '@/components/ui/button';
import { CloudCog, CloudSync, CloudCheck, CloudAlert } from 'lucide-react';

interface RepoStateIndicatorPresentationProps {
  state: RepositoryState;
  onClick?: () => void;
}

export function RepoStateIndicatorPresentation({
  state,
  onClick,
}: RepoStateIndicatorPresentationProps) {
  const getStateDisplay = () => {
    switch (state.type) {
      case 'not-created':
        return {
          icon: CloudCog,
          color: 'text-gray-400',
        };
      case 'validating':
        return {
          icon: CloudSync,
          color: 'text-blue-500',
        };
      case 'created-token-valid':
        return {
          icon: CloudCheck,
          color: 'text-green-500',
        };
      case 'token-invalid':
        return {
          icon: CloudAlert,
          color: 'text-red-500',
        };
    }
  };

  const { icon: Icon, color } = getStateDisplay();

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      size="icon"
      aria-label="Repository status"
    >
      <Icon className={`h-5 w-5 ${color}`} />
    </Button>
  );
}
