import type { Deck, DeckRecipe } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { createDeck } from '../deck/utils';

/**
 * Generate a Deck from DeckRecipe
 * @param recipe - DeckRecipe to generate Deck from
 * @param allPrototypes - All available prototypes
 * @returns Generated Deck (Map of ID -> NormalizedPrototype)
 * @throws {Error} If validation fails
 */
export function generateDeck(
  recipe: DeckRecipe,
  allPrototypes: NormalizedPrototype[],
): Deck {
  // Validation: Recipe
  if (!recipe || typeof recipe.deckSize !== 'number' || recipe.deckSize <= 0) {
    throw new Error(`Invalid recipe: deckSize must be positive number`);
  }

  // Validation: Prototypes array
  if (!Array.isArray(allPrototypes)) {
    throw new Error(`Invalid allPrototypes: must be an array`);
  }

  // Validation: Sufficient prototypes
  if (allPrototypes.length < recipe.deckSize) {
    throw new Error(
      `Not enough prototypes. Required: ${recipe.deckSize}, Available: ${allPrototypes.length}`,
    );
  }

  // Validation: All prototypes have valid IDs
  const invalidPrototype = allPrototypes.find(
    (p) => !p || typeof p.id !== 'number',
  );
  if (invalidPrototype) {
    throw new Error(`Invalid prototype found: missing or invalid ID`);
  }

  // Random selection without replacement using Fisher-Yates shuffle
  const shuffled = [...allPrototypes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, recipe.deckSize);

  // Use createDeck utility for consistency
  return createDeck(selected);
}
