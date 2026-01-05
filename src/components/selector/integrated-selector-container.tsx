import { logger } from '@/lib/logger';
import { useRepositoryState } from '@/hooks/use-repository-state';
import { useScreenSizeContext } from '@/hooks/use-screen-size-context';
import type { UseGameSetupReturn } from '@/hooks/use-game-setup';
import { STACK_RECIPES } from '@/lib/karuta';
import { DeckRecipeManager } from '@/lib/karuta/deck';
import { useEffect } from 'react';
import { IntegratedSelectorPresentation } from './integrated-selector-presentation';

export type IntegratedSelectorContainerProps = {
  setup: UseGameSetupReturn;
  onShowIntro?: () => void;
};

export function IntegratedSelectorContainer({
  setup,
  onShowIntro,
}: IntegratedSelectorContainerProps) {
  const screenSize = useScreenSizeContext();

  // Repository state
  const repoState = useRepositoryState();

  // Show repository error
  useEffect(() => {
    if (repoState.type === 'token-invalid') {
      logger.error('Repository error:', repoState.error);
    }
  }, [repoState]);

  const isRepoReady = repoState.type === 'created-token-valid';
  const repoError = repoState.type === 'token-invalid' ? repoState.error : null;

  return (
    <IntegratedSelectorPresentation
      playMode={{
        selected: setup.selectedPlayMode,
        onSelect: setup.selectPlayMode,
      }}
      repository={{
        isReady: isRepoReady,
      }}
      deckRecipe={{
        recipes: DeckRecipeManager.RECIPES,
        selected: setup.selectedDeckRecipe,
        onSelect: setup.selectDeckRecipe,
        isLoading: setup.isDeckLoading,
        loadingRecipeId: setup.loadingDeckRecipeId,
        generatedDeck: setup.generatedDeck,
      }}
      stackRecipe={{
        recipes: STACK_RECIPES,
        selected: setup.selectedStackRecipe,
        onSelect: setup.selectStackRecipe,
        generatedStack: setup.generatedStack,
      }}
      players={{
        available: setup.availablePlayers,
        selectedIds: setup.selectedPlayerIds,
        onToggle: setup.togglePlayer,
        onAdd: setup.addPlayer,
      }}
      tatamiSize={{
        selected: setup.selectedTatamiSize,
        onSelect: setup.selectTatamiSize,
        availableSizes: setup.availableTatamiSizes,
      }}
      game={{
        onStart: setup.createGameState,
        canStart: setup.canStartGame,
      }}
      state={{
        isLoading: setup.isCreatingGame || repoState.type === 'validating',
        error:
          setup.error || (repoError ? `Repository error: ${repoError}` : null),
      }}
      onShowIntro={onShowIntro}
      screenSize={screenSize}
    />
  );
}
