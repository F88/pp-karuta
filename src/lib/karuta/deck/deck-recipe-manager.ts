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

import type { DeckRecipe } from '@/models/karuta';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { ETO_RECIPES } from './deck-recipe-eto';
import { createReleaseDateYearFilter } from './filter-factory';

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

// ========================================
// Section 1: ETO (Chinese Zodiac) Recipes
// ========================================
// Moved to ./deck-recipe-eto.ts

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
    ...ETO_RECIPES,
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
