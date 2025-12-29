import type { StackRecipe } from '@/models/karuta';

/**
 * Available StackRecipes for selection
 * Defines how many cards to extract from Deck
 */
export const STACK_RECIPES: StackRecipe[] = [
  {
    id: 'quick-5',
    title: '5 Cards',
    description: 'Quick game with 5 cards',
    maxSize: 5,
    sortMethod: 'random',
    difficulty: 'beginner',
    tags: ['quick', 'beginner'],
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
  {
    id: 'medium-20',
    title: '20 Cards',
    description: 'Medium game with 20 cards',
    maxSize: 20,
    sortMethod: 'random',
    difficulty: 'intermediate',
    tags: ['standard', 'intermediate'],
  },
  {
    id: 'challenge-50',
    title: '50 Cards',
    description: 'Challenge with 50 cards',
    maxSize: 50,
    sortMethod: 'random',
    difficulty: 'advanced',
    tags: ['challenge', 'advanced'],
  },
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
    id: 'all-sequential',
    title: 'All Cards (Sequential)',
    description: 'Use entire deck in original order',
    maxSize: 'all',
    sortMethod: 'sequential',
    difficulty: 'advanced',
    tags: ['complete', 'advanced', 'sequential'],
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
