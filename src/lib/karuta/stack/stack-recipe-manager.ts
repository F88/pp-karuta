import type { StackRecipe } from '@/models/karuta';

/**
 * StackRecipeManager - Centralized management for StackRecipes
 * Handles recipe definitions and lookup methods
 */
export class StackRecipeManager {
  // ========================================
  // Section 1: Recipe Definitions
  // ========================================

  /**
   * Available StackRecipes for selection
   * Defines how many cards to extract from Deck
   */
  static readonly RECIPES: StackRecipe[] = [
    {
      id: 'standard-10',
      title: '10 枚',
      description: 'Standard game with 10 枚数',
      tags: ['standard', 'beginner'],
      difficulty: 'beginner',
      sortMethod: 'random',
      maxSize: 10,
    },
    {
      id: 'standard-20',
      title: '20 枚',
      description: 'Standard game with 20 枚',
      tags: ['standard', 'beginner'],
      difficulty: 'beginner',
      sortMethod: 'random',
      maxSize: 20,
    },
    {
      id: 'standard-30',
      title: '30 枚',
      description: 'Standard game with 30 枚',
      tags: ['standard', 'beginner'],
      difficulty: 'beginner',
      sortMethod: 'random',
      maxSize: 30,
    },
    {
      id: 'all-random',
      title: 'ALL',
      description: 'Use entire deck with random order',
      tags: ['complete', 'advanced'],
      difficulty: 'advanced',
      sortMethod: 'random',
      maxSize: 'all',
    },
  ];

  // ========================================
  // Section 2: Recipe Lookup
  // ========================================

  /**
   * Find a StackRecipe by id
   * @param id - Recipe id
   * @returns StackRecipe or undefined
   */
  static findById(id: string): StackRecipe | undefined {
    return this.RECIPES.find((recipe) => recipe.id === id);
  }

  /**
   * Get all available recipes
   * @returns Array of all StackRecipes
   */
  static getAll(): StackRecipe[] {
    return [...this.RECIPES];
  }

  /**
   * Filter recipes by difficulty
   * @param difficulty - Difficulty level
   * @returns Filtered array of StackRecipes
   */
  static filterByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced',
  ): StackRecipe[] {
    return this.RECIPES.filter((recipe) => recipe.difficulty === difficulty);
  }

  /**
   * Filter recipes by tag
   * @param tag - Tag to filter by
   * @returns Filtered array of StackRecipes
   */
  static filterByTag(tag: string): StackRecipe[] {
    return this.RECIPES.filter((recipe) => recipe.tags.includes(tag));
  }
}
