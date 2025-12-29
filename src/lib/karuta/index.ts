// Export types
export type {
  DeckRecipe,
  StackRecipe,
  Player,
  GameState,
  GamePlayerState,
} from '@/models/karuta';

export type { PlayMode } from './playMode';

// Export data generation
export { generateDummyPrototypes } from '@/lib/repository/dummy-data';
export { fetchPrototypesFromAPI } from '@/lib/repository/api-data';

// === Recipe Management ===
export { RecipeManager } from './recipe';

// Legacy exports for backward compatibility
export { DECK_RECIPES, findRecipeById } from './recipe';

// === Deck Management ===
export { DeckManager } from './deck';

// Legacy function exports for backward compatibility
import { DeckManager } from './deck';

/**
 * @deprecated Use DeckManager.getByIds() instead
 */
export function getPrototypesByIds(
  deck: Map<number, import('@f88/promidas/types').NormalizedPrototype>,
  ids: number[],
): import('@f88/promidas/types').NormalizedPrototype[] {
  return DeckManager.getByIds(deck, ids);
}

// === Stack Management ===
export { StackManager, STACK_RECIPES, findStackRecipeById } from './stack';

// Legacy exports for backward compatibility
export { shuffle } from './stack';

// === Player Management ===
export { PlayerManager } from './player';

// === PlayMode Management ===
export { PlayModeManager } from './playMode';

// === Game Management ===
export { GameManager } from './game';

// Legacy exports for backward compatibility
export { createInitialState } from './game';
