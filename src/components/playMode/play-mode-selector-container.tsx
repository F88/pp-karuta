import { getRepositoryState } from '@/lib/repository/promidas-repo';
import {
  PlayModeSelectorPresentation,
  type PlayMode,
} from './play-mode-selector-presentation';

interface PlayModeSelectorContainerProps {
  onModeSelected: (mode: PlayMode) => void;
  requireRepository?: boolean;
}

export function PlayModeSelectorContainer({
  onModeSelected,
  requireRepository = true,
}: PlayModeSelectorContainerProps) {
  const handleSelectMode = (mode: PlayMode) => {
    console.log('[PlayModeSelectorContainer] Mode selected:', mode);

    if (requireRepository) {
      const repoState = getRepositoryState();
      const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

      console.log('[PlayModeSelectorContainer] Repository state:', repoState);
      console.log('[PlayModeSelectorContainer] Use dummy data:', useDummyData);

      if (!useDummyData && repoState.type !== 'created-token-valid') {
        // Repository not ready, do not proceed
        console.warn('Repository is not ready. Cannot start game.');
        alert(
          'リポジトリが準備できていません。画面右上のアイコンからトークンを設定してください。',
        );
        return;
      }
    }

    console.log(
      '[PlayModeSelectorContainer] Calling onModeSelected with mode:',
      mode,
    );
    onModeSelected(mode);
  };

  return <PlayModeSelectorPresentation onSelectMode={handleSelectMode} />;
}
