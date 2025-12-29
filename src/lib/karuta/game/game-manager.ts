import type {
  Deck,
  GameState,
  GamePlayerState,
  StackRecipe,
} from '@/models/karuta';
import type { Player } from '@/models/karuta';
import type { PlayMode } from '../playMode/play-mode-manager';
import { StackManager } from '../stack/stack-manager';
import { PlayerManager } from '../player/player-manager';
import { PlayModeManager } from '../playMode/play-mode-manager';

/**
 * GameManager - Centralized management for GameState and game logic
 * Handles GameState initialization and game-related operations
 */
export class GameManager {
  /**
   * Maximum number of players that can play simultaneously in a game
   */
  static readonly MAX_GAME_PLAYERS = 4;

  // ========================================
  // Section 1: GameState Initialization
  // ========================================

  /**
   * Create initial GameState from Deck, StackRecipe, and Players
   * Generates Stack from Deck using StackRecipe, extracts first N for Tatami
   * Initializes GamePlayerState for each Player
   * @param deck - Deck (Map of ID -> NormalizedPrototype)
   * @param players - Player array (1-4 players)
   * @param playMode - PlayMode (keyboard or touch)
   * @param stackRecipe - StackRecipe defining Stack generation rules
   * @param initialTatamiSize - Initial Tatami size (default: 5)
   * @returns Complete initial GameState
   * @throws {Error} If Deck is empty, players validation fails, or playMode is invalid
   */
  static createInitialState(
    deck: Deck,
    players: Player[],
    playMode: PlayMode,
    stackRecipe: StackRecipe,
    initialTatamiSize = 5,
  ): GameState {
    if (deck.size === 0) {
      throw new Error('Deck must not be empty');
    }

    // Validation: players for game
    PlayerManager.validatePlayersForGame(players, this.MAX_GAME_PLAYERS);

    // Validation: playMode
    PlayModeManager.validatePlayMode(playMode);

    // Generate Stack from Deck using StackRecipe
    const fullStack = StackManager.generate(deck, stackRecipe);

    // Extract first N (or less if stack is smaller) for tatami
    const actualTatamiSize = Math.min(initialTatamiSize, fullStack.length);
    const tatamiIds = fullStack.slice(0, actualTatamiSize);
    const stackIds = fullStack.slice(actualTatamiSize);

    // Initialize GamePlayerState for each player
    const playerStates: GamePlayerState[] = players.map((player) => ({
      player,
      tatami: [...tatamiIds],
      mochiFuda: [],
      score: 0,
    }));

    return {
      deck,
      stack: stackIds,
      tatami: tatamiIds,
      playerStates,
      readingOrder: fullStack, // Preserve the full reading order
    };
  }
}
