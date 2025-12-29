import type { DeckRecipe } from '@/models/karuta';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

/**
 * RecipeManager - Centralized management for DeckRecipes
 * Handles recipe definitions, lookup, and factory methods
 */
export class RecipeManager {
  // ========================================
  // Section 1: Recipe Definitions
  // ========================================

  /**
   * Available DeckRecipes for selection
   * Uses apiParams to control setupSnapshot data acquisition
   */
  static readonly RECIPES: DeckRecipe[] = [
    {
      id: '1-race',
      title: '1 Race',
      description: 'Quick practice with single prototype',
      apiParams: { offset: 0, limit: 10_000 },
      difficulty: 'beginner',
      tags: ['quick', 'practice'],
    },
    {
      id: '3-races',
      title: '3 Races',
      description: 'Short game for beginners',
      apiParams: { offset: 0, limit: 10_000 },
      difficulty: 'beginner',
      tags: ['short', 'beginner'],
    },
    {
      id: '5-races',
      title: '5 Races',
      description: 'Standard practice session',
      apiParams: { offset: 0, limit: 10_000 },
      difficulty: 'intermediate',
      tags: ['standard', 'practice'],
    },
    {
      id: '10-races',
      title: '10 Races',
      description: 'Extended gameplay for intermediate players',
      apiParams: { offset: 0, limit: 10_000 },
      difficulty: 'intermediate',
      tags: ['standard', 'intermediate'],
    },
    {
      id: '20-races',
      title: '20 Races',
      description: 'Challenge mode for advanced players',
      apiParams: { offset: 0, limit: 10_000 },
      difficulty: 'advanced',
      tags: ['challenge', 'advanced'],
    },
  ];

  // ========================================
  // Section 2: Recipe Lookup
  // ========================================

  /**
   * Find a DeckRecipe by id
   * @param id - Recipe id
   * @returns DeckRecipe or undefined
   */
  static findById(id: string): DeckRecipe | undefined {
    return this.RECIPES.find((recipe) => recipe.id === id);
  }

  /**
   * Get all available recipes
   * @returns Array of all DeckRecipes
   */
  static getAll(): DeckRecipe[] {
    return [...this.RECIPES];
  }

  /**
   * Filter recipes by difficulty
   * @param difficulty - Difficulty level
   * @returns Filtered array of DeckRecipes
   */
  static filterByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced',
  ): DeckRecipe[] {
    return this.RECIPES.filter((recipe) => recipe.difficulty === difficulty);
  }

  /**
   * Filter recipes by tag
   * @param tag - Tag to filter by
   * @returns Filtered array of DeckRecipes
   */
  static filterByTag(tag: string): DeckRecipe[] {
    return this.RECIPES.filter((recipe) => recipe.tags.includes(tag));
  }

  // ========================================
  // Section 3: Recipe Factory
  // ========================================

  /**
   * Create a custom DeckRecipe
   * @param params - Recipe parameters
   * @returns New DeckRecipe instance
   */
  static create(params: {
    id: string;
    title: string;
    description?: string;
    apiParams: ListPrototypesParams;
    idFilter?: number[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  }): DeckRecipe {
    return {
      id: params.id,
      title: params.title,
      description: params.description,
      apiParams: params.apiParams,
      idFilter: params.idFilter,
      difficulty: params.difficulty,
      tags: params.tags,
    };
  }
}
