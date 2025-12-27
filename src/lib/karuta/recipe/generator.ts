import type { Deck, DeckRecipe } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { createDeck } from '../deck/utils';

/**
 * Generate a Deck from DeckRecipe
 * @param recipe - DeckRecipe to generate Deck from
 * @param allPrototypes - All available prototypes
 * @returns Generated Deck (Map of ID -> NormalizedPrototype)
 */
export function generateDeck(
  recipe: DeckRecipe,
  allPrototypes: NormalizedPrototype[],
): Deck {
  if (allPrototypes.length < recipe.deckSize) {
    throw new Error(
      `Not enough prototypes. Required: ${recipe.deckSize}, Available: ${allPrototypes.length}`,
    );
  }

  // Simple random selection without replacement
  const shuffled = [...allPrototypes].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, recipe.deckSize);

  // Use createDeck utility for consistency
  return createDeck(selected);
}
