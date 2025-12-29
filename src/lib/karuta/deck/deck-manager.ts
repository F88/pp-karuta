import type {
  Deck,
  DeckRecipe,
  DeckIdentifier,
  DeckMetaData,
  DeckIdsHash,
} from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';

/**
 * DeckManager - Centralized Deck operations
 */
export class DeckManager {
  // ==================== Generation ====================

  /**
   * Create a Deck from array of NormalizedPrototype
   * Ensures unique IDs by using Map structure
   * @throws {Error} If validation fails or duplicates found
   */
  static create(prototypes: NormalizedPrototype[]): Deck {
    // Validation: Input must be array
    if (!Array.isArray(prototypes)) {
      throw new Error(`Invalid input: prototypes must be an array`);
    }

    // Validation: Empty array check
    if (prototypes.length === 0) {
      throw new Error(`Invalid input: prototypes array cannot be empty`);
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
   * Generate a Deck from DeckRecipe
   * Fetches data from repository using recipe's apiParams
   * @param recipe - DeckRecipe to generate Deck from
   * @param repository - ProtopediaInMemoryRepository for data fetching
   * @returns Generated Deck (Map of ID -> NormalizedPrototype)
   * @throws {Error} If validation fails or data fetch fails
   */
  static async generateFromRecipe(
    recipe: DeckRecipe,
    repository: ProtopediaInMemoryRepository,
  ): Promise<Deck> {
    // Validation: Recipe
    if (!recipe || !recipe.apiParams) {
      throw new Error(`Invalid recipe: apiParams is required`);
    }

    // Fetch data using recipe's apiParams
    const result = await repository.setupSnapshot(recipe.apiParams);

    if (!result.ok) {
      throw new Error(
        `Failed to fetch prototypes from repository: ${result.message}`,
      );
    }

    // Get all prototypes from snapshot
    const allPrototypes: NormalizedPrototype[] = [];
    const seenIds = new Set<number>();

    // Fetch all available prototypes from snapshot
    // Use a reasonable limit to avoid infinite loops
    const maxAttempts = 10_000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts += 1;
      const prototype = await repository.getRandomPrototypeFromSnapshot();

      if (!prototype) {
        // No more prototypes available
        break;
      }

      if (!seenIds.has(prototype.id)) {
        allPrototypes.push(prototype);
        seenIds.add(prototype.id);
      }

      // If we haven't found new prototypes in the last 100 attempts, stop
      if (attempts > allPrototypes.length + 100) {
        break;
      }
    }

    if (allPrototypes.length === 0) {
      throw new Error('No prototypes fetched from repository');
    }

    // Apply ID filter if specified in recipe
    const filteredPrototypes = allPrototypes;

    // Validation: All prototypes have valid IDs
    const invalidPrototype = filteredPrototypes.find(
      (p) => !p || typeof p.id !== 'number',
    );
    if (invalidPrototype) {
      throw new Error(`Invalid prototype found: missing or invalid ID`);
    }

    // Use create method for consistency
    return this.create(filteredPrototypes);
  }

  /**
   * Recreate Deck from prototype IDs and full prototype list
   * Used for regenerating decks from DeckMetaData
   * @throws {Error} If validation fails or prototypes not found
   */
  static recreate(
    prototypeIds: number[],
    allPrototypes: NormalizedPrototype[],
  ): Deck {
    // Validation: Inputs must be arrays
    if (!Array.isArray(prototypeIds) || !Array.isArray(allPrototypes)) {
      throw new Error(`Invalid input: both arguments must be arrays`);
    }

    // Validation: IDs array cannot be empty
    if (prototypeIds.length === 0) {
      throw new Error(`Invalid input: prototypeIds array cannot be empty`);
    }

    const prototypeMap = new Map(allPrototypes.map((p) => [p.id, p] as const));

    const deckMap = new Map<number, NormalizedPrototype>();
    const notFoundIds: number[] = [];

    for (const id of prototypeIds) {
      const prototype = prototypeMap.get(id);
      if (prototype) {
        deckMap.set(id, prototype);
      } else {
        notFoundIds.push(id);
      }
    }

    // Validation: All IDs must be found
    if (notFoundIds.length > 0) {
      throw new Error(
        `Prototypes not found for IDs: ${notFoundIds.join(', ')}`,
      );
    }

    return deckMap;
  }

  // ==================== Access ====================

  /**
   * Get all prototype IDs from deck (sorted)
   */
  static getIds(deck: Deck): number[] {
    return [...deck.keys()].sort((a, b) => a - b);
  }

  /**
   * Get all prototypes from deck as array
   */
  static getPrototypes(deck: Deck): NormalizedPrototype[] {
    return [...deck.values()];
  }

  /**
   * Get NormalizedPrototype from deck by ID
   */
  static getById(deck: Deck, id: number): NormalizedPrototype | undefined {
    return deck.get(id);
  }

  /**
   * Get multiple NormalizedPrototypes from deck by IDs
   * @returns Array of NormalizedPrototypes (filters out not found)
   */
  static getByIds(deck: Deck, ids: number[]): NormalizedPrototype[] {
    return ids
      .map((id) => deck.get(id))
      .filter((p): p is NormalizedPrototype => p !== undefined);
  }

  /**
   * Get deck size
   */
  static getSize(deck: Deck): number {
    return deck.size;
  }

  /**
   * Check if deck contains a prototype by ID
   */
  static has(deck: Deck, id: number): boolean {
    return deck.has(id);
  }

  // ==================== Metadata ====================

  /**
   * Generate SHA-256 hash from string
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
   * Create DeckIdsHash from prototype IDs
   * Same IDs = Same hash (reproducible)
   */
  static async createIdsHash(prototypeIds: number[]): Promise<DeckIdsHash> {
    const sortedIds = [...prototypeIds].sort((a, b) => a - b);
    const source = sortedIds.join(',');
    return await this.sha256(source);
  }

  /**
   * Create DeckIdentifier from deck and fetch timestamp
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
   * Create DeckMetaData from deck, fetch timestamp, and title
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
