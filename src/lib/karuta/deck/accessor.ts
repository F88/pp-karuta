import type { Deck } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Get NormalizedPrototype from deck by ID
 * @param deck - Deck map
 * @param id - Prototype ID
 * @returns NormalizedPrototype or undefined
 */
export function getPrototypeById(
  deck: Deck,
  id: number,
): NormalizedPrototype | undefined {
  return deck.get(id);
}

/**
 * Get multiple NormalizedPrototypes from deck by IDs
 * @param deck - Deck map
 * @param ids - Prototype IDs
 * @returns Array of NormalizedPrototypes (filters out not found)
 */
export function getPrototypesByIds(
  deck: Deck,
  ids: number[],
): NormalizedPrototype[] {
  return ids
    .map((id) => deck.get(id))
    .filter((p): p is NormalizedPrototype => p !== undefined);
}
