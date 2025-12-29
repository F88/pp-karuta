import { GameManager } from './game-manager';

export { GameManager } from './game-manager';

// Legacy exports for backward compatibility
// Note: createInitialState signature changed to require playMode parameter
export const createInitialState = GameManager.createInitialState;
