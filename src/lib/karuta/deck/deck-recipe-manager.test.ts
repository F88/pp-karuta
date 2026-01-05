import { describe, it, expect } from 'vitest';
import { DeckRecipeManager } from './deck-recipe-manager';
import type { NormalizedPrototype } from '@f88/promidas/types';

describe('DeckRecipeManager', () => {
  describe('findById', () => {
    it('should find recipe by id', () => {
      const recipe = DeckRecipeManager.findById('all-prototypes');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('all-prototypes');
      expect(recipe?.title).toBe('全作品');
    });

    it('should find ETO recipe by id', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('eto-mi');
      expect(recipe?.title).toBe('🐍 巳');
      expect(recipe?.difficulty).toBe('intermediate');
      expect(recipe?.tags).toContain('干支');
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
      // 3 ETO + 1 all-prototypes + 7 range-based = 11
      expect(recipes.length).toBe(11);
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
      expect(recipes.length).toBe(8);
    });

    it('should filter intermediate recipes', () => {
      const recipes = DeckRecipeManager.filterByDifficulty('intermediate');
      expect(recipes.length).toBeGreaterThan(0);
      recipes.forEach((recipe) => {
        expect(recipe.difficulty).toBe('intermediate');
      });
      // 3 ETO recipes
      expect(recipes.length).toBe(3);
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
      // 3 ETO recipes
      expect(recipes.length).toBe(3);
    });

    it('should return empty array for non-existent tag', () => {
      const recipes = DeckRecipeManager.filterByTag('non-existent-tag');
      expect(recipes).toEqual([]);
    });
  });

  describe('Recipe structure validation', () => {
    it('should have valid ETO-MI recipe structure', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('eto-mi');
      expect(recipe?.title).toBe('🐍 巳');
      expect(recipe?.description).toBe('へびにちなんだ作品');
      expect(recipe?.apiParams).toEqual({ offset: 0, limit: 10000 });
      expect(recipe?.difficulty).toBe('intermediate');
      expect(recipe?.tags).toEqual(['干支']);
      expect(recipe?.filter).toBeDefined();
      expect(typeof recipe?.filter).toBe('function');
    });

    it('should have valid ETO-UMA recipe structure', () => {
      const recipe = DeckRecipeManager.findById('eto-uma');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('eto-uma');
      expect(recipe?.title).toBe('🐴 UMA');
      expect(recipe?.description).toBe('うまにちなんだ作品');
      expect(recipe?.filter).toBeDefined();
    });

    it('should have valid ETO-HITSUJI recipe structure', () => {
      const recipe = DeckRecipeManager.findById('eto-hitsuji');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('eto-hitsuji');
      expect(recipe?.title).toBe('🐏 未');
      expect(recipe?.description).toBe('ひつじにちなんだ作品');
      expect(recipe?.filter).toBeDefined();
    });

    it('should have valid all-prototypes recipe structure', () => {
      const recipe = DeckRecipeManager.findById('all-prototypes');
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe('all-prototypes');
      expect(recipe?.title).toBe('全作品');
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

  describe('Keyword filter functionality', () => {
    const mockPrototypes: NormalizedPrototype[] = [
      {
        id: 1,
        prototypeNm: 'Snake Game',
        users: ['User1'],
        summary: 'A game about snakes',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-01T00:00:00.000Z',
        mainUrl: 'https://example.com/1',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 2,
        prototypeNm: 'Horse Racing',
        users: ['User2'],
        summary: 'A racing game',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-02T00:00:00.000Z',
        mainUrl: 'https://example.com/2',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 3,
        prototypeNm: 'Cat Simulator',
        users: ['User3'],
        summary: 'A game about cats',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-03T00:00:00.000Z',
        mainUrl: 'https://example.com/3',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 4,
        prototypeNm: 'へびのゲーム',
        users: ['User4'],
        summary: '蛇について',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-04T00:00:00.000Z',
        mainUrl: 'https://example.com/4',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 5,
        prototypeNm: 'UMAゲーム',
        users: ['User5'],
        summary: '馬のゲーム',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-05T00:00:00.000Z',
        mainUrl: 'https://example.com/5',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
    ];

    it('should filter prototypes using ETO-MI filter', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe?.filter).toBeDefined();

      if (recipe?.filter) {
        const filtered = recipe.filter(mockPrototypes);
        expect(filtered.length).toBe(2);
        expect(filtered.map((p) => p.id)).toEqual([1, 4]);
      }
    });

    it('should filter prototypes using ETO-UMA filter', () => {
      const recipe = DeckRecipeManager.findById('eto-uma');
      expect(recipe?.filter).toBeDefined();

      if (recipe?.filter) {
        const filtered = recipe.filter(mockPrototypes);
        expect(filtered.length).toBe(2);
        expect(filtered.map((p) => p.id)).toEqual([2, 5]);
      }
    });

    it('should return empty array when no matches found', () => {
      const recipe = DeckRecipeManager.findById('eto-hitsuji');
      expect(recipe?.filter).toBeDefined();

      if (recipe?.filter) {
        const filtered = recipe.filter(mockPrototypes);
        expect(filtered).toEqual([]);
      }
    });

    it('should filter case-insensitively', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe?.filter).toBeDefined();

      const mixedCasePrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: 'SNAKE game',
        },
        {
          ...mockPrototypes[1],
          prototypeNm: 'snake GAME',
        },
      ];

      if (recipe?.filter) {
        const filtered = recipe.filter(mixedCasePrototypes);
        expect(filtered.length).toBe(2);
      }
    });

    it('should match keywords in summary field', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe?.filter).toBeDefined();

      const summaryMatchPrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: 'Random Game',
          summary: 'This game features snakes',
        },
      ];

      if (recipe?.filter) {
        const filtered = recipe.filter(summaryMatchPrototypes);
        expect(filtered.length).toBe(1);
      }
    });

    it('should handle emoji keywords', () => {
      const recipe = DeckRecipeManager.findById('eto-mi');
      expect(recipe?.filter).toBeDefined();

      const emojiPrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: '🐍 Snake Game',
        },
      ];

      if (recipe?.filter) {
        const filtered = recipe.filter(emojiPrototypes);
        expect(filtered.length).toBe(1);
      }
    });
  });
});
