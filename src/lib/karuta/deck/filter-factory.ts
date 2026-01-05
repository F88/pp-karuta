/**
 * @fileoverview Filter factory functions for deck recipes
 *
 * This module provides filter creation utilities for deck recipes.
 *
 * @module FilterFactory
 */

import type { NormalizedPrototype } from '@f88/promidas/types';

import { logger } from '@/lib/logger';
import { normalizeString } from '@/lib/string-utils';

/**
 * Create a filter function for keyword-based filtering
 * Filters prototypes by matching keywords against prototypeNm and summary (case-insensitive)
 * Half-width and full-width katakana/alphanumeric are treated as equivalent
 * @param keywords - Keywords to match against prototypeNm and summary
 * @returns Filter function for DeckRecipe
 */
export function createKeywordFilter(keywords: string[]) {
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
        logger.debug(
          `✅ DeckRecipe filter matched: "${matchedKeyword}" in ${e.id} - ${e.prototypeNm}`,
        );
      }

      return !!matchedKeyword;
    });
  };
}

/**
 * Create a filter function for release date year filtering
 *
 * Note: Uses getFullYear() instead of getUTCFullYear() because year filtering
 * should match the user's local timezone in the UI environment.
 * This ensures consistency with how dates are displayed to users.
 *
 * @param year - Year to filter by
 * @returns Filter function for DeckRecipe
 */
export function createReleaseDateYearFilter(year: number) {
  return (prototypes: NormalizedPrototype[]) => {
    return prototypes.filter((e) => {
      if (!e.releaseDate) {
        return false;
      }

      const releaseYear = new Date(e.releaseDate).getFullYear();
      const matched = releaseYear === year;

      if (matched) {
        logger.debug(
          `✅ DeckRecipe releaseDate filter matched: ${year} in ${e.id} - ${e.prototypeNm} (${e.releaseDate})`,
        );
      }

      return matched;
    });
  };
}
