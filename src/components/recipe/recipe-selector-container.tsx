import { useCallback } from 'react';
import type { DeckRecipe, GameState } from '@/models/karuta';
import {
  DECK_RECIPES,
  generateDummyPrototypes,
  fetchPrototypesFromAPI,
  generateDeck,
  createInitialState,
} from '@/lib/karuta';
import { RecipeSelectorPresentation } from './recipe-selector-presentation';

export type RecipeSelectorContainerProps = {
  onGameStateCreated: (gameState: Omit<GameState, 'players'>) => void;
  onShowIntro?: () => void;
};

export function RecipeSelectorContainer({
  onGameStateCreated,
  onShowIntro,
}: RecipeSelectorContainerProps) {
  const handleSelectRecipe = useCallback(
    async (recipe: DeckRecipe) => {
      console.group(`🎴 Selected Recipe: ${recipe.title}`);

      // Check environment variable for dummy data usage
      const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

      let allPrototypes;
      if (useDummyData) {
        console.log('📦 Using dummy data (faker)');
        allPrototypes = generateDummyPrototypes(30);
      } else {
        console.log('🌐 Fetching from PROMIDAS API');
        allPrototypes = await fetchPrototypesFromAPI();
      }

      console.log(`Generated/Fetched ${allPrototypes.length} prototypes`);

      // Generate deck from recipe
      const deck = generateDeck(recipe, allPrototypes);
      console.log(`Generated deck with ${deck.size} cards`);

      // Create initial game state
      const initialState = createInitialState(deck);
      console.log('Initial GameState:', initialState);

      console.groupEnd();

      // Notify parent
      onGameStateCreated(initialState);
    },
    [onGameStateCreated],
  );

  return (
    <RecipeSelectorPresentation
      recipes={DECK_RECIPES}
      onSelectRecipe={handleSelectRecipe}
      onShowIntro={onShowIntro}
    />
  );
}
