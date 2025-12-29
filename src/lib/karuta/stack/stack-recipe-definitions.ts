import type { StackRecipe } from '@/models/karuta';

/**
 * Available StackRecipes for selection
 * Defines how many cards to extract from Deck
 */
export const STACK_RECIPES: StackRecipe[] = [
  {
    id: 'all-random',
    title: 'All Cards (Random)',
    description: 'Use entire deck with random order',
    maxSize: 'all',
    sortMethod: 'random',
    difficulty: 'advanced',
    tags: ['complete', 'advanced'],
  },
  {
    id: 'standard-10',
    title: '10 Cards',
    description: 'Standard game with 10 cards',
    maxSize: 10,
    sortMethod: 'random',
    difficulty: 'beginner',
    tags: ['standard', 'beginner'],
  },
];

/**
 * Find a StackRecipe by id
 * @param id - Recipe id
 * @returns StackRecipe or undefined
 */
export function findStackRecipeById(id: string): StackRecipe | undefined {
  return STACK_RECIPES.find((recipe) => recipe.id === id);
}
