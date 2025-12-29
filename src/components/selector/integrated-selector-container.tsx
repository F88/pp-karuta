import { IntegratedSelectorPresentation } from './integrated-selector-presentation';
import { useRepositoryState } from '@/hooks/use-repository-state';
import type { UseGameSetupReturn } from '@/hooks/useGameSetup';
import { STACK_RECIPES } from '@/lib/karuta';
import { DeckRecipeManager } from '@/lib/karuta/deck';
import { useEffect } from 'react';

export type IntegratedSelectorContainerProps = {
  setup: UseGameSetupReturn;
  onShowIntro?: () => void;
};

export function IntegratedSelectorContainer({
  setup,
  onShowIntro,
}: IntegratedSelectorContainerProps) {
  // Repository state
  const repoState = useRepositoryState();

  // Show repository error
  useEffect(() => {
    if (repoState.type === 'token-invalid') {
      console.error('Repository error:', repoState.error);
    }
  }, [repoState]);

  const isRepoReady = repoState.type === 'created-token-valid';
  const repoError = repoState.type === 'token-invalid' ? repoState.error : null;

  return (
    <IntegratedSelectorPresentation
      selectedPlayMode={setup.selectedPlayMode}
      onSelectPlayMode={setup.selectPlayMode}
      isRepoReady={isRepoReady}
      deckRecipes={DeckRecipeManager.RECIPES}
      selectedDeckRecipe={setup.selectedDeckRecipe}
      onSelectDeckRecipe={setup.selectDeckRecipe}
      isDeckLoading={setup.isDeckLoading}
      loadingDeckRecipeId={setup.loadingDeckRecipeId}
      generatedDeck={setup.generatedDeck}
      stackRecipes={STACK_RECIPES}
      selectedStackRecipe={setup.selectedStackRecipe}
      onSelectStackRecipe={setup.selectStackRecipe}
      generatedStack={setup.generatedStack}
      availablePlayers={setup.availablePlayers}
      selectedPlayerIds={setup.selectedPlayerIds}
      onTogglePlayer={setup.togglePlayer}
      onAddPlayer={setup.addPlayer}
      onStartGame={setup.createGameState}
      canStartGame={setup.canStartGame}
      isLoading={setup.isCreatingGame || repoState.type === 'validating'}
      error={
        setup.error || (repoError ? `Repository error: ${repoError}` : null)
      }
      onShowIntro={onShowIntro}
    />
  );
}
