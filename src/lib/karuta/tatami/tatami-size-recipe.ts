/**
 * TatamiSizeRecipe - Defines available tatami size options
 */
export type TatamiSizeRecipe = {
  id: string;
  name: string;
  size: number;
};

export const TATAMI_SIZE_RECIPES: TatamiSizeRecipe[] = [
  { id: 'tatami-4', name: '4 Cards', size: 4 },
  { id: 'tatami-8', name: '8 Cards', size: 8 },
  { id: 'tatami-12', name: '12 Cards', size: 12 },
  { id: 'tatami-16', name: '16 Cards', size: 16 },
  { id: 'tatami-20', name: '20 Cards', size: 20 },
];

export class TatamiSizeManager {
  static readonly RECIPES = TATAMI_SIZE_RECIPES;

  static findById(id: string): TatamiSizeRecipe | undefined {
    return this.RECIPES.find((recipe) => recipe.id === id);
  }

  static getDefault(): TatamiSizeRecipe {
    return this.RECIPES[1]; // 8 Cards
  }
}
