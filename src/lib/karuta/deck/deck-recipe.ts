/**
 * @fileoverview Individual DeckRecipe definitions
 *
 * This module contains individual deck recipe definitions including:
 * - All prototypes recipe
 * - PROMIDAS recipe (development only)
 * - Karuta-themed recipe
 *
 * @module DeckRecipe
 */

import { createIdsFilter, createKeywordFilter } from './filter-factory';

import type { DeckRecipe } from '@/models/karuta';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

/**
 * Type for prototype window parameters (offset and limit)
 */
type PROTOTYPES_WINDOW = Pick<ListPrototypesParams, 'offset' | 'limit'>;

/**
 * Default parameters for fetching all prototypes
 * - offset: 0 (start from the beginning)
 * - limit: 10,000 (maximum number of prototypes to fetch)
 */
export const ALL_PROTOTYPES: PROTOTYPES_WINDOW = { offset: 0, limit: 10_000 };

/**
 * Recipe for all prototypes without any filtering
 * This is the default deck that includes all available prototypes
 */
export const DECK_RECIPE_ALL_PROTOTYPES: DeckRecipe = {
  id: 'all-prototypes',
  title: '🌐 全作品',
  description: '全ての作品',
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'advanced',
  tags: [],
};

/**
 * PROMIDAS-themed deck recipe for development use
 */
export const DECK_RECIPE_PROMIDAS: DeckRecipe = {
  id: 'promidase',
  title: '🧰 PROMIDAS',
  apiParams: { offset: 5000, limit: 3000 },
  difficulty: 'beginner',
  tags: ['PROMIDAS'],
  description: 'PROMIDAS利用',
  filter: createIdsFilter([
    7917 /*	🧰 PROMIDAS */, 7920 /* 🛝 PROMIDAS Playground */,
    7968 /* 🧰 PROMIDAS Utilities */,
    7972 /* 🎴 怖露徒頁帝亜 狩流多 弐拾六式 馬耳闘風編 */,
  ]),
};

/**
 * Karuta-themed deck recipe
 */
export const DECK_RECIPE_KARUTA: DeckRecipe = {
  id: 'karuta',
  title: '🎴 かるた',
  apiParams: { ...ALL_PROTOTYPES },
  difficulty: 'intermediate',
  tags: ['かるた'],
  description: 'かるた作品',
  filter: createKeywordFilter([
    'かるた',
    'カルタ',
    '歌留多',
    '百人一首',
    'KARUTA',
  ]),
};
