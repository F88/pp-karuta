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

// === Deck Management ===
export { DeckManager, DeckRecipeManager } from './deck';

// === Stack Management ===
export { StackManager, StackRecipeManager, STACK_RECIPES } from './stack';

// === Player Management ===
export { PlayerManager } from './player';

// === PlayMode Management ===
export { PlayModeManager } from './playMode';

// === Game Management ===
export { GameManager } from './game';

// Legacy exports for backward compatibility
export { createInitialState } from './game';
