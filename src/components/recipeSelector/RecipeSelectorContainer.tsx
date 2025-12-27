import { useCallback } from 'react';
import type { DeckRecipe, GameState } from '@/models/karuta';
import {
  DECK_RECIPES,
  generateDummyPrototypes,
  generateDeck,
  createInitialState,
} from '@/lib/karuta';
import { RecipeSelectorPresentation } from './RecipeSelectorPresentation';

export type RecipeSelectorContainerProps = {
  onGameStateCreated: (gameState: Omit<GameState, 'players'>) => void;
};

export function RecipeSelectorContainer({
  onGameStateCreated,
}: RecipeSelectorContainerProps) {
  const handleSelectRecipe = useCallback(
    (recipe: DeckRecipe) => {
      console.group(`🎴 Selected Recipe: ${recipe.title}`);

      // Generate dummy prototypes
      const allPrototypes = generateDummyPrototypes(30);
      console.log(`Generated ${allPrototypes.length} dummy prototypes`);

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
    />
  );
}
