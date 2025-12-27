import type { DeckRecipe } from '@/models/karuta';

/**
 * Available DeckRecipes for selection
 */
export const DECK_RECIPES: DeckRecipe[] = [
  {
    id: '1-race',
    title: '1 Race',
    deckSize: 1,
  },
  {
    id: '3-races',
    title: '3 Races',
    deckSize: 3,
  },
];

/**
 * Find a DeckRecipe by id
 * @param id - Recipe id
 * @returns DeckRecipe or undefined
 */
export function findRecipeById(id: string): DeckRecipe | undefined {
  return DECK_RECIPES.find((recipe) => recipe.id === id);
}
