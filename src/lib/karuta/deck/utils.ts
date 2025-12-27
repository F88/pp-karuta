import type { Deck } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Create a Deck from array of NormalizedPrototype
 * Ensures unique IDs by using Map structure
 */
export function createDeck(prototypes: NormalizedPrototype[]): Deck {
  const deckMap = new Map<number, NormalizedPrototype>();
  for (const prototype of prototypes) {
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
 */
export function recreateDeck(
  prototypeIds: number[],
  allPrototypes: NormalizedPrototype[],
): Deck {
  const prototypeMap = new Map(allPrototypes.map((p) => [p.id, p] as const));

  const deckMap = new Map<number, NormalizedPrototype>();
  for (const id of prototypeIds) {
    const prototype = prototypeMap.get(id);
    if (prototype) {
      deckMap.set(id, prototype);
    }
  }

  return deckMap;
}
