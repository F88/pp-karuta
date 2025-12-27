import type { DeckRecipe } from '@/models/karuta';

/**
 * Available DeckRecipes for selection
 */
export const DECK_RECIPES: DeckRecipe[] = [
  {
    id: '1-race',
    title: '1 Race',
    description: 'Quick practice with single prototype',
    deckSize: 1,
    difficulty: 'beginner',
    tags: ['quick', 'practice'],
  },
  {
    id: '3-races',
    title: '3 Races',
    description: 'Short game for beginners',
    deckSize: 3,
    difficulty: 'beginner',
    tags: ['short', 'beginner'],
  },
  {
    id: '5-races',
    title: '5 Races',
    description: 'Standard practice session',
    deckSize: 5,
    difficulty: 'intermediate',
    tags: ['standard', 'practice'],
  },
  {
    id: '10-races',
    title: '10 Races',
    description: 'Extended gameplay for intermediate players',
    deckSize: 10,
    difficulty: 'intermediate',
    tags: ['standard', 'intermediate'],
  },
  {
    id: '20-races',
    title: '20 Races',
    description: 'Challenge mode for advanced players',
    deckSize: 20,
    difficulty: 'advanced',
    tags: ['challenge', 'advanced'],
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
