import { describe, it, expect } from 'vitest';
import { DeckRecipeManager } from './deck-recipe-manager';

describe('DeckRecipeManager', () => {
  describe('findById', () => {
    it('should find recipe by id', () => {
      const recipe = DeckRecipeManager.findById('all-prototypes');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('all-prototypes');
      expect(recipe?.title).toBe('🌐 全作品');
    });

    it('should find range-based recipe by id', () => {
      const recipe = DeckRecipeManager.findById('Deck-rande-1');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('Deck-rande-1');
      expect(recipe?.title).toBe('Deck-1');
      expect(recipe?.apiParams?.offset).toBe(0);
      expect(recipe?.apiParams?.limit).toBe(1000);
    });

    it('should return undefined for non-existent id', () => {
      const recipe = DeckRecipeManager.findById('non-existent');
      expect(recipe).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all recipes', () => {
      const recipes = DeckRecipeManager.getAll();
      expect(recipes.length).toBeGreaterThan(0);
      // 12 ETO + 14 releaseYears + 1 all-prototypes + 7 range-based = 34
      // In DEV mode, +1 PROMIDAS = 35
      const expectedCount = import.meta.env.DEV ? 35 : 34;
      expect(recipes.length).toBe(expectedCount);
    });

    it('should return a new array instance', () => {
      const recipes1 = DeckRecipeManager.getAll();
      const recipes2 = DeckRecipeManager.getAll();
      expect(recipes1).not.toBe(recipes2);
      expect(recipes1).toEqual(recipes2);
    });
  });

  describe('filterByDifficulty', () => {
    it('should filter beginner recipes', () => {
      const recipes = DeckRecipeManager.filterByDifficulty('beginner');
      expect(recipes.length).toBeGreaterThan(0);
      recipes.forEach((recipe) => {
        expect(recipe.difficulty).toBe('beginner');
      });
      // 1 all-prototypes + 7 range-based = 8
      // In DEV mode, +1 PROMIDAS = 9
      const expectedCount = import.meta.env.DEV ? 9 : 8;
      expect(recipes.length).toBe(expectedCount);
    });

    it('should filter intermediate recipes', () => {
      const recipes = DeckRecipeManager.filterByDifficulty('intermediate');
      expect(recipes.length).toBeGreaterThan(0);
      recipes.forEach((recipe) => {
        expect(recipe.difficulty).toBe('intermediate');
      });
      // 12 ETO recipes + 14 releaseYears = 26
      expect(recipes.length).toBe(26);
    });

    it('should return empty array for advanced difficulty', () => {
      const recipes = DeckRecipeManager.filterByDifficulty('advanced');
      expect(recipes).toEqual([]);
    });
  });

  describe('filterByTag', () => {
    it('should filter recipes by tag', () => {
      const recipes = DeckRecipeManager.filterByTag('干支');
      expect(recipes.length).toBeGreaterThan(0);
      recipes.forEach((recipe) => {
        expect(recipe.tags).toContain('干支');
      });
      // 12 ETO recipes
      expect(recipes.length).toBe(12);
    });

    it('should return empty array for non-existent tag', () => {
      const recipes = DeckRecipeManager.filterByTag('non-existent-tag');
      expect(recipes).toEqual([]);
    });
  });

  describe('Recipe structure validation', () => {
    it('should have valid all-prototypes recipe structure', () => {
      const recipe = DeckRecipeManager.findById('all-prototypes');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('all-prototypes');
      expect(recipe?.title).toBe('🌐 全作品');
      expect(recipe?.description).toBe('全ての作品');
      expect(recipe?.apiParams).toEqual({ offset: 0, limit: 10000 });
      expect(recipe?.difficulty).toBe('beginner');
      expect(recipe?.tags).toEqual([]);
      expect(recipe?.filter).toBeUndefined();
    });

    it('should have valid range-based recipe structures', () => {
      for (let i = 1; i <= 7; i++) {
        const recipe = DeckRecipeManager.findById(`Deck-rande-${i}`);
        expect(recipe).toBeDefined();
        expect(recipe?.id).toBe(`Deck-rande-${i}`);
        expect(recipe?.title).toBe(`Deck-${i}`);
        expect(recipe?.apiParams?.offset).toBe((i - 1) * 1000);
        expect(recipe?.apiParams?.limit).toBe(1000);
        expect(recipe?.difficulty).toBe('beginner');
        expect(recipe?.tags).toEqual([]);
      }
    });
  });
});
