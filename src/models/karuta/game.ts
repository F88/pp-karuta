import type { Deck, DeckMetaData } from './deck';
import type { Player } from './player';
import type { Stack } from './stack';
import type { Tatami } from './tatami';

/**
 * GameState - Complete game state
 */
export type GameState = {
  deck: Deck; // ID -> Prototype map
  stack: Stack; // Remaining card IDs
  tatami: Tatami; // Shared Tatami card IDs (for Keyboard mode or reference)
  players: Player[];
};

/**
 * Game result - single game outcome
 */
export type GameResult = {
  id: string; // Unique result ID
  deckMetaData: DeckMetaData;
  playedAt: number; // Game completion timestamp
  playTime: number; // Game duration in milliseconds
  players: {
    id: string;
    name: string;
    score: number;
    mochiFudaCount: number;
    wrongCount: number;
    isWinner: boolean;
  }[];
};

/**
 * Game history - all game results
 */
export type GameHistory = {
  results: GameResult[];
};
