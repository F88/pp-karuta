import type { GameState, Deck } from '@/models/karuta';
import { getDeckIds } from './deck/utils';

/**
 * Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle
 * @returns Shuffled array (new array, does not mutate original)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Create initial GameState from Deck
 * @param deck - Deck (Map of ID -> NormalizedPrototype)
 * @returns Initial GameState with shuffled stack and initial tatami
 */
export function createInitialState(deck: Deck): Omit<GameState, 'players'> {
  if (deck.size === 0) {
    throw new Error('Deck must not be empty');
  }

  // Get all IDs and shuffle
  const allIds = getDeckIds(deck);
  const shuffledIds = shuffle(allIds);

  // Extract first 5 (or less if deck is smaller) for tatami
  const initialTatamiSize = Math.min(5, shuffledIds.length);
  const tatamiIds = shuffledIds.slice(0, initialTatamiSize);
  const remainingStackIds = shuffledIds.slice(initialTatamiSize);

  return {
    deck,
    stack: remainingStackIds,
    tatami: tatamiIds,
  };
}
