import { useCallback, useState, useEffect } from 'react';
import type { DeckRecipe, GameState } from '@/models/karuta';
import {
  DECK_RECIPES,
  generateDummyPrototypes,
  fetchPrototypesFromAPI,
  generateDeck,
  createInitialState,
} from '@/lib/karuta';
import { getRepositoryState } from '@/lib/repository/promidas-repo';
import type { PlayMode } from '@/components/playMode/play-mode-selector-presentation';
import { RepoSetupDialog } from '@/components/layout/repo-setup-dialog';
import { RecipeSelectorPresentation } from './recipe-selector-presentation';

export type RecipeSelectorContainerProps = {
  playMode: PlayMode;
  onGameStateCreated: (gameState: Omit<GameState, 'players'>) => void;
  onShowIntro?: () => void;
};

export function RecipeSelectorContainer({
  playMode,
  onGameStateCreated,
  onShowIntro,
}: RecipeSelectorContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null);
  const [, setRepoCheckCounter] = useState(0);

  // Check repository availability
  const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
  const repoState = getRepositoryState();
  const isRepoValid = useDummyData || repoState.type === 'created-token-valid';

  // Poll repository state when dialog is shown
  useEffect(() => {
    if (!isRepoValid) {
      const intervalId = setInterval(() => {
        setRepoCheckCounter((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRepoValid]);

  // Log playMode on mount
  useEffect(() => {
    console.log('[RecipeSelectorContainer] PlayMode:', playMode);
    console.log('[RecipeSelectorContainer] Repository state:', repoState);
    console.log('[RecipeSelectorContainer] Use dummy data:', useDummyData);
  }, [playMode, repoState, useDummyData]);

  const handleSelectRecipe = useCallback(
    async (recipe: DeckRecipe) => {
      setIsLoading(true);
      setError(null);
      setLoadingRecipeId(recipe.id);

      try {
        console.group(`🎴 Selected Recipe: ${recipe.title}`);

        // Check environment variable for dummy data usage
        const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

        let allPrototypes;
        if (useDummyData) {
          console.log('📦 Using dummy data (faker)');
          allPrototypes = generateDummyPrototypes(
            Math.max(30, recipe.deckSize),
          );
        } else {
          console.log('🌐 Fetching from PROMIDAS API');
          // Fetch more prototypes than needed to ensure we have enough variety
          const fetchLimit = Math.max(100, recipe.deckSize * 2);
          allPrototypes = await fetchPrototypesFromAPI(fetchLimit);
        }

        console.log(`Generated/Fetched ${allPrototypes.length} prototypes`);

        // Validate we have enough prototypes
        if (allPrototypes.length < recipe.deckSize) {
          throw new Error(
            `Not enough prototypes available. Need ${recipe.deckSize}, got ${allPrototypes.length}`,
          );
        }

        // Generate deck from recipe
        const deck = generateDeck(recipe, allPrototypes);
        console.log(`Generated deck with ${deck.size} cards`);

        // Create initial game state with shuffled stack
        const initialState = createInitialState(deck);
        console.log('Initial GameState created:', {
          deckSize: initialState.deck.size,
          stackSize: initialState.stack.length,
          tatamiSize: initialState.tatami.length,
        });

        console.groupEnd();

        // Notify parent
        onGameStateCreated(initialState);
      } catch (err) {
        console.error('Failed to create game state:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.groupEnd();
      } finally {
        setIsLoading(false);
        setLoadingRecipeId(null);
      }
    },
    [onGameStateCreated],
  );

  // If repository is not valid, show setup dialog
  if (!isRepoValid) {
    return <RepoSetupDialog open={true} onOpenChange={() => {}} />;
  }

  return (
    <RecipeSelectorPresentation
      recipes={DECK_RECIPES}
      onSelectRecipe={handleSelectRecipe}
      onShowIntro={onShowIntro}
      isLoading={isLoading}
      error={error}
      loadingRecipeId={loadingRecipeId}
    />
  );
}
