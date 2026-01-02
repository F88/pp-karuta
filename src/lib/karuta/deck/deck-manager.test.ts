import { describe, it, expect } from 'vitest';
import { DeckManager } from './deck-manager';
import type { NormalizedPrototype } from '@f88/promidas/types';

describe('DeckManager', () => {
  describe('createFromPrototypes', () => {
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
      const deck = DeckManager.createFromPrototypes(mockPrototypes);

      expect(deck.size).toBe(3);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });

    it('should create a Deck with filter applied', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.users.includes('User1'));

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

      expect(deck.size).toBe(2);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
      expect(deck.get(2)).toBeUndefined();
    });

    it('should handle empty filter result', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.users.includes('NonExistentUser'));

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

      expect(deck.size).toBe(0);
    });

    it('should handle filter that returns all prototypes', () => {
      const filter = (prototypes: NormalizedPrototype[]) => prototypes;

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

      expect(deck.size).toBe(3);
    });

    it('should handle empty prototypes array', () => {
      const emptyPrototypes: readonly NormalizedPrototype[] = [];

      const deck = DeckManager.createFromPrototypes(emptyPrototypes);

      expect(deck.size).toBe(0);
    });

    it('should not mutate the original readonly array', () => {
      const originalLength = mockPrototypes.length;

      DeckManager.createFromPrototypes(mockPrototypes);

      expect(mockPrototypes.length).toBe(originalLength);
      expect(mockPrototypes[0].id).toBe(1);
    });

    it('should handle filter that modifies prototypes', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.map((p) => ({
          ...p,
          prototypeNm: `Modified ${p.prototypeNm}`,
        }));

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

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
        DeckManager.createFromPrototypes(mockPrototypes, filter),
      ).toThrow('Invalid prototype: missing or invalid ID');
    });

    it('should throw error if filter returns duplicate IDs', () => {
      const filter = () => [
        mockPrototypes[0],
        mockPrototypes[0], // duplicate
      ];

      expect(() =>
        DeckManager.createFromPrototypes(mockPrototypes, filter),
      ).toThrow('Duplicate prototype ID detected: 1');
    });

    it('should work with complex filter logic', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.id > 1).sort((a, b) => b.id - a.id);

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

      expect(deck.size).toBe(2);
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });

    it('should filter by prototype name containing specific text', () => {
      const filter = (prototypes: NormalizedPrototype[]) =>
        prototypes.filter((p) => p.prototypeNm.includes('1'));

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

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

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

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

      const deck = DeckManager.createFromPrototypes(mockPrototypes, filter);

      expect(deck.size).toBe(3);
      expect(deck.get(1)?.prototypeNm).toBe('Prototype 1');
      expect(deck.get(2)?.prototypeNm).toBe('Prototype 2');
      expect(deck.get(3)?.prototypeNm).toBe('Prototype 3');
    });
  });
});
