// Export types
export type {
  DeckRecipe,
  StackRecipe,
  Player,
  GameState,
  GamePlayerState,
} from '@/models/karuta';

export type { PlayMode } from './playMode';
export type { TatamiSize } from './tatami/tatami-size';
export { TATAMI_SIZES, DEFAULT_TATAMI_SIZE } from './tatami/tatami-size';
export type { TatamiSizeRecipe } from './tatami';

// Export data generation
export { generateDummyPrototypes } from '@/lib/repository/dummy-data';

// === Deck Management ===
export { DeckManager, DeckRecipeManager } from './deck';

// === Stack Management ===
export { StackManager, StackRecipeManager, STACK_RECIPES } from './stack';

// === Tatami Management ===
export { TatamiSizeManager, TATAMI_SIZE_RECIPES } from './tatami';

// === Player Management ===
export { PlayerManager } from './player';

// === PlayMode Management ===
export { PlayModeManager } from './playMode';

// === Game Management ===
export { GameManager } from './game';

// Legacy exports for backward compatibility
export { createInitialState } from './game';
