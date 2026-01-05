/**
 * @fileoverview Tests for ETO (Chinese zodiac) themed deck recipes
 */

import { describe, expect, it } from 'vitest';

import type { NormalizedPrototype } from '@f88/promidas/types';

import {
  DECK_ETO_I,
  DECK_ETO_INU,
  DECK_ETO_MI,
  DECK_ETO_NE,
  DECK_ETO_SARU,
  DECK_ETO_TATSU,
  DECK_ETO_TORA,
  DECK_ETO_TORI,
  DECK_ETO_U,
  DECK_ETO_UMA,
  DECK_ETO_USHI,
  DECK_ETO_HITSUJI,
  ETO_RECIPES,
} from './deck-recipe-eto';

describe('ETO Deck Recipes', () => {
  describe('Recipe structure validation', () => {
    it('should have valid DECK_ETO_NE (Rat) structure', () => {
      expect(DECK_ETO_NE.id).toBe('eto-ne');
      expect(DECK_ETO_NE.title).toBe('🐁 子');
      expect(DECK_ETO_NE.description).toBe('ねずみにちなんだ作品');
      expect(DECK_ETO_NE.difficulty).toBe('intermediate');
      expect(DECK_ETO_NE.tags).toContain('干支');
      expect(DECK_ETO_NE.filter).toBeDefined();
      expect(typeof DECK_ETO_NE.filter).toBe('function');
    });

    it('should have valid DECK_ETO_USHI (Ox) structure', () => {
      expect(DECK_ETO_USHI.id).toBe('eto-ushi');
      expect(DECK_ETO_USHI.title).toBe('🐄 丑');
      expect(DECK_ETO_USHI.description).toBe('うしにちなんだ作品');
      expect(DECK_ETO_USHI.difficulty).toBe('intermediate');
      expect(DECK_ETO_USHI.tags).toContain('干支');
      expect(DECK_ETO_USHI.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_TORA (Tiger) structure', () => {
      expect(DECK_ETO_TORA.id).toBe('eto-tora');
      expect(DECK_ETO_TORA.title).toBe('🐅 寅');
      expect(DECK_ETO_TORA.description).toBe('とらにちなんだ作品');
      expect(DECK_ETO_TORA.difficulty).toBe('intermediate');
      expect(DECK_ETO_TORA.tags).toContain('干支');
      expect(DECK_ETO_TORA.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_U (Rabbit) structure', () => {
      expect(DECK_ETO_U.id).toBe('eto-u');
      expect(DECK_ETO_U.title).toBe('🐇 卯');
      expect(DECK_ETO_U.description).toBe('うさぎにちなんだ作品');
      expect(DECK_ETO_U.difficulty).toBe('intermediate');
      expect(DECK_ETO_U.tags).toContain('干支');
      expect(DECK_ETO_U.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_TATSU (Dragon) structure', () => {
      expect(DECK_ETO_TATSU.id).toBe('eto-tatsu');
      expect(DECK_ETO_TATSU.title).toBe('🐉 辰');
      expect(DECK_ETO_TATSU.description).toBe('りゅうにちなんだ作品');
      expect(DECK_ETO_TATSU.difficulty).toBe('intermediate');
      expect(DECK_ETO_TATSU.tags).toContain('干支');
      expect(DECK_ETO_TATSU.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_MI (Snake) structure', () => {
      expect(DECK_ETO_MI.id).toBe('eto-mi');
      expect(DECK_ETO_MI.title).toBe('🐍 巳');
      expect(DECK_ETO_MI.description).toBe('へびにちなんだ作品');
      expect(DECK_ETO_MI.difficulty).toBe('intermediate');
      expect(DECK_ETO_MI.tags).toContain('干支');
      expect(DECK_ETO_MI.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_UMA (Horse) structure', () => {
      expect(DECK_ETO_UMA.id).toBe('eto-uma');
      expect(DECK_ETO_UMA.title).toBe('🐴 午');
      expect(DECK_ETO_UMA.description).toBe('うまにちなんだ作品');
      expect(DECK_ETO_UMA.difficulty).toBe('intermediate');
      expect(DECK_ETO_UMA.tags).toContain('干支');
      expect(DECK_ETO_UMA.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_HITSUJI (Sheep) structure', () => {
      expect(DECK_ETO_HITSUJI.id).toBe('eto-hitsuji');
      expect(DECK_ETO_HITSUJI.title).toBe('🐏 未');
      expect(DECK_ETO_HITSUJI.description).toBe('ひつじにちなんだ作品');
      expect(DECK_ETO_HITSUJI.difficulty).toBe('intermediate');
      expect(DECK_ETO_HITSUJI.tags).toContain('干支');
      expect(DECK_ETO_HITSUJI.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_SARU (Monkey) structure', () => {
      expect(DECK_ETO_SARU.id).toBe('eto-saru');
      expect(DECK_ETO_SARU.title).toBe('🐒 申');
      expect(DECK_ETO_SARU.description).toBe('さるにちなんだ作品');
      expect(DECK_ETO_SARU.difficulty).toBe('intermediate');
      expect(DECK_ETO_SARU.tags).toContain('干支');
      expect(DECK_ETO_SARU.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_TORI (Rooster) structure', () => {
      expect(DECK_ETO_TORI.id).toBe('eto-tori');
      expect(DECK_ETO_TORI.title).toBe('🐓 酉');
      expect(DECK_ETO_TORI.description).toBe('とりにちなんだ作品');
      expect(DECK_ETO_TORI.difficulty).toBe('intermediate');
      expect(DECK_ETO_TORI.tags).toContain('干支');
      expect(DECK_ETO_TORI.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_INU (Dog) structure', () => {
      expect(DECK_ETO_INU.id).toBe('eto-inu');
      expect(DECK_ETO_INU.title).toBe('🐕 戌');
      expect(DECK_ETO_INU.description).toBe('いぬにちなんだ作品');
      expect(DECK_ETO_INU.difficulty).toBe('intermediate');
      expect(DECK_ETO_INU.tags).toContain('干支');
      expect(DECK_ETO_INU.filter).toBeDefined();
    });

    it('should have valid DECK_ETO_I (Boar) structure', () => {
      expect(DECK_ETO_I.id).toBe('eto-i');
      expect(DECK_ETO_I.title).toBe('🐗 亥');
      expect(DECK_ETO_I.description).toBe('いのししにちなんだ作品');
      expect(DECK_ETO_I.difficulty).toBe('intermediate');
      expect(DECK_ETO_I.tags).toContain('干支');
      expect(DECK_ETO_I.filter).toBeDefined();
    });
  });

  describe('ETO_RECIPES array', () => {
    it('should contain all 12 zodiac recipes', () => {
      expect(ETO_RECIPES).toHaveLength(12);
    });

    it('should contain all zodiac recipes in correct order', () => {
      expect(ETO_RECIPES[0]).toBe(DECK_ETO_NE);
      expect(ETO_RECIPES[1]).toBe(DECK_ETO_USHI);
      expect(ETO_RECIPES[2]).toBe(DECK_ETO_TORA);
      expect(ETO_RECIPES[3]).toBe(DECK_ETO_U);
      expect(ETO_RECIPES[4]).toBe(DECK_ETO_TATSU);
      expect(ETO_RECIPES[5]).toBe(DECK_ETO_MI);
      expect(ETO_RECIPES[6]).toBe(DECK_ETO_UMA);
      expect(ETO_RECIPES[7]).toBe(DECK_ETO_HITSUJI);
      expect(ETO_RECIPES[8]).toBe(DECK_ETO_SARU);
      expect(ETO_RECIPES[9]).toBe(DECK_ETO_TORI);
      expect(ETO_RECIPES[10]).toBe(DECK_ETO_INU);
      expect(ETO_RECIPES[11]).toBe(DECK_ETO_I);
    });

    it('should have all recipes with intermediate difficulty', () => {
      ETO_RECIPES.forEach((recipe) => {
        expect(recipe.difficulty).toBe('intermediate');
      });
    });

    it('should have all recipes tagged with 干支', () => {
      ETO_RECIPES.forEach((recipe) => {
        expect(recipe.tags).toContain('干支');
      });
    });

    it('should have unique IDs for all recipes', () => {
      const ids = ETO_RECIPES.map((recipe) => recipe.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(12);
    });
  });

  describe('Filter functionality', () => {
    const mockPrototypes: NormalizedPrototype[] = [
      {
        id: 1,
        prototypeNm: 'Mouse Puzzle Game',
        users: ['User1'],
        summary: 'A puzzle game featuring mice',
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
        prototypeNm: 'Tiger Adventure',
        users: ['User2'],
        summary: 'An adventure with tigers',
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
        prototypeNm: 'Dragon Quest',
        users: ['User3'],
        summary: 'Battle with dragons',
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
        prototypeNm: 'へびパズル',
        users: ['User4'],
        summary: 'へびのゲーム',
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
        summary: 'うまを育てる',
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
      {
        id: 6,
        prototypeNm: 'Random Game',
        users: ['User6'],
        summary: 'Nothing special',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-06T00:00:00.000Z',
        mainUrl: 'https://example.com/6',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
    ];

    it('should filter prototypes using DECK_ETO_NE filter', () => {
      const filtered = DECK_ETO_NE.filter!(mockPrototypes);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some((p) => p.id === 1)).toBe(true);
    });

    it('should filter prototypes using DECK_ETO_TORA filter', () => {
      const filtered = DECK_ETO_TORA.filter!(mockPrototypes);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some((p) => p.id === 2)).toBe(true); // Tiger
    });

    it('should filter prototypes using DECK_ETO_TATSU filter', () => {
      const filtered = DECK_ETO_TATSU.filter!(mockPrototypes);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some((p) => p.id === 3)).toBe(true); // Dragon
    });

    it('should filter prototypes using DECK_ETO_MI filter', () => {
      const filtered = DECK_ETO_MI.filter!(mockPrototypes);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some((p) => p.id === 4)).toBe(true); // Snake
    });

    it('should return empty array when no matches found', () => {
      const filtered = DECK_ETO_SARU.filter!(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should handle case-insensitive matching', () => {
      const testPrototypes: NormalizedPrototype[] = [
        {
          id: 1,
          prototypeNm: 'TIGER game',
          users: ['User1'],
          summary: '',
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
          prototypeNm: 'tiger GAME',
          users: ['User2'],
          summary: '',
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
      ];
      const filtered = DECK_ETO_TORA.filter!(testPrototypes);
      expect(filtered.length).toBe(2);
    });

    it('should match keywords in summary field', () => {
      const testPrototypes: NormalizedPrototype[] = [
        {
          id: 1,
          prototypeNm: 'Random Game',
          users: ['User1'],
          summary: 'A game featuring a dragon',
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
      ];
      const filtered = DECK_ETO_TATSU.filter!(testPrototypes);
      expect(filtered.length).toBe(1);
    });

    it('should handle emoji keywords', () => {
      const testPrototypes: NormalizedPrototype[] = [
        {
          id: 1,
          prototypeNm: '🐍 Snake Game',
          users: ['User1'],
          summary: '',
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
      ];
      const filtered = DECK_ETO_MI.filter!(testPrototypes);
      expect(filtered.length).toBe(1);
    });
  });

  describe('API parameters', () => {
    it('should have consistent apiParams across all recipes', () => {
      ETO_RECIPES.forEach((recipe) => {
        expect(recipe.apiParams).toEqual({ offset: 0, limit: 10000 });
      });
    });
  });
});
