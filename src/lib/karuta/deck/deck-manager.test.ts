import { describe, it, expect } from 'vitest';
import { DeckManager } from './deck-manager';
import type { NormalizedPrototype } from '@f88/promidas/types';

describe('DeckManager', () => {
  describe('createDeckWithFilter', () => {
    const mockPrototypes: readonly NormalizedPrototype[] = [
      {
        id: 1,
        prototypeNm: 'Prototype 1',
        users: ['User1'],
        summary: 'Detail 1',
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
        prototypeNm: 'Prototype 2',
        users: ['User2'],
        summary: 'Detail 2',
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
        prototypeNm: 'Prototype 3',
        users: ['User1'],
        summary: 'Detail 3',
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
    ] as const;

    it('should create a Deck from readonly prototypes array without filter', () => {
      const deck = DeckManager.createDeckWithFilter(mockPrototypes);

      expect(deck.size).toBe(3);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });

    it('should create a Deck with filter applied', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.users.includes('User1'));

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(2);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
      expect(deck.get(2)).toBeUndefined();
    });

    it('should handle empty filter result', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.users.includes('NonExistentUser'));

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(0);
    });

    it('should handle filter that returns all prototypes', () => {
      const filter = (prototypes: NormalizedPrototype[]) => prototypes;

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(3);
    });

    it('should handle empty prototypes array', () => {
      const emptyPrototypes: readonly NormalizedPrototype[] = [];

      const deck = DeckManager.createDeckWithFilter(emptyPrototypes);

      expect(deck.size).toBe(0);
    });

    it('should not mutate the original readonly array', () => {
      const originalLength = mockPrototypes.length;

      DeckManager.createDeckWithFilter(mockPrototypes);

      expect(mockPrototypes.length).toBe(originalLength);
      expect(mockPrototypes[0].id).toBe(1);
    });

    it('should handle filter that modifies prototypes', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.map((p) => ({
          ...p,
          prototypeNm: `Modified ${p.prototypeNm}`,
        }));

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(3);
      expect(deck.get(1)?.prototypeNm).toBe('Modified Prototype 1');
      expect(deck.get(2)?.prototypeNm).toBe('Modified Prototype 2');
    });

    it('should throw error if filter returns invalid prototypes', () => {
      const filter = () =>
        [
          { id: null, prototypeNm: 'Invalid' },
        ] as unknown as NormalizedPrototype[];

      expect(() =>
        DeckManager.createDeckWithFilter(mockPrototypes, filter),
      ).toThrow('Invalid prototype: missing or invalid ID');
    });

    it('should throw error if filter returns duplicate IDs', () => {
      const filter = () => [
        mockPrototypes[0],
        mockPrototypes[0], // duplicate
      ];

      expect(() =>
        DeckManager.createDeckWithFilter(mockPrototypes, filter),
      ).toThrow('Duplicate prototype ID detected: 1');
    });

    it('should work with complex filter logic', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.id > 1).sort((a, b) => b.id - a.id);

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(2);
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });

    it('should filter by prototype name containing specific text', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.prototypeNm.includes('1'));

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(1);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(2)).toBeUndefined();
      expect(deck.get(3)).toBeUndefined();
    });

    it('should filter by prototype name containing multiple keywords', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter(
          (p) => p.prototypeNm.includes('2') || p.prototypeNm.includes('3'),
        );

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(2);
      expect(deck.get(1)).toBeUndefined();
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });

    it('should filter by case-insensitive name match', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) =>
          p.prototypeNm.toLowerCase().includes('prototype'),
        );

      const deck = DeckManager.createDeckWithFilter(mockPrototypes, filter);

      expect(deck.size).toBe(3);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });
  });

  describe('getByIds', () => {
    const mockDeck = new Map<number, NormalizedPrototype>([
      [
        1,
        {
          id: 1,
          prototypeNm: 'Prototype 1',
          users: ['User1'],
          summary: 'Detail 1',
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
      ],
      [
        2,
        {
          id: 2,
          prototypeNm: 'Prototype 2',
          users: ['User2'],
          summary: 'Detail 2',
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
      ],
      [
        3,
        {
          id: 3,
          prototypeNm: 'Prototype 3',
          users: ['User1'],
          summary: 'Detail 3',
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
      ],
    ]);

    it('should retrieve multiple prototypes by IDs', () => {
      const result = DeckManager.getByIds(mockDeck, [1, 3]);

      expect(result).toHaveLength(2);
      expect(result[0]?.prototypeNm).toBe('Prototype 1');
      expect(result[1]?.prototypeNm).toBe('Prototype 3');
    });

    it('should filter out non-existent IDs', () => {
      const result = DeckManager.getByIds(mockDeck, [1, 999, 2]);

      expect(result).toHaveLength(2);
      expect(result[0]?.prototypeNm).toBe('Prototype 1');
      expect(result[1]?.prototypeNm).toBe('Prototype 2');
    });

    it('should return empty array for all non-existent IDs', () => {
      const result = DeckManager.getByIds(mockDeck, [999, 888]);

      expect(result).toHaveLength(0);
    });

    it('should handle empty IDs array', () => {
      const result = DeckManager.getByIds(mockDeck, []);

      expect(result).toHaveLength(0);
    });

    it('should preserve order of requested IDs', () => {
      const result = DeckManager.getByIds(mockDeck, [3, 1, 2]);

      expect(result).toHaveLength(3);
      expect(result[0]?.id).toBe(3);
      expect(result[1]?.id).toBe(1);
      expect(result[2]?.id).toBe(2);
    });
  });

  describe('getIds', () => {
    it('should return sorted array of prototype IDs', () => {
      const deck = new Map<number, NormalizedPrototype>([
        [3, { id: 3 } as NormalizedPrototype],
        [1, { id: 1 } as NormalizedPrototype],
        [2, { id: 2 } as NormalizedPrototype],
      ]);

      const result = DeckManager.getIds(deck);

      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array for empty deck', () => {
      const deck = new Map<number, NormalizedPrototype>();

      const result = DeckManager.getIds(deck);

      expect(result).toEqual([]);
    });
  });

  describe('getPrototypes', () => {
    it('should return array of all prototypes', () => {
      const proto1 = { id: 1, prototypeNm: 'Proto 1' } as NormalizedPrototype;
      const proto2 = { id: 2, prototypeNm: 'Proto 2' } as NormalizedPrototype;
      const deck = new Map<number, NormalizedPrototype>([
        [1, proto1],
        [2, proto2],
      ]);

      const result = DeckManager.getPrototypes(deck);

      expect(result).toHaveLength(2);
      expect(result).toContain(proto1);
      expect(result).toContain(proto2);
    });

    it('should return empty array for empty deck', () => {
      const deck = new Map<number, NormalizedPrototype>();

      const result = DeckManager.getPrototypes(deck);

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return prototype by ID', () => {
      const proto = { id: 1, prototypeNm: 'Proto 1' } as NormalizedPrototype;
      const deck = new Map<number, NormalizedPrototype>([[1, proto]]);

      const result = DeckManager.getById(deck, 1);

      expect(result).toBe(proto);
    });

    it('should return undefined for non-existent ID', () => {
      const deck = new Map<number, NormalizedPrototype>();

      const result = DeckManager.getById(deck, 999);

      expect(result).toBeUndefined();
    });
  });

  describe('getSize', () => {
    it('should return number of prototypes in deck', () => {
      const deck = new Map<number, NormalizedPrototype>([
        [1, { id: 1 } as NormalizedPrototype],
        [2, { id: 2 } as NormalizedPrototype],
        [3, { id: 3 } as NormalizedPrototype],
      ]);

      const result = DeckManager.getSize(deck);

      expect(result).toBe(3);
    });

    it('should return 0 for empty deck', () => {
      const deck = new Map<number, NormalizedPrototype>();

      const result = DeckManager.getSize(deck);

      expect(result).toBe(0);
    });
  });

  describe('has', () => {
    it('should return true for existing ID', () => {
      const deck = new Map<number, NormalizedPrototype>([
        [1, { id: 1 } as NormalizedPrototype],
      ]);

      const result = DeckManager.has(deck, 1);

      expect(result).toBe(true);
    });

    it('should return false for non-existent ID', () => {
      const deck = new Map<number, NormalizedPrototype>();

      const result = DeckManager.has(deck, 999);

      expect(result).toBe(false);
    });
  });
});
