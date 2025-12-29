import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

/**
 * Deck type - Map of prototype ID to prototype
 * Ensures unique IDs structurally
 */
export type Deck = Map<number, NormalizedPrototype>;

/**
 * DeckRecipe - Deck generation rule definition
 * Specifies data acquisition parameters for setupSnapshot
 */
export type DeckRecipe = {
  id: string;
  title: string;
  description?: string; // Optional description
  tags: string[]; // Tags for filtering (e.g., ['quick', 'practice'])
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // Difficulty level
  apiParams: ListPrototypesParams; // Parameters for setupSnapshot
  filter?: (prototypes: NormalizedPrototype[]) => NormalizedPrototype[];
};

/**
 * Prototype IDs hash - reproducible deck identifier
 * Same ID set = Same hash (ignores fetchedAt)
 */
export type DeckIdsHash = string; // SHA-256(prototypeIds)

/**
 * Deck identifier - uniquely identifies a specific deck at specific time
 * Includes fetchedAt for complete uniqueness
 */
export type DeckIdentifier = {
  deckHash: string; // SHA-256(fetchedAt + prototypeIds)
};

/**
 * Deck metadata - both hashes + regeneration info
 */
export type DeckMetaData = DeckIdentifier & {
  deckIdsHash: DeckIdsHash; // For grouping/regeneration
  title: string; // Display title (e.g., "3 Races")
  prototypeIds: number[]; // Sorted IDs for API re-fetch
  fetchedAt: number; // API fetch timestamp (for records/display)
};
