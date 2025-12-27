import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Deck type - Map of prototype ID to prototype
 * Ensures unique IDs structurally
 */
export type Deck = Map<number, NormalizedPrototype>;

/**
 * DeckRecipe - Deck generation rule definition
 */
export type DeckRecipe = {
  id: string;
  title: string;
  deckSize: number; // Number of YomiFuda-ToriFuda pairs
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
