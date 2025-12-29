import type { Deck, DeckMetaData } from './deck';
import type { Player } from './player';
import type { Stack } from './stack';
import type { Tatami } from './tatami';

/**
 * GamePlayerState - Player state within a specific game
 * Combines Player identity with game-specific state
 */
export type GamePlayerState = {
  player: Player; // Reference to the player
  tatami: number[]; // Player's own Tatami (required for Touch mode)
  mochiFuda: number[]; // IDs of acquired cards
  score: number;
};

/**
 * GameState - Complete game state
 */
export type GameState = {
  deck: Deck; // ID -> Prototype map
  stack: Stack; // Remaining card IDs
  tatami: Tatami; // Shared Tatami card IDs (for Keyboard mode or reference)
  playerStates: GamePlayerState[];
  readingOrder: number[]; // Order of cards to be read (YomiFuda sequence)
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
