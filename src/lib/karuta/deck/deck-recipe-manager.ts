import type { DeckRecipe } from '@/models/karuta';
import type { NormalizedPrototype } from 'node_modules/@f88/promidas/dist/types/normalized-prototype';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

type ROTOTYPES_WINDOW = Pick<ListPrototypesParams, 'offset' | 'limit'>;

const ALL_PROTOTYPES: ROTOTYPES_WINDOW = { offset: 0, limit: 10_000 };

// ========================================
// Section 0: Recipe Generation Helpers
// ========================================

/**
 * Generate sequential deck recipes with offset ranges
 * @param count - Number of decks to generate (e.g., 5 for Deck-1 to Deck-5)
 * @param limit - Prototypes per deck (default: 1000)
 * @returns Array of DeckRecipes
 */
function generateSequentialDecks(
  count: number,
  limit: number = 1_000,
): DeckRecipe[] {
  const recipes: DeckRecipe[] = [];

  for (let i = 1; i <= count; i++) {
    const offset = (i - 1) * limit;
    const rangeStart = offset + 1;
    const rangeEnd = offset + limit;

    recipes.push({
      id: `Deck-rande-${i}`,
      title: `Deck-${i}`,
      description: `${rangeStart.toLocaleString()} - ${rangeEnd.toLocaleString()}`,
      apiParams: {
        offset,
        limit,
      },
      difficulty: 'beginner',
      tags: [],
    });
  }

  return recipes;
}

const DECK_RECIPE_ALL_PROTOTYPES: DeckRecipe = {
  id: 'all-prototypes',
  title: '全作品',
  description: '全ての作品',
  apiParams: {
    ...ALL_PROTOTYPES,
  },
  difficulty: 'beginner',
  tags: [],
};

const DECK_ETO: DeckRecipe = {
  ...DECK_RECIPE_ALL_PROTOTYPES,
  id: 'eto-uma',
  title: '干支セット',
  description: '干支にちなんだ作品セット',
  difficulty: 'beginner',
  tags: ['干支'],
  filter: (prototypes: NormalizedPrototype[]) => {
    return prototypes.filter((e) => {
      return e.prototypeNm.includes('ProtpPedia');
    });
  },
};

/**
 * RecipeManager - Centralized management for DeckRecipes
 * Handles recipe definitions, lookup, and factory methods
 */
export class DeckRecipeManager {
  // ========================================
  // Section 1: Recipe Definitions
  // ========================================

  private static rangeRecipes: DeckRecipe[] = generateSequentialDecks(7);

  /**
   * Available DeckRecipes for selection
   * Uses apiParams to control setupSnapshot data acquisition
   */
  static readonly RECIPES: DeckRecipe[] = [
    // ETO
    DECK_ETO,
    // All-prototypes recipe
    DECK_RECIPE_ALL_PROTOTYPES,
    // Range-based recipes
    ...this.rangeRecipes,
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
}
