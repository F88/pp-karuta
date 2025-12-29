import type { Player } from '@/models/karuta';
import { ConfigManager } from '@f88/promidas-utils/config';
import type { ConfigStorage } from '@f88/promidas-utils/config';

/**
 * PlayerManager - Centralized management for Player operations
 * Handles Player creation, validation, and persistence
 */
export class PlayerManager {
  private static readonly STORAGE_KEY = 'PP_KARUTA_PLAYERS';
  private static storage: ConfigStorage | null = null;

  /**
   * Get or create storage instance
   */
  private static getStorage(): ConfigStorage {
    if (!this.storage) {
      this.storage = ConfigManager.forLocalStorage(this.STORAGE_KEY);
    }
    return this.storage;
  }
  // ========================================
  // Section 1: Player Creation
  // ========================================

  /**
   * Create multiple players with default names
   * @param count - Number of players to create (1-4)
   * @returns Array of Player objects with default names
   * @throws {Error} If count is invalid
   */
  static createPlayers(count: number): Player[] {
    // Validation: count
    if (typeof count !== 'number' || count < 1 || count > 4) {
      throw new Error('Player count must be between 1 and 4');
    }

    return Array.from({ length: count }, (_, i) =>
      this.createPlayer(`player-${i + 1}`, `Player ${i + 1}`),
    );
  }

  /**
   * Create a single player
   * @param id - Player ID
   * @param name - Player name
   * @returns Player object
   */
  static createPlayer(id: string, name: string): Player {
    // Validation: id
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Player id must be a non-empty string');
    }

    // Validation: name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Player name must be a non-empty string');
    }

    return {
      id: id.trim(),
      name: name.trim(),
    };
  }

  // ========================================
  // Section 2: Player Validation
  // ========================================

  /**
   * Validate player array
   * @param players - Players array to validate
   * @throws {Error} If validation fails
   */
  static validatePlayers(players: unknown): asserts players is Player[] {
    if (!Array.isArray(players)) {
      throw new Error('Players must be an array');
    }

    if (players.length === 0) {
      throw new Error('Players array must not be empty');
    }

    if (players.length > 4) {
      throw new Error('Players array must not exceed 4 players');
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    for (const player of players) {
      if (!player || typeof player !== 'object') {
        throw new Error('Each player must be an object');
      }

      if (!player.id || typeof player.id !== 'string') {
        throw new Error('Each player must have a valid id');
      }

      if (ids.has(player.id)) {
        throw new Error(`Duplicate player id: ${player.id}`);
      }

      ids.add(player.id);
    }
  }

  // ========================================
  // Section 3: Player Persistence
  // ========================================

  /**
   * Save players to localStorage
   * @param players - Players array to save
   * @throws {Error} If validation fails or storage operation fails
   */
  static async savePlayers(players: Player[]): Promise<void> {
    this.validatePlayers(players);
    const storage = this.getStorage();
    await storage.save(JSON.stringify(players));
  }

  /**
   * Load players from localStorage
   * @returns Saved players array, or null if not found
   * @throws {Error} If stored data is invalid
   */
  static async loadPlayers(): Promise<Player[] | null> {
    const storage = this.getStorage();
    const data = await storage.get();

    if (!data) {
      return null;
    }

    try {
      const parsed = JSON.parse(data);
      this.validatePlayers(parsed);
      return parsed;
    } catch (error) {
      throw new Error(
        `Failed to load players from storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if players are saved in localStorage
   * @returns True if players exist in storage
   */
  static async hasPlayers(): Promise<boolean> {
    const storage = this.getStorage();
    return await storage.has();
  }

  /**
   * Remove players from localStorage
   */
  static async removePlayers(): Promise<void> {
    const storage = this.getStorage();
    await storage.remove();
  }

  /**
   * Initialize players
   * Loads from storage or creates default player if none exist
   * @returns Initialized players array
   */
  static async initialize(): Promise<Player[]> {
    const existingPlayers = await this.loadPlayers();

    if (existingPlayers && existingPlayers.length > 0) {
      return existingPlayers;
    }

    // Create default player
    const defaultPlayers = this.createPlayers(1);
    await this.savePlayers(defaultPlayers);
    return defaultPlayers;
  }
}
