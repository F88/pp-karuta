import type { Deck, Stack, StackRecipe } from '@/models/karuta';

/**
 * StackManager - Centralized management for Stack operations
 * Handles Stack generation and manipulation
 */
export class StackManager {
  // ========================================
  // Section 1: Stack Generation
  // ========================================

  /**
   * Generate Stack from Deck using StackRecipe
   * @param deck - Source Deck
   * @param recipe - StackRecipe defining generation rules
   * @returns Stack (array of prototype IDs)
   * @throws {Error} If validation fails
   */
  static generate(deck: Deck, recipe: StackRecipe): Stack {
    // Validation: Deck
    if (deck.size === 0) {
      throw new Error('Deck must not be empty');
    }

    // Get all IDs from Deck
    const allIds = Array.from(deck.keys());

    // Sort based on sortMethod
    let ids: number[];
    switch (recipe.sortMethod) {
      case 'random':
        ids = this.shuffle(allIds);
        break;
      case 'id-asc':
        ids = [...allIds].sort((a, b) => a - b);
        break;
      case 'id-desc':
        ids = [...allIds].sort((a, b) => b - a);
        break;
      default:
        throw new Error(`Unknown sortMethod: ${recipe.sortMethod}`);
    }

    // Extract subset or use all
    if (recipe.maxSize === 'all') {
      return ids;
    }

    // Validation: maxSize
    if (typeof recipe.maxSize !== 'number' || recipe.maxSize <= 0) {
      throw new Error('maxSize must be positive number or "all"');
    }

    // Extract specified size (or all available if deck is smaller)
    const actualSize = Math.min(recipe.maxSize, ids.length);
    return ids.slice(0, actualSize);
  }

  // ========================================
  // Section 2: Stack Operations
  // ========================================

  /**
   * Shuffle Stack using Fisher-Yates algorithm
   * @param stack - Stack to shuffle
   * @returns Shuffled Stack (new array, does not mutate original)
   */
  static shuffle(stack: Stack): Stack {
    const result = [...stack];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Get Stack size
   * @param stack - Stack to measure
   * @returns Number of IDs in Stack
   */
  static getSize(stack: Stack): number {
    return stack.length;
  }

  /**
   * Check if Stack is empty
   * @param stack - Stack to check
   * @returns True if Stack has no IDs
   */
  static isEmpty(stack: Stack): boolean {
    return stack.length === 0;
  }

  /**
   * Pop first N IDs from Stack
   * @param stack - Source Stack
   * @param count - Number of IDs to pop
   * @returns Object with popped IDs and remaining Stack
   */
  static pop(
    stack: Stack,
    count: number,
  ): { popped: number[]; remaining: Stack } {
    if (count <= 0) {
      return { popped: [], remaining: stack };
    }

    const actualCount = Math.min(count, stack.length);
    return {
      popped: stack.slice(0, actualCount),
      remaining: stack.slice(actualCount),
    };
  }
}
