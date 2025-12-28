import type { RepositoryState } from '@/lib/repository/promidas-repo';

interface RepoStateIndicatorPresentationProps {
  state: RepositoryState;
}

export function RepoStateIndicatorPresentation({
  state,
}: RepoStateIndicatorPresentationProps) {
  const getStateDisplay = () => {
    switch (state.type) {
      case 'not-created':
        return {
          // label: 'No Token',
          label: '',
          color: 'bg-gray-400',
          textColor: 'text-gray-700 dark:text-gray-300',
        };
      case 'created-token-valid':
        return {
          // label: 'Ready',
          label: '',
          color: 'bg-green-500',
          textColor: 'text-green-700 dark:text-green-300',
        };
      case 'token-invalid':
        return {
          // label: 'Invalid',
          label: '',
          color: 'bg-red-500',
          textColor: 'text-red-700 dark:text-red-300',
        };
    }
  };

  const { label, color, textColor } = getStateDisplay();

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  );
}
