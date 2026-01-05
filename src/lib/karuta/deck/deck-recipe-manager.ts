import type { DeckRecipe } from '@/models/karuta';
import type { NormalizedPrototype } from 'node_modules/@f88/promidas/dist/types/normalized-prototype';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { normalizeString } from '@/lib/string-utils';

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
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'beginner',
  tags: [],
};

/**
 * Create a filter function for keyword-based filtering
 * Filters prototypes by matching keywords against prototypeNm and summary (case-insensitive)
 * Half-width and full-width katakana/alphanumeric are treated as equivalent
 * @param keywords - Keywords to match against prototypeNm and summary
 * @returns Filter function for DeckRecipe
 */
function createKeywordFilter(keywords: string[]) {
  // Normalize keywords once for better performance
  const normalizedKeywords = keywords.map((k) => normalizeString(k));

  return (prototypes: NormalizedPrototype[]) => {
    return prototypes.filter((e) => {
      // Normalize prototype data
      const normalizedName = normalizeString(e.prototypeNm);
      const normalizedSummary = normalizeString(e.summary);

      // Find matching keyword in name
      let matchedKeyword = normalizedKeywords.find((keyword) =>
        normalizedName.includes(keyword),
      );

      // If not found in name, search in summary
      if (!matchedKeyword) {
        matchedKeyword = normalizedKeywords.find((keyword) =>
          normalizedSummary.includes(keyword),
        );
      }

      if (matchedKeyword) {
        console.debug(
          `✅ DeckRecipe filter matched: "${matchedKeyword}" in ${e.id} - ${e.prototypeNm}`,
        );
      }

      return !!matchedKeyword;
    });
  };
}

const DECK_ETO_BASE: Pick<DeckRecipe, 'apiParams' | 'difficulty' | 'tags'> = {
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'intermediate',
  tags: ['干支'],
};

const DECK_ETO_MI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-mi',
  title: '🐍 巳',
  description: 'へびにちなんだ作品',
  filter: createKeywordFilter([
    '🐍',
    'SNAKE',
    'HEBI',
    'HEAVY',
    'へび',
    'ヘビ',
    'スネーク',
    '巳',
    '蛇',
  ]),
};

const DECK_ETO_UMA: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-uma',
  title: '🐴 UMA',
  description: 'うまにちなんだ作品',
  filter: createKeywordFilter([
    '🐴',
    'HORSE',
    'UMA',
    'うま',
    'ウマ',
    'ホース',
    '午',
    '馬',
  ]),
};

const DECK_ETO_HITSUJI: DeckRecipe = {
  ...DECK_ETO_BASE,
  id: 'eto-hitsuji',
  title: '🐏 未',
  description: 'ひつじにちなんだ作品',
  filter: createKeywordFilter([
    '🐏',
    'SHEEP',
    'HITSUJI',
    'ひつじ',
    'ヒツジ',
    'ラム',
    'ジンギスカン',
    // '未',
    '羊',
  ]),
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
    DECK_ETO_MI,
    DECK_ETO_UMA,
    DECK_ETO_HITSUJI,
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
