import { describe, it, expect } from 'vitest';
import {
  PLAYER_KEY_BINDINGS_16,
  PLAYER_KEY_BINDINGS_8,
  getPlayerKeyBindings,
  getKeyForCard,
} from './keyboard-bindings';

describe('keyboard-bindings', () => {
  describe('PLAYER_KEY_BINDINGS_16', () => {
    it('should have bindings for 2 players', () => {
      expect(PLAYER_KEY_BINDINGS_16).toHaveLength(2);
    });

    it('should have 16 keys per player', () => {
      expect(PLAYER_KEY_BINDINGS_16[0]).toHaveLength(16);
      expect(PLAYER_KEY_BINDINGS_16[1]).toHaveLength(16);
    });

    it('should have correct keys for player 0', () => {
      expect(PLAYER_KEY_BINDINGS_16[0]).toEqual([
        '7',
        '8',
        '9',
        '0',
        'u',
        'i',
        'o',
        'p',
        'j',
        'k',
        'l',
        ';',
        'm',
        ',',
        '.',
        '/',
      ]);
    });

    it('should have correct keys for player 1', () => {
      expect(PLAYER_KEY_BINDINGS_16[1]).toEqual([
        '1',
        '2',
        '3',
        '4',
        'q',
        'w',
        'e',
        'r',
        'a',
        's',
        'd',
        'f',
        'z',
        'x',
        'c',
        'v',
      ]);
    });
  });

  describe('PLAYER_KEY_BINDINGS_8', () => {
    it('should have bindings for 4 players', () => {
      expect(PLAYER_KEY_BINDINGS_8).toHaveLength(4);
    });

    it('should have 8 keys per player', () => {
      expect(PLAYER_KEY_BINDINGS_8[0]).toHaveLength(8);
      expect(PLAYER_KEY_BINDINGS_8[1]).toHaveLength(8);
      expect(PLAYER_KEY_BINDINGS_8[2]).toHaveLength(8);
      expect(PLAYER_KEY_BINDINGS_8[3]).toHaveLength(8);
    });

    it('should have correct keys for player 0', () => {
      expect(PLAYER_KEY_BINDINGS_8[0]).toEqual([
        'j',
        'k',
        'l',
        ';',
        'm',
        ',',
        '.',
        '/',
      ]);
    });

    it('should have correct keys for player 1', () => {
      expect(PLAYER_KEY_BINDINGS_8[1]).toEqual([
        'a',
        's',
        'd',
        'f',
        'z',
        'x',
        'c',
        'v',
      ]);
    });

    it('should have correct keys for player 2', () => {
      expect(PLAYER_KEY_BINDINGS_8[2]).toEqual([
        '7',
        '8',
        '9',
        '0',
        'u',
        'i',
        'o',
        'p',
      ]);
    });

    it('should have correct keys for player 3', () => {
      expect(PLAYER_KEY_BINDINGS_8[3]).toEqual([
        '1',
        '2',
        '3',
        '4',
        'q',
        'w',
        'e',
        'r',
      ]);
    });
  });

  describe('getPlayerKeyBindings', () => {
    // Parameterized test for all combinations of playerCount (1,2,3,4) and tatamiSize (4,8,12,16)
    it.each([
      // playerCount 1
      {
        playerCount: 1,
        tatamiSize: 4,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 1,
        tatamiSize: 8,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 1,
        tatamiSize: 12,
        expectedLayout: '16-key',
        expectedBindings: PLAYER_KEY_BINDINGS_16,
      },
      {
        playerCount: 1,
        tatamiSize: 16,
        expectedLayout: '16-key',
        expectedBindings: PLAYER_KEY_BINDINGS_16,
      },
      // playerCount 2
      {
        playerCount: 2,
        tatamiSize: 4,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 2,
        tatamiSize: 8,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 2,
        tatamiSize: 12,
        expectedLayout: '16-key',
        expectedBindings: PLAYER_KEY_BINDINGS_16,
      },
      {
        playerCount: 2,
        tatamiSize: 16,
        expectedLayout: '16-key',
        expectedBindings: PLAYER_KEY_BINDINGS_16,
      },
      // playerCount 3 (always 8-key regardless of tatamiSize)
      {
        playerCount: 3,
        tatamiSize: 4,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 3,
        tatamiSize: 8,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 3,
        tatamiSize: 12,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 3,
        tatamiSize: 16,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      // playerCount 4 (always 8-key regardless of tatamiSize)
      {
        playerCount: 4,
        tatamiSize: 4,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 4,
        tatamiSize: 8,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 4,
        tatamiSize: 12,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
      {
        playerCount: 4,
        tatamiSize: 16,
        expectedLayout: '8-key',
        expectedBindings: PLAYER_KEY_BINDINGS_8,
      },
    ])(
      'should return $expectedLayout bindings for playerCount=$playerCount, tatamiSize=$tatamiSize',
      ({ playerCount, tatamiSize, expectedBindings }) => {
        const bindings = getPlayerKeyBindings(0, playerCount, tatamiSize);
        expect(bindings).toEqual(expectedBindings[0]);
        expect(bindings).toHaveLength(expectedBindings[0].length);
      },
    );

    it('should return undefined for invalid player index', () => {
      expect(getPlayerKeyBindings(10, 2)).toBeUndefined();
      expect(getPlayerKeyBindings(-1, 2)).toBeUndefined();
    });
  });

  describe('getKeyForCard', () => {
    it('should return correct key for 16-key layout (2 players, tatamiSize=16)', () => {
      expect(getKeyForCard(0, 0, 2, 16)).toBe('7');
      expect(getKeyForCard(0, 4, 2, 16)).toBe('u');
      expect(getKeyForCard(0, 15, 2, 16)).toBe('/');
      expect(getKeyForCard(1, 0, 2, 16)).toBe('1');
      expect(getKeyForCard(1, 8, 2, 16)).toBe('a');
      expect(getKeyForCard(1, 15, 2, 16)).toBe('v');
    });

    it('should return correct key for 8-key layout (4 players)', () => {
      expect(getKeyForCard(0, 0, 4)).toBe('j');
      expect(getKeyForCard(0, 7, 4)).toBe('/');
      expect(getKeyForCard(1, 0, 4)).toBe('a');
      expect(getKeyForCard(1, 7, 4)).toBe('v');
      expect(getKeyForCard(2, 0, 4)).toBe('7');
      expect(getKeyForCard(2, 7, 4)).toBe('p');
      expect(getKeyForCard(3, 0, 4)).toBe('1');
      expect(getKeyForCard(3, 7, 4)).toBe('r');
    });

    it('should default to 2 players with tatamiSize=8 when parameters are not provided', () => {
      expect(getKeyForCard(0, 0)).toBe('j');
      expect(getKeyForCard(0, 7)).toBe('/');
    });

    it('should return undefined for invalid card index', () => {
      expect(getKeyForCard(0, 100, 2)).toBeUndefined();
      expect(getKeyForCard(0, -1, 2)).toBeUndefined();
    });

    it('should return undefined for invalid player index', () => {
      expect(getKeyForCard(10, 0, 2)).toBeUndefined();
      expect(getKeyForCard(-1, 0, 2)).toBeUndefined();
    });

    it('should handle edge cases for 8-key layout', () => {
      expect(getKeyForCard(0, 8, 4)).toBeUndefined(); // beyond 8 keys
      expect(getKeyForCard(3, 8, 4)).toBeUndefined(); // beyond 8 keys
    });
  });
});
