import type {
  Deck,
  GameState,
  GamePlayerState,
  StackRecipe,
} from '@/models/karuta';
import type { Player } from '@/models/karuta';
import type { PlayMode } from '../playMode/play-mode-manager';
import type { NormalizedPrototype } from '@f88/promidas/types';
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

  // ========================================
  // Section 2: Game Logic Operations
  // ========================================

  /**
   * Get total number of mochiFuda (acquired cards) across all players
   * @param gameState - Current GameState
   * @returns Total count of mochiFuda
   */
  static getTotalMochiFuda(gameState: GameState): number {
    return gameState.playerStates.reduce(
      (sum, ps) => sum + ps.mochiFuda.length,
      0,
    );
  }

  /**
   * Check if the game is over
   * Game ends when all cards from readingOrder have been acquired
   * @param gameState - Current GameState
   * @returns True if game is over
   */
  static isGameOver(gameState: GameState): boolean {
    const totalMochiFuda = this.getTotalMochiFuda(gameState);
    return totalMochiFuda >= gameState.readingOrder.length;
  }

  /**
   * Get the current YomiFuda (reading card) based on game progress
   * @param gameState - Current GameState
   * @returns Current YomiFuda prototype, or null if game is over
   */
  static getCurrentYomiFuda(gameState: GameState): NormalizedPrototype | null {
    const completedRaces = this.getTotalMochiFuda(gameState);
    const currentYomiFudaId = gameState.readingOrder[completedRaces];

    if (currentYomiFudaId === undefined) {
      return null;
    }

    return gameState.deck.get(currentYomiFudaId) ?? null;
  }

  /**
   * Process a correct answer when a player selects the right card
   * - Removes the card from all players' tatami
   * - Adds next card from stack to all players' tatami
   * - Updates the correct player's mochiFuda and score
   * - Updates shared tatami
   * @param gameState - Current GameState
   * @param playerId - ID of the player who answered correctly
   * @param cardId - ID of the card that was selected
   * @returns New GameState with updates applied
   */
  static processCorrectAnswer(
    gameState: GameState,
    playerId: string,
    cardId: number,
  ): GameState {
    // Update player states
    const updatedPlayerStates = gameState.playerStates.map((ps) => {
      // Remove card from ALL players' tatami
      const newPlayerTatami = ps.tatami.filter((id) => id !== cardId);

      // Add next card from stack to ALL players' tatami
      if (gameState.stack.length > 0) {
        newPlayerTatami.push(gameState.stack[0]);
      }

      // Update mochiFuda and score only for the player who got it correct
      if (ps.player.id === playerId) {
        return {
          ...ps,
          tatami: newPlayerTatami,
          mochiFuda: [...ps.mochiFuda, cardId],
          score: ps.score + 1,
        };
      }

      // For other players, only update tatami
      return {
        ...ps,
        tatami: newPlayerTatami,
      };
    });

    // Update shared tatami
    const newSharedTatami = gameState.tatami.filter((id) => id !== cardId);
    const newStack = [...gameState.stack];

    // Add next card from stack to shared tatami
    if (newStack.length > 0) {
      const nextCard = newStack.shift();
      if (nextCard !== undefined) {
        newSharedTatami.push(nextCard);
      }
    }

    return {
      ...gameState,
      tatami: newSharedTatami,
      stack: newStack,
      playerStates: updatedPlayerStates,
    };
  }

  /**
   * Process an incorrect answer when a player selects the wrong card
   * - Decreases the player's score by 1 (minimum 0)
   * @param gameState - Current GameState
   * @param playerId - ID of the player who answered incorrectly
   * @returns New GameState with score updated
   */
  static processIncorrectAnswer(
    gameState: GameState,
    playerId: string,
  ): GameState {
    const updatedPlayerStates = gameState.playerStates.map((ps) => {
      if (ps.player.id !== playerId) return ps;

      return {
        ...ps,
        score: Math.max(0, ps.score - 1),
      };
    });

    return {
      ...gameState,
      playerStates: updatedPlayerStates,
    };
  }
}
