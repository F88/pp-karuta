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
   *
   * The card order is determined by StackRecipe.sortMethod and preserved throughout initialization:
   * 1. Generates Stack from Deck using StackRecipe (order determined by sortMethod: random/id-asc/id-desc)
   * 2. Extracts first N cards from Stack for Tatami (preserving Stack order)
   * 3. Initializes GamePlayerState for each Player
   *
   * @param deck - Deck (Map of ID -> NormalizedPrototype)
   * @param players - Player array (1-4 players)
   * @param playMode - PlayMode (keyboard or touch)
   * @param stackRecipe - StackRecipe defining Stack generation rules (including sort order)
   * @param initialTatamiSize - Initial Tatami size (default: 5)
   * @returns Complete initial GameState with cards ordered according to StackRecipe
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
    // IMPORTANT: DO NOT shuffle or modify the order here!
    // The stack order is determined by StackRecipe.sortMethod (random/id-asc/id-desc).
    // Any additional shuffling would violate the intended sort order.
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
    };
  }

  // ========================================
  // Section 2: Game Logic Operations
  // ========================================

  /**
   * Check if the game is over
   * Game ends when there are no more cards in tatami to read
   * @param gameState - Current GameState
   * @returns True if game is over
   */
  static isGameOver(gameState: GameState): boolean {
    return gameState.tatami.length === 0;
  }

  /**
   * Pick a YomiFuda (reading card) from tatami
   *
   * Selection behavior depends on VITE_RANDOM_YOMIFUDA environment variable:
   * - false (default): Returns first card (tatami[0]) - sequential order as determined by StackRecipe
   * - true: Returns randomly selected card from tatami - adds unpredictability to the game
   *
   * @param tatami - Array of card IDs in tatami
   * @returns Picked card ID, or null if tatami is empty
   */
  static pickYomiFuda(tatami: number[]): number | null {
    if (tatami.length === 0) {
      return null;
    }

    // Check if random selection is enabled
    if (import.meta.env.VITE_RANDOM_YOMIFUDA === 'true') {
      // Randomly select a card from tatami
      const randomIndex = Math.floor(Math.random() * tatami.length);
      return tatami[randomIndex];
    }

    // Default: Pick first card (sequential order as determined by StackRecipe)
    return tatami[0];
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
