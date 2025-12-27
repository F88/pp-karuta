import type { Deck } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Create a Deck from array of NormalizedPrototype
 * Ensures unique IDs by using Map structure
 * @throws {Error} If validation fails or duplicates found
 */
export function createDeck(prototypes: NormalizedPrototype[]): Deck {
  // Validation: Input must be array
  if (!Array.isArray(prototypes)) {
    throw new Error(`Invalid input: prototypes must be an array`);
  }

  // Validation: Empty array check
  if (prototypes.length === 0) {
    throw new Error(`Invalid input: prototypes array cannot be empty`);
  }

  const deckMap = new Map<number, NormalizedPrototype>();
  const seenIds = new Set<number>();

  for (const prototype of prototypes) {
    // Validation: Prototype must have valid ID
    if (!prototype || typeof prototype.id !== 'number') {
      throw new Error(`Invalid prototype: missing or invalid ID`);
    }

    // Detect duplicates (before Map silently overwrites)
    if (seenIds.has(prototype.id)) {
      throw new Error(`Duplicate prototype ID detected: ${prototype.id}`);
    }

    seenIds.add(prototype.id);
    deckMap.set(prototype.id, prototype);
  }

  return deckMap;
}

/**
 * Get all prototype IDs from deck (sorted)
 */
export function getDeckIds(deck: Deck): number[] {
  return [...deck.keys()].sort((a, b) => a - b);
}

/**
 * Get all prototypes from deck as array
 */
export function getDeckPrototypes(deck: Deck): NormalizedPrototype[] {
  return [...deck.values()];
}

/**
 * Get deck size
 */
export function getDeckSize(deck: Deck): number {
  return deck.size;
}

/**
 * Check if deck contains a prototype by ID
 */
export function hasDeckPrototype(deck: Deck, id: number): boolean {
  return deck.has(id);
}

/**
 * Recreate Deck from prototype IDs and full prototype list
 * Used for regenerating decks from DeckMetaData
 * @throws {Error} If validation fails or prototypes not found
 */
export function recreateDeck(
  prototypeIds: number[],
  allPrototypes: NormalizedPrototype[],
): Deck {
  // Validation: Inputs must be arrays
  if (!Array.isArray(prototypeIds) || !Array.isArray(allPrototypes)) {
    throw new Error(`Invalid input: both arguments must be arrays`);
  }

  // Validation: IDs array cannot be empty
  if (prototypeIds.length === 0) {
    throw new Error(`Invalid input: prototypeIds array cannot be empty`);
  }

  const prototypeMap = new Map(allPrototypes.map((p) => [p.id, p] as const));

  const deckMap = new Map<number, NormalizedPrototype>();
  const notFoundIds: number[] = [];

  for (const id of prototypeIds) {
    const prototype = prototypeMap.get(id);
    if (prototype) {
      deckMap.set(id, prototype);
    } else {
      notFoundIds.push(id);
    }
  }

  // Validation: All IDs must be found
  if (notFoundIds.length > 0) {
    throw new Error(`Prototypes not found for IDs: ${notFoundIds.join(', ')}`);
  }

  return deckMap;
}
