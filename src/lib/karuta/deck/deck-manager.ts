/**
 * @fileoverview Centralized manager for Deck operations in the Karuta game.
 * Provides static methods for deck creation, prototype retrieval, metadata generation,
 * and repository snapshot management. Handles deck lifecycle from recipe to game-ready state.
 */

import { logger } from '@/lib/logger';
import type {
  Deck,
  DeckIdentifier,
  DeckIdsHash,
  DeckMetaData,
  DeckRecipe,
} from '@/models/karuta';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import type { SnapshotOperationResult } from '@f88/promidas/repository';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Centralized manager for all Deck-related operations.
 *
 * Provides utilities for:
 * - Creating decks from prototypes or recipes
 * - Managing repository snapshots
 * - Accessing deck contents and metadata
 * - Generating cryptographic hashes for deck identification
 *
 * All methods are static as this class serves as a utility namespace.
 */
export class DeckManager {
  // ==================== Generation ====================

  /**
   * Sets up repository snapshot from DeckRecipe without fetching data.
   *
   * Prepares the repository snapshot using the recipe's API parameters
   * but does not retrieve the actual prototype data. This is useful for
   * staged loading or when you want to verify API parameters before fetching.
   *
   * @param recipe - DeckRecipe containing apiParams for repository query
   * @param repository - ProtopediaInMemoryRepository instance for snapshot setup
   * @returns SnapshotOperationResult indicating success/failure with stats or error details
   * @throws {Error} If recipe is invalid or missing apiParams
   * @private
   */
  private static async setupSnapshotFromRecipe(
    recipe: DeckRecipe,
    repository: ProtopediaInMemoryRepository,
  ): Promise<SnapshotOperationResult> {
    // Validation: Recipe
    if (!recipe || !recipe.apiParams) {
      throw new Error(`Invalid recipe: apiParams is required`);
    }

    logger.debug(`[INFO] API Params:`, recipe.apiParams);

    // Setup snapshot only (no getAllFromSnapshot)
    return await repository.setupSnapshot(recipe.apiParams);
  }

  /**
   * Creates a Deck from an array of NormalizedPrototype objects.
   *
   * Ensures unique prototype IDs by using Map structure and validates input
   * integrity. Throws errors if duplicates are detected or validation fails.
   *
   * @param prototypes - Array of normalized prototypes to create deck from
   * @returns Generated deck as a Map of prototype ID to NormalizedPrototype
   * @throws {Error} If input is not an array
   * @throws {Error} If any prototype has missing or invalid ID
   * @throws {Error} If duplicate prototype IDs are detected
   * @private
   */
  private static createDeck(prototypes: NormalizedPrototype[]): Deck {
    // Validation: Input must be array
    if (!Array.isArray(prototypes)) {
      throw new Error(`Invalid input: prototypes must be an array`);
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
   * Creates a Deck from prototypes array with optional filtering.
   *
   * Converts readonly array from repository to mutable array and applies
   * optional filter function before deck creation. Useful when working with
   * repository snapshots that return readonly arrays.
   *
   * @param prototypes - Source prototypes (typically readonly array from repository)
   * @param filter - Optional filter function to apply before creating deck
   * @returns Generated deck as a Map of prototype ID to NormalizedPrototype
   * @throws {Error} If validation fails during deck creation
   */
  static createDeckWithFilter(
    prototypes: readonly NormalizedPrototype[],
    filter?: (prototypes: NormalizedPrototype[]) => NormalizedPrototype[],
  ): Deck {
    // Convert readonly array to mutable array first
    const mutablePrototypes = [...prototypes];

    // Apply filter if provided
    if (filter != null) {
      logger.debug(
        '[DEBUG] createDeckWithFilter - Applying filter to prototypes before deck creation',
      );
      const filtered = filter(mutablePrototypes);
      logger.debug(
        '[DEBUG] createDeckWithFilter - Prototypes count after filtering:',
        {
          before: mutablePrototypes.length,
          after: filtered.length,
        },
      );
      return this.createDeck(filtered);
    }
    return this.createDeck(mutablePrototypes);
  }

  /**
   * Fetches prototypes from DeckRecipe by querying the repository.
   *
   * Sets up repository snapshot and retrieves all matching prototypes
   * without applying any filters. The returned prototypes are unfiltered
   * and ready for further processing.
   *
   * @param recipe - DeckRecipe containing apiParams for repository query
   * @param repository - ProtopediaInMemoryRepository instance for data fetching
   * @returns Readonly array of NormalizedPrototypes (unfiltered)
   * @throws {Error} If recipe validation fails
   * @throws {Error} If repository API call fails
   */
  static async getPrototypesFromRecipe(
    recipe: DeckRecipe,
    repository: ProtopediaInMemoryRepository,
  ): Promise<readonly NormalizedPrototype[]> {
    // Setup snapshot using the dedicated method
    const result = await this.setupSnapshotFromRecipe(recipe, repository);

    if (!result.ok) {
      throw new Error(
        `Failed to fetch prototypes from repository: ${result.message}`,
      );
    }

    // Get all prototypes from snapshot
    const allPrototypes = await repository.getAllFromSnapshot();

    logger.info(`Retrieved ${allPrototypes.length} prototypes from snapshot`);

    return allPrototypes;
  }

  // ==================== Access ====================

  /**
   * Retrieves all prototype IDs from a deck in sorted order.
   *
   * @param deck - The deck to extract IDs from
   * @returns Array of prototype IDs sorted in ascending numerical order
   */
  static getIds(deck: Deck): number[] {
    return [...deck.keys()].sort((a, b) => a - b);
  }

  /**
   * Retrieves all prototypes from a deck as an array.
   *
   * @param deck - The deck to extract prototypes from
   * @returns Array of NormalizedPrototype objects (order not guaranteed)
   */
  static getPrototypes(deck: Deck): NormalizedPrototype[] {
    return [...deck.values()];
  }

  /**
   * Retrieves a single NormalizedPrototype from deck by ID.
   *
   * @param deck - The deck to search
   * @param id - The prototype ID to look up
   * @returns The matching NormalizedPrototype, or undefined if not found
   */
  static getById(deck: Deck, id: number): NormalizedPrototype | undefined {
    return deck.get(id);
  }

  /**
   * Retrieves multiple NormalizedPrototypes from deck by IDs.
   *
   * Filters out any IDs that are not found in the deck, returning
   * only the successfully located prototypes.
   *
   * @param deck - The deck to search
   * @param ids - Array of prototype IDs to look up
   * @returns Array of NormalizedPrototypes (excludes not found IDs)
   */
  static getByIds(deck: Deck, ids: number[]): NormalizedPrototype[] {
    return ids
      .map((id) => deck.get(id))
      .filter((p): p is NormalizedPrototype => p !== undefined);
  }

  /**
   * Returns the total number of prototypes in the deck.
   *
   * @param deck - The deck to measure
   * @returns The number of prototypes in the deck
   */
  static getSize(deck: Deck): number {
    return deck.size;
  }

  /**
   * Checks whether a deck contains a prototype with the given ID.
   *
   * @param deck - The deck to search
   * @param id - The prototype ID to check for
   * @returns true if the deck contains the ID, false otherwise
   */
  static has(deck: Deck, id: number): boolean {
    return deck.has(id);
  }

  // ==================== Metadata ====================

  /**
   * Generates a SHA-256 hash from a string.
   *
   * Uses the Web Crypto API to create a cryptographically secure hash.
   * Returns the hash as a lowercase hexadecimal string.
   *
   * @param message - The input string to hash
   * @returns Promise resolving to the SHA-256 hash as a hex string
   * @private
   */
  private static async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  /**
   * Creates a DeckIdsHash from prototype IDs.
   *
   * Generates a reproducible hash based solely on the prototype IDs.
   * Same set of IDs will always produce the same hash (order-independent
   * due to sorting). Useful for detecting identical deck compositions.
   *
   * @param prototypeIds - Array of prototype IDs to hash
   * @returns Promise resolving to the DeckIdsHash string
   */
  static async createIdsHash(prototypeIds: number[]): Promise<DeckIdsHash> {
    const sortedIds = [...prototypeIds].sort((a, b) => a - b);
    const source = sortedIds.join(',');
    return await this.sha256(source);
  }

  /**
   * Creates a DeckIdentifier from deck and fetch timestamp.
   *
   * Generates a unique identifier that includes both the prototype IDs
   * and the fetch timestamp, making it specific to this exact deck instance.
   *
   * @param deck - The deck to create an identifier for
   * @param fetchedAt - Unix timestamp (milliseconds) when the deck was fetched
   * @returns Promise resolving to the DeckIdentifier object
   */
  static async createIdentifier(
    deck: Deck,
    fetchedAt: number,
  ): Promise<DeckIdentifier> {
    const prototypeIds = this.getIds(deck);
    const source = `${fetchedAt}:${prototypeIds.join(',')}`;
    const deckHash = await this.sha256(source);
    return { deckHash };
  }

  /**
   * Creates comprehensive DeckMetaData from deck, timestamp, and title.
   *
   * Generates complete metadata including:
   * - deckHash: Unique hash combining timestamp and IDs
   * - deckIdsHash: Reproducible hash of just the IDs
   * - Prototype IDs in sorted order
   * - Fetch timestamp and title
   *
   * @param deck - The deck to create metadata for
   * @param fetchedAt - Unix timestamp (milliseconds) when the deck was fetched
   * @param title - Human-readable title for the deck
   * @returns Promise resolving to the complete DeckMetaData object
   */
  static async createMetaData(
    deck: Deck,
    fetchedAt: number,
    title: string,
  ): Promise<DeckMetaData> {
    const prototypeIds = this.getIds(deck);

    // Generate both hashes
    const deckHash = await this.sha256(
      `${fetchedAt}:${prototypeIds.join(',')}`,
    );
    const deckIdsHash = await this.sha256(prototypeIds.join(','));

    return {
      deckHash,
      deckIdsHash,
      title,
      fetchedAt,
      prototypeIds,
    };
  }
}
