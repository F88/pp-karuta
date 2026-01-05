/**
 * @fileoverview DeckRecipe management module
 *
 * This module provides centralized management for DeckRecipes, including:
 * - Recipe definitions (ETO-themed, release year-based, range-based, etc.)
 * - Recipe generation utilities
 * - Filter creation for prototype filtering
 * - Recipe lookup and filtering methods
 *
 * @module DeckRecipeManager
 */

import type { ListPrototypesParams } from 'protopedia-api-v2-client';

import type { NormalizedPrototype } from '@f88/promidas/types';

import { normalizeString } from '@/lib/string-utils';

import type { DeckRecipe } from '@/models/karuta';

/**
 * Type for prototype window parameters (offset and limit)
 */
type ROTOTYPES_WINDOW = Pick<ListPrototypesParams, 'offset' | 'limit'>;

/**
 * Default parameters for fetching all prototypes
 * - offset: 0 (start from the beginning)
 * - limit: 10,000 (maximum number of prototypes to fetch)
 */
const ALL_PROTOTYPES: ROTOTYPES_WINDOW = { offset: 0, limit: 10_000 };

/**
 * Recipe for all prototypes without any filtering
 * This is the default deck that includes all available prototypes
 */
const DECK_RECIPE_ALL_PROTOTYPES: DeckRecipe = {
  id: 'all-prototypes',
  title: '🌐 全作品',
  description: '全ての作品',
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'beginner',
  tags: [],
};

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

/**
 * Generate release year based deck recipes
 * @param years - Array of years to generate recipes for (e.g., [2023, 2024, 2025])
 * @returns Array of DeckRecipes
 */
function generateReleaseYearDecks(years: number[]): DeckRecipe[] {
  return years.map((year) => ({
    id: `rel-${year}`,
    title: `🎉 ${year}`,
    description: `${year}年生まれ`,
    apiParams: { ...ALL_PROTOTYPES },
    difficulty: 'intermediate',
    tags: [
      'リリース',
      //  String(year)
    ],
    filter: createReleaseDateYearFilter(year),
  }));
}

/**
 * Create a filter function for releaseDate-based filtering
 * Filters prototypes by releaseDate year
 * @param year - Year to filter by
 * @returns Filter function for DeckRecipe
 */
function createReleaseDateYearFilter(year: number) {
  return (prototypes: NormalizedPrototype[]) => {
    return prototypes.filter((e) => {
      if (!e.releaseDate) {
        return false;
      }

      const releaseYear = new Date(e.releaseDate).getFullYear();
      const matched = releaseYear === year;

      if (matched) {
        console.debug(
          `✅ DeckRecipe releaseDate filter matched: ${year} in ${e.id} - ${e.prototypeNm} (${e.releaseDate})`,
        );
      }

      return matched;
    });
  };
}

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

/**
 * Base configuration for ETO (Chinese zodiac) themed recipes
 * - Fetches all prototypes for filtering
 * - Intermediate difficulty level
 * - Tagged with '干支' (zodiac)
 */
const DECK_ETO_BASE: Pick<DeckRecipe, 'apiParams' | 'difficulty' | 'tags'> = {
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'intermediate',
  tags: ['干支'],
};

/**
 * ETO recipe for Snake (巳) themed prototypes
 * Filters prototypes containing snake-related keywords in Japanese and English
 */
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

/**
 * ETO recipe for Horse (午) themed prototypes
 * Filters prototypes containing horse-related keywords in Japanese and English
 */
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

/**
 * ETO recipe for Sheep (未) themed prototypes
 * Filters prototypes containing sheep-related keywords in Japanese and English
 */
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
  private static releaseYearRecipes: DeckRecipe[] = generateReleaseYearDecks([
    2027,
    //
    2026,
    //
    2025, 2024, 2023, 2022, 2021,
    //
    2020, 2019, 2018, 2017, 2016,
    //
    2015, 2014,
  ]);

  /**
   * Available DeckRecipes for selection
   * Uses apiParams to control setupSnapshot data acquisition
   */
  static readonly RECIPES: DeckRecipe[] = [
    // ETO
    DECK_ETO_MI,
    DECK_ETO_UMA,
    DECK_ETO_HITSUJI,
    // Release year based
    ...this.releaseYearRecipes,
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
