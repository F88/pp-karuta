import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createIdsFilter,
  createKeywordFilter,
  createReleaseDateYearFilter,
} from './filter-factory';
import type { NormalizedPrototype } from '@f88/promidas/types';

describe('Filter Factory', () => {
  describe('createIdsFilter', () => {
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
        id: 10,
        prototypeNm: 'Dog Adventure',
        users: ['User10'],
        summary: 'Adventure with dogs',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2024-01-10T00:00:00.000Z',
        mainUrl: 'https://example.com/10',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
    ];

    it('should filter prototypes by single ID', () => {
      const filter = createIdsFilter([1]);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(1);
      expect(filtered.map((p) => p.id)).toEqual([1]);
    });

    it('should filter prototypes by multiple IDs', () => {
      const filter = createIdsFilter([1, 3, 10]);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(3);
      expect(filtered.map((p) => p.id)).toEqual([1, 3, 10]);
    });

    it('should return empty array when no IDs match', () => {
      const filter = createIdsFilter([99, 100]);
      const filtered = filter(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should handle empty ID array', () => {
      const filter = createIdsFilter([]);
      const filtered = filter(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should filter all prototypes when all IDs provided', () => {
      const filter = createIdsFilter([1, 2, 3, 10]);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(4);
      expect(filtered.map((p) => p.id)).toEqual([1, 2, 3, 10]);
    });

    it('should handle duplicate IDs in filter array', () => {
      const filter = createIdsFilter([1, 1, 2, 2]);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(2);
      expect(filtered.map((p) => p.id)).toEqual([1, 2]);
    });
  });

  describe('createKeywordFilter', () => {
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

    it('should filter prototypes using snake keywords', () => {
      const filter = createKeywordFilter(['snake', 'へび', '🐍']);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(2);
      expect(filtered.map((p) => p.id)).toEqual([1, 4]);
    });

    it('should filter prototypes using horse keywords', () => {
      const filter = createKeywordFilter(['horse', 'uma', '馬', '🐴']);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(2);
      expect(filtered.map((p) => p.id)).toEqual([2, 5]);
    });

    it('should return empty array when no matches found', () => {
      const filter = createKeywordFilter(['sheep', 'ひつじ', '🐑']);
      const filtered = filter(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should filter case-insensitively', () => {
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

      const filter = createKeywordFilter(['snake', 'へび', '🐍']);
      const filtered = filter(mixedCasePrototypes);
      expect(filtered.length).toBe(2);
    });

    it('should match keywords in summary field', () => {
      const summaryMatchPrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: 'Random Game',
          summary: 'This game features snakes',
        },
      ];

      const filter = createKeywordFilter(['snake', 'へび', '🐍']);
      const filtered = filter(summaryMatchPrototypes);
      expect(filtered.length).toBe(1);
    });

    it('should handle emoji keywords', () => {
      const emojiPrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: '🐍 Snake Game',
        },
      ];

      const filter = createKeywordFilter(['snake', 'へび', '🐍']);
      const filtered = filter(emojiPrototypes);
      expect(filtered.length).toBe(1);
    });

    it('should handle empty keywords array', () => {
      const filter = createKeywordFilter([]);
      const filtered = filter(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should handle empty prototypes array', () => {
      const filter = createKeywordFilter(['snake']);
      const filtered = filter([]);
      expect(filtered).toEqual([]);
    });

    it('should normalize full-width and half-width characters', () => {
      const fullWidthPrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          prototypeNm: 'ＳＮＡＫＥ　ＧＡＭＥ',
        },
      ];

      const filter = createKeywordFilter(['snake']);
      const filtered = filter(fullWidthPrototypes);
      expect(filtered.length).toBe(1);
    });

    it('should match any keyword from multiple keywords', () => {
      const filter = createKeywordFilter(['cat', 'dog']);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(3);
    });
  });

  describe('createReleaseDateYearFilter', () => {
    let getFullYearSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Mock getFullYear to return UTC year, making tests timezone-independent
      getFullYearSpy = vi
        .spyOn(Date.prototype, 'getFullYear')
        .mockImplementation(function (this: Date) {
          return this.getUTCFullYear();
        });
    });

    afterEach(() => {
      getFullYearSpy.mockRestore();
    });

    const mockPrototypes: NormalizedPrototype[] = [
      {
        id: 1,
        prototypeNm: 'Game 2023',
        users: ['User1'],
        summary: 'Released in 2023',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2023-01-01T00:00:00.000Z',
        releaseDate: '2023-06-15T00:00:00.000Z',
        mainUrl: 'https://example.com/1',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 2,
        prototypeNm: 'Game 2024',
        users: ['User2'],
        summary: 'Released in 2024',
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
        releaseDate: '2024-03-20T00:00:00.000Z',
        mainUrl: 'https://example.com/2',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 3,
        prototypeNm: 'Game 2025',
        users: ['User3'],
        summary: 'Released in 2025',
        freeComment: '',
        systemDescription: '',
        tags: [],
        materials: [],
        events: [],
        awards: [],
        teamNm: '',
        releaseFlg: 1,
        status: 1,
        createDate: '2025-06-01T00:00:00.000Z',
        releaseDate: '2025-01-15T00:00:00.000Z',
        mainUrl: 'https://example.com/3',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
      {
        id: 4,
        prototypeNm: 'Game No Release',
        users: ['User4'],
        summary: 'No release date',
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
        mainUrl: 'https://example.com/4',
        viewCount: 0,
        goodCount: 0,
        commentCount: 0,
      },
    ];

    it('should filter prototypes by release year 2023', () => {
      const filter = createReleaseDateYearFilter(2023);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(1);
    });

    it('should filter prototypes by release year 2024', () => {
      const filter = createReleaseDateYearFilter(2024);
      const filtered = filter(mockPrototypes);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(2);
    });

    it('should return empty array for non-existent year', () => {
      const filter = createReleaseDateYearFilter(2022);
      const filtered = filter(mockPrototypes);
      expect(filtered).toEqual([]);
    });

    it('should exclude prototypes without releaseDate', () => {
      const filter = createReleaseDateYearFilter(2024);
      const filtered = filter(mockPrototypes);
      expect(filtered.every((p) => p.releaseDate)).toBe(true);
      expect(filtered.find((p) => p.id === 4)).toBeUndefined();
    });

    it('should handle empty prototypes array', () => {
      const filter = createReleaseDateYearFilter(2024);
      const filtered = filter([]);
      expect(filtered).toEqual([]);
    });

    it('should handle year boundaries correctly', () => {
      const boundaryPrototypes: NormalizedPrototype[] = [
        {
          id: 10,
          prototypeNm: 'Boundary Game Start',
          users: ['User1'],
          summary: 'Released at start of 2024',
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
          releaseDate: '2024-01-01T00:00:00.000Z',
          mainUrl: 'https://example.com/10',
          viewCount: 0,
          goodCount: 0,
          commentCount: 0,
        },
        {
          id: 11,
          prototypeNm: 'Boundary Game End',
          users: ['User2'],
          summary: 'Released at end of 2024',
          freeComment: '',
          systemDescription: '',
          tags: [],
          materials: [],
          events: [],
          awards: [],
          teamNm: '',
          releaseFlg: 1,
          status: 1,
          createDate: '2024-12-31T00:00:00.000Z',
          releaseDate: '2024-12-31T23:59:59.999Z',
          mainUrl: 'https://example.com/11',
          viewCount: 0,
          goodCount: 0,
          commentCount: 0,
        },
      ];

      const filter = createReleaseDateYearFilter(2024);
      const filtered = filter(boundaryPrototypes);
      expect(filtered.length).toBe(2);
      expect(filtered.map((p) => p.id)).toEqual([10, 11]);
    });

    it('should handle invalid date strings', () => {
      const invalidDatePrototypes: NormalizedPrototype[] = [
        {
          ...mockPrototypes[0],
          id: 20,
          releaseDate: 'invalid-date',
        },
      ];

      const filter = createReleaseDateYearFilter(2024);
      const filtered = filter(invalidDatePrototypes);
      // Invalid dates should be filtered out (NaN !== 2024)
      expect(filtered).toEqual([]);
    });
  });
});
