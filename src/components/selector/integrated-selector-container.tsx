import { DECK_RECIPES, STACK_RECIPES } from '@/lib/karuta';
import { IntegratedSelectorPresentation } from './integrated-selector-presentation';
import { usePromidasRepository } from '@/hooks/use-promidas-repository';
import type { UseGameSetupReturn } from '@/hooks/useGameSetup';
import { useEffect } from 'react';

export type IntegratedSelectorContainerProps = {
  setup: UseGameSetupReturn;
  onShowIntro?: () => void;
};

export function IntegratedSelectorContainer({
  setup,
  onShowIntro,
}: IntegratedSelectorContainerProps) {
  // Repository
  const { loading: isRepoLoading, error: repoError } = usePromidasRepository();

  // Show repository error
  useEffect(() => {
    if (repoError) {
      console.error('Repository error:', repoError);
    }
  }, [repoError]);

  return (
    <IntegratedSelectorPresentation
      selectedPlayMode={setup.selectedPlayMode}
      onSelectPlayMode={setup.selectPlayMode}
      deckRecipes={DECK_RECIPES}
      selectedDeckRecipe={setup.selectedDeckRecipe}
      onSelectDeckRecipe={setup.selectDeckRecipe}
      isDeckLoading={setup.isDeckLoading}
      loadingDeckRecipeId={
        setup.isDeckLoading ? (setup.selectedDeckRecipe?.id ?? null) : null
      }
      generatedDeck={setup.generatedDeck}
      stackRecipes={STACK_RECIPES}
      selectedStackRecipe={setup.selectedStackRecipe}
      onSelectStackRecipe={setup.selectStackRecipe}
      generatedStack={setup.generatedStack}
      availablePlayers={setup.availablePlayers}
      selectedPlayerIds={setup.selectedPlayerIds}
      onTogglePlayer={setup.togglePlayer}
      onStartGame={setup.createGameState}
      canStartGame={setup.canStartGame}
      isLoading={setup.isCreatingGame || isRepoLoading}
      error={
        setup.error || (repoError ? `Repository error: ${repoError}` : null)
      }
      onShowIntro={onShowIntro}
    />
  );
}
