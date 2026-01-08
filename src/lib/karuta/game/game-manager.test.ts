import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameManager } from './game-manager';
import { StackManager } from '../stack/stack-manager';
import { PlayerManager } from '../player/player-manager';
import { PlayModeManager } from '../playMode/play-mode-manager';
import type { Deck, Player, StackRecipe } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '../playMode/play-mode-manager';

// ========================================
// Mock Data Factories
// ========================================

/**
 * Create a mock NormalizedPrototype for testing
 */
const createMockPrototype = (id: number): NormalizedPrototype => ({
  id,
  prototypeNm: `Prototype ${id}`,
  users: [`User${id}`],
  summary: `Summary for prototype ${id}`,
  freeComment: '',
  systemDescription: '',
  tags: [],
  materials: [],
  events: [],
  awards: [],
  teamNm: `Team ${id}`,
  releaseFlg: 1,
  status: 1,
  createDate: '2024-01-01T00:00:00.000Z',
  mainUrl: `https://example.com/prototype/${id}`,
  viewCount: 0,
  goodCount: 0,
  commentCount: 0,
  updateDate: undefined,
  releaseDate: undefined,
  officialLink: undefined,
  videoUrl: undefined,
  relatedLink: undefined,
  relatedLink2: undefined,
  relatedLink3: undefined,
  relatedLink4: undefined,
  relatedLink5: undefined,
  createId: undefined,
  updateId: undefined,
  uuid: undefined,
  nid: undefined,
  revision: undefined,
  licenseType: undefined,
  thanksFlg: undefined,
  slideMode: undefined,
});

/**
 * Create a mock Deck with specified size
 */
const createMockDeck = (size: number): Deck => {
  const deck = new Map<number, NormalizedPrototype>();
  for (let i = 1; i <= size; i++) {
    deck.set(i, createMockPrototype(i));
  }
  return deck;
};

/**
 * Create mock Players
 */
const createMockPlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
  }));

/**
 * Create a mock StackRecipe
 */
const createMockStackRecipe = (
  overrides?: Partial<StackRecipe>,
): StackRecipe => ({
  id: 'test-recipe',
  title: 'Test Recipe',
  description: 'Test recipe for testing',
  tags: ['test'],
  difficulty: 'beginner',
  sortMethod: 'id-asc',
  maxSize: 'all',
  ...overrides,
});

// ========================================
// Test Suite
// ========================================

describe('GameManager', () => {
  describe('MAX_GAME_PLAYERS', () => {
    it('should be 4', () => {
      expect(GameManager.MAX_GAME_PLAYERS).toBe(4);
    });
  });

  describe('createInitialState', () => {
    let generateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Mock StackManager.generate to return deterministic results
      generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockClear();
    });

    // ========================================
    // Happy Path Tests
    // ========================================

    describe('happy path', () => {
      it('should create valid GameState with 2 players', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        // Mock deterministic stack generation (IDs 1-10 in order)
        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5,
        );

        expect(gameState).toBeDefined();
        expect(gameState.deck).toBe(deck);
        expect(gameState.tatami).toEqual([1, 2, 3, 4, 5]);
        expect(gameState.stack).toEqual([6, 7, 8, 9, 10]);
        expect(gameState.readingOrder).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(gameState.playerStates).toHaveLength(2);

        console.dir(gameState, { depth: null });

        // Check player states
        gameState.playerStates.forEach((playerState, index) => {
          expect(playerState.player).toEqual(players[index]);
          expect(playerState.tatami).toEqual([1, 2, 3, 4, 5]);
          expect(playerState.mochiFuda).toEqual([]);
          expect(playerState.score).toBe(0);
        });
      });

      it('should work with 1 player', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(1);
        const playMode: PlayMode = 'touch';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
        );

        expect(gameState.playerStates).toHaveLength(1);
        expect(gameState.playerStates[0].player).toEqual(players[0]);
      });

      it('should work with maximum players (4)', () => {
        const deck = createMockDeck(20);
        const players = createMockPlayers(4);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue(
          Array.from({ length: 20 }, (_, i) => i + 1),
        );

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
        );

        expect(gameState.playerStates).toHaveLength(4);
        gameState.playerStates.forEach((playerState, index) => {
          expect(playerState.player).toEqual(players[index]);
        });
      });

      it('should respect custom initialTatamiSize', () => {
        const deck = createMockDeck(15);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();
        const customTatamiSize = 8;

        generateSpy.mockReturnValue(
          Array.from({ length: 15 }, (_, i) => i + 1),
        );

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          customTatamiSize,
        );

        expect(gameState.tatami).toHaveLength(8);
        expect(gameState.stack).toHaveLength(7);
        expect(gameState.tatami).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(gameState.stack).toEqual([9, 10, 11, 12, 13, 14, 15]);
      });

      it('should work with keyboard playMode', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
        );

        expect(gameState).toBeDefined();
      });

      it('should work with touch playMode', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'touch';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
        );

        expect(gameState).toBeDefined();
      });
    });

    // ========================================
    // Validation Error Tests
    // ========================================

    describe('validation errors', () => {
      it('should throw error if deck is empty', () => {
        const emptyDeck = new Map<number, NormalizedPrototype>();
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        expect(() =>
          GameManager.createInitialState(
            emptyDeck,
            players,
            playMode,
            stackRecipe,
          ),
        ).toThrow('Deck must not be empty');
      });

      it('should throw error if players array is empty', () => {
        const deck = createMockDeck(10);
        const emptyPlayers: Player[] = [];
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        expect(() =>
          GameManager.createInitialState(
            deck,
            emptyPlayers,
            playMode,
            stackRecipe,
          ),
        ).toThrow();
      });

      it('should throw error if more than 4 players', () => {
        const deck = createMockDeck(10);
        const tooManyPlayers = createMockPlayers(5);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        expect(() =>
          GameManager.createInitialState(
            deck,
            tooManyPlayers,
            playMode,
            stackRecipe,
          ),
        ).toThrow();
      });

      it('should throw error if players have duplicate IDs', () => {
        const deck = createMockDeck(10);
        const playersWithDuplicateIds: Player[] = [
          { id: 'player-1', name: 'Player 1' },
          { id: 'player-1', name: 'Player 1 Duplicate' },
        ];
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        expect(() =>
          GameManager.createInitialState(
            deck,
            playersWithDuplicateIds,
            playMode,
            stackRecipe,
          ),
        ).toThrow();
      });

      it('should throw error for invalid playMode', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const invalidPlayMode = 'invalid-mode' as PlayMode;
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        expect(() =>
          GameManager.createInitialState(
            deck,
            players,
            invalidPlayMode,
            stackRecipe,
          ),
        ).toThrow();
      });
    });

    // ========================================
    // Edge Cases
    // ========================================

    describe('edge cases', () => {
      it('should handle deck smaller than initialTatamiSize', () => {
        const deck = createMockDeck(3);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5, // Requesting 5 but only 3 available
        );

        expect(gameState.tatami).toEqual([1, 2, 3]);
        expect(gameState.stack).toEqual([]);
        expect(gameState.readingOrder).toEqual([1, 2, 3]);
      });

      it('should handle deck size equals initialTatamiSize', () => {
        const deck = createMockDeck(5);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5,
        );

        expect(gameState.tatami).toEqual([1, 2, 3, 4, 5]);
        expect(gameState.stack).toEqual([]);
        expect(gameState.readingOrder).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle single card deck', () => {
        const deck = createMockDeck(1);
        const players = createMockPlayers(1);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5,
        );

        expect(gameState.tatami).toEqual([1]);
        expect(gameState.stack).toEqual([]);
        expect(gameState.readingOrder).toEqual([1]);
      });

      it('should handle large deck', () => {
        const deck = createMockDeck(100);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue(
          Array.from({ length: 100 }, (_, i) => i + 1),
        );

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          10,
        );

        expect(gameState.tatami).toHaveLength(10);
        expect(gameState.stack).toHaveLength(90);
        expect(gameState.readingOrder).toHaveLength(100);
      });

      it('should handle initialTatamiSize of 0', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          0,
        );

        expect(gameState.tatami).toEqual([]);
        expect(gameState.stack).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it('should handle initialTatamiSize of 1', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          1,
        );

        expect(gameState.tatami).toEqual([1]);
        expect(gameState.stack).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    // ========================================
    // State Integrity Tests
    // ========================================

    describe('state integrity', () => {
      it('should create independent tatami copies for each player', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(3);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5,
        );

        // Verify each player has their own tatami array
        const tatami1 = gameState.playerStates[0].tatami;
        const tatami2 = gameState.playerStates[1].tatami;
        const tatami3 = gameState.playerStates[2].tatami;

        expect(tatami1).not.toBe(tatami2);
        expect(tatami2).not.toBe(tatami3);
        expect(tatami1).not.toBe(tatami3);

        // Verify they have the same content
        expect(tatami1).toEqual([1, 2, 3, 4, 5]);
        expect(tatami2).toEqual([1, 2, 3, 4, 5]);
        expect(tatami3).toEqual([1, 2, 3, 4, 5]);

        // Verify modification of one doesn't affect others
        tatami1.push(99);
        expect(tatami1).toHaveLength(6);
        expect(tatami2).toHaveLength(5);
        expect(tatami3).toHaveLength(5);
      });

      it('should preserve readingOrder as full stack sequence', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          5,
        );

        expect(gameState.readingOrder).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(gameState.readingOrder).toHaveLength(10);
      });

      it('should ensure no card duplication across tatami and stack', () => {
        const deck = createMockDeck(20);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue(
          Array.from({ length: 20 }, (_, i) => i + 1),
        );

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          7,
        );

        const tatamiSet = new Set(gameState.tatami);
        const stackSet = new Set(gameState.stack);

        // No overlap
        const intersection = [...tatamiSet].filter((id) => stackSet.has(id));
        expect(intersection).toHaveLength(0);

        // All unique
        expect(tatamiSet.size).toBe(gameState.tatami.length);
        expect(stackSet.size).toBe(gameState.stack.length);
      });

      it('should ensure no card loss (total equals deck size)', () => {
        const deck = createMockDeck(15);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue(
          Array.from({ length: 15 }, (_, i) => i + 1),
        );

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          6,
        );

        const totalCards = gameState.tatami.length + gameState.stack.length;
        expect(totalCards).toBe(15);
        expect(gameState.readingOrder.length).toBe(15);
      });

      it('should initialize each player with empty mochiFuda and zero score', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(4);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
        );

        gameState.playerStates.forEach((playerState) => {
          expect(playerState.mochiFuda).toEqual([]);
          expect(playerState.score).toBe(0);
        });
      });
    });

    // ========================================
    // Integration with Dependencies
    // ========================================

    describe('integration with StackManager', () => {
      it('should call StackManager.generate with correct parameters', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        GameManager.createInitialState(deck, players, playMode, stackRecipe);

        expect(generateSpy).toHaveBeenCalledWith(deck, stackRecipe);
        expect(generateSpy).toHaveBeenCalledTimes(1);
      });

      it('should use full stack output from StackManager for readingOrder', () => {
        const deck = createMockDeck(8);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        // Mock StackManager to return specific order
        const mockStackOutput = [8, 3, 1, 5, 2, 7, 4, 6];
        generateSpy.mockReturnValue(mockStackOutput);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          4,
        );

        expect(gameState.readingOrder).toEqual(mockStackOutput);
        expect(gameState.tatami).toEqual([8, 3, 1, 5]);
        expect(gameState.stack).toEqual([2, 7, 4, 6]);
      });
    });

    describe('integration with PlayerManager', () => {
      it('should call PlayerManager.validatePlayersForGame', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        const validateSpy = vi.spyOn(PlayerManager, 'validatePlayersForGame');
        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        GameManager.createInitialState(deck, players, playMode, stackRecipe);

        expect(validateSpy).toHaveBeenCalledWith(
          players,
          GameManager.MAX_GAME_PLAYERS,
        );
      });
    });

    describe('integration with PlayModeManager', () => {
      it('should call PlayModeManager.validatePlayMode', () => {
        const deck = createMockDeck(10);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        const validateSpy = vi.spyOn(PlayModeManager, 'validatePlayMode');
        generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        GameManager.createInitialState(deck, players, playMode, stackRecipe);

        expect(validateSpy).toHaveBeenCalledWith(playMode);
      });
    });
  });

  // ========================================
  // Section 2: Game Logic Operations Tests
  // ========================================

  describe('getTotalMochiFuda', () => {
    it('should return 0 for initial game state', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      expect(GameManager.getTotalMochiFuda(gameState)).toBe(0);
    });

    it('should count mochiFuda across all players', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(3);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Manually add mochiFuda to players
      gameState.playerStates[0].mochiFuda = [1, 2, 3];
      gameState.playerStates[1].mochiFuda = [4, 5];
      gameState.playerStates[2].mochiFuda = [6];

      expect(GameManager.getTotalMochiFuda(gameState)).toBe(6);
    });
  });

  describe('isGameOver', () => {
    it('should return false for initial game state', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      expect(GameManager.isGameOver(gameState)).toBe(false);
    });

    it('should return false when some cards remain', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Add some mochiFuda but not all
      gameState.playerStates[0].mochiFuda = [1, 2, 3, 4, 5];
      gameState.playerStates[1].mochiFuda = [6, 7, 8];

      expect(GameManager.isGameOver(gameState)).toBe(false);
    });

    it('should return true when all cards are acquired', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // All cards acquired
      gameState.playerStates[0].mochiFuda = [1, 2, 3, 4, 5, 6];
      gameState.playerStates[1].mochiFuda = [7, 8, 9, 10];

      expect(GameManager.isGameOver(gameState)).toBe(true);
    });

    it('should return true when total mochiFuda equals readingOrder length', () => {
      const deck = createMockDeck(5);
      const players = createMockPlayers(1);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      gameState.playerStates[0].mochiFuda = [1, 2, 3, 4, 5];

      expect(GameManager.isGameOver(gameState)).toBe(true);
    });
  });

  describe('getCurrentYomiFuda', () => {
    it('should return first card for initial game state', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      const currentYomiFuda = GameManager.getCurrentYomiFuda(gameState);

      expect(currentYomiFuda).not.toBeNull();
      expect(currentYomiFuda?.id).toBe(1);
    });

    it('should return next card after some cards are acquired', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Simulate 3 cards acquired
      gameState.playerStates[0].mochiFuda = [1, 2];
      gameState.playerStates[1].mochiFuda = [3];

      const currentYomiFuda = GameManager.getCurrentYomiFuda(gameState);

      expect(currentYomiFuda).not.toBeNull();
      expect(currentYomiFuda?.id).toBe(4); // 4th card in readingOrder
    });

    it('should return null when game is over', () => {
      const deck = createMockDeck(5);
      const players = createMockPlayers(1);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // All cards acquired
      gameState.playerStates[0].mochiFuda = [1, 2, 3, 4, 5];

      const currentYomiFuda = GameManager.getCurrentYomiFuda(gameState);

      expect(currentYomiFuda).toBeNull();
    });

    it('should return null for card ID not in deck', () => {
      const deck = createMockDeck(5);
      const players = createMockPlayers(1);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      // Return reading order with ID that doesn't exist in deck
      generateSpy.mockReturnValue([1, 2, 999, 4, 5]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Simulate 2 cards acquired, so next would be ID 999
      gameState.playerStates[0].mochiFuda = [1, 2];

      const currentYomiFuda = GameManager.getCurrentYomiFuda(gameState);

      expect(currentYomiFuda).toBeNull();
    });
  });

  describe('processCorrectAnswer', () => {
    it('should remove card from all players tatami', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Card 1 should be removed from all players' tatami
      expect(newState.playerStates[0].tatami).not.toContain(1);
      expect(newState.playerStates[1].tatami).not.toContain(1);
    });

    it('should add next card from stack to all players tatami', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Next card (6) should be added to all players' tatami
      expect(newState.playerStates[0].tatami).toContain(6);
      expect(newState.playerStates[1].tatami).toContain(6);
    });

    it('should update correct player mochiFuda and score', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Player 1 should have card 1 in mochiFuda and score +1
      expect(newState.playerStates[0].mochiFuda).toEqual([1]);
      expect(newState.playerStates[0].score).toBe(1);

      // Player 2 should not be affected
      expect(newState.playerStates[1].mochiFuda).toEqual([]);
      expect(newState.playerStates[1].score).toBe(0);
    });

    it('should update shared tatami', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Shared tatami should remove 1 and add 6
      expect(newState.tatami).not.toContain(1);
      expect(newState.tatami).toContain(6);
      expect(newState.tatami).toEqual([2, 3, 4, 5, 6]);
    });

    it('should update stack correctly', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      expect(gameState.stack).toEqual([6, 7, 8, 9, 10]);

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Stack should have removed first card (6)
      expect(newState.stack).toEqual([7, 8, 9, 10]);
    });

    it('should handle empty stack gracefully', () => {
      const deck = createMockDeck(5);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      // Stack is already empty
      expect(gameState.stack).toEqual([]);

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      // Should not add any new card to tatami
      expect(newState.playerStates[0].tatami).toHaveLength(4); // 5 - 1
      expect(newState.playerStates[1].tatami).toHaveLength(4);
      expect(newState.tatami).toHaveLength(4);
      expect(newState.stack).toEqual([]);
    });

    it('should accumulate mochiFuda across multiple correct answers', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      let gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      // Player 1 gets card 1
      gameState = GameManager.processCorrectAnswer(gameState, 'player-1', 1);
      expect(gameState.playerStates[0].mochiFuda).toEqual([1]);
      expect(gameState.playerStates[0].score).toBe(1);

      // Player 2 gets card 2
      gameState = GameManager.processCorrectAnswer(gameState, 'player-2', 2);
      expect(gameState.playerStates[0].mochiFuda).toEqual([1]);
      expect(gameState.playerStates[1].mochiFuda).toEqual([2]);
      expect(gameState.playerStates[1].score).toBe(1);

      // Player 1 gets card 3
      gameState = GameManager.processCorrectAnswer(gameState, 'player-1', 3);
      expect(gameState.playerStates[0].mochiFuda).toEqual([1, 3]);
      expect(gameState.playerStates[0].score).toBe(2);
    });
  });

  describe('processIncorrectAnswer', () => {
    it('should decrease score by 1 for incorrect player', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Give player 1 some score first
      gameState.playerStates[0].score = 5;
      gameState.playerStates[1].score = 3;

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      expect(newState.playerStates[0].score).toBe(4);
      expect(newState.playerStates[1].score).toBe(3); // Unchanged
    });

    it('should not decrease score below 0', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      // Player 1 has score 0
      expect(gameState.playerStates[0].score).toBe(0);

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      expect(newState.playerStates[0].score).toBe(0); // Should stay at 0
    });

    it('should not affect other player states', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(3);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
      );

      gameState.playerStates[0].score = 5;
      gameState.playerStates[1].score = 3;
      gameState.playerStates[2].score = 7;

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-2',
      );

      expect(newState.playerStates[0].score).toBe(5); // Unchanged
      expect(newState.playerStates[1].score).toBe(2); // Decreased
      expect(newState.playerStates[2].score).toBe(7); // Unchanged
    });

    it('should not modify tatami or mochiFuda', () => {
      const deck = createMockDeck(10);
      const players = createMockPlayers(2);
      const playMode: PlayMode = 'keyboard';
      const stackRecipe = createMockStackRecipe();

      const generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const gameState = GameManager.createInitialState(
        deck,
        players,
        playMode,
        stackRecipe,
        5,
      );

      gameState.playerStates[0].score = 5;
      gameState.playerStates[0].mochiFuda = [1, 2, 3];

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      // Tatami should be unchanged
      expect(newState.playerStates[0].tatami).toEqual(
        gameState.playerStates[0].tatami,
      );

      // MochiFuda should be unchanged
      expect(newState.playerStates[0].mochiFuda).toEqual([1, 2, 3]);

      // Shared tatami should be unchanged
      expect(newState.tatami).toEqual(gameState.tatami);

      // Stack should be unchanged
      expect(newState.stack).toEqual(gameState.stack);
    });
  });
});
