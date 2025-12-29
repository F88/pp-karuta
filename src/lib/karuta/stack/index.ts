import { StackRecipeManager } from './stack-recipe-manager';

export { StackManager } from './stack-manager';
export { StackRecipeManager } from './stack-recipe-manager';

// Legacy exports for backward compatibility
export const STACK_RECIPES = StackRecipeManager.RECIPES;
export const findStackRecipeById = StackRecipeManager.findById;
