import { RecipeManager } from './recipe-manager';

export { RecipeManager } from './recipe-manager';

// Legacy exports for backward compatibility (from RecipeManager)
export const DECK_RECIPES = RecipeManager.RECIPES;
export const findRecipeById = RecipeManager.findById;
