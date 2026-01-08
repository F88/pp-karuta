import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameManager } from './game-manager';
import { StackManager } from '../stack/stack-manager';
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
      generateSpy = vi.spyOn(StackManager, 'generate');
      generateSpy.mockClear();
    });

    describe('happy path', () => {
      it('should create valid GameState with 2 players', () => {
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

        expect(gameState).toBeDefined();
        expect(gameState.deck).toBe(deck);
        expect(gameState.tatami).toEqual([1, 2, 3, 4, 5]);
        expect(gameState.stack).toEqual([6, 7, 8, 9, 10]);
        expect(gameState.playerStates).toHaveLength(2);

        gameState.playerStates.forEach((playerState, index) => {
          expect(playerState.player).toEqual(players[index]);
          expect(playerState.tatami).toEqual([1, 2, 3, 4, 5]);
          expect(playerState.mochiFuda).toEqual([]);
          expect(playerState.score).toBe(0);
        });
      });

      it('should preserve order from StackManager.generate', () => {
        const deck = createMockDeck(8);
        const players = createMockPlayers(2);
        const playMode: PlayMode = 'keyboard';
        const stackRecipe = createMockStackRecipe();

        // Mock specific order from StackManager
        const mockStackOutput = [8, 3, 1, 5, 2, 7, 4, 6];
        generateSpy.mockReturnValue(mockStackOutput);

        const gameState = GameManager.createInitialState(
          deck,
          players,
          playMode,
          stackRecipe,
          4,
        );

        // Order should be preserved from StackManager output
        expect(gameState.tatami).toEqual([8, 3, 1, 5]);
        expect(gameState.stack).toEqual([2, 7, 4, 6]);
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
    });

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
    });

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
          5,
        );

        expect(gameState.tatami).toEqual([1, 2, 3]);
        expect(gameState.stack).toEqual([]);
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
      });
    });
  });

  describe('isGameOver', () => {
    let generateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      generateSpy = vi.spyOn(StackManager, 'generate');
    });

    it('should return false when tatami has cards', () => {
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

      expect(GameManager.isGameOver(gameState)).toBe(false);
    });

    it('should return true when tatami is empty', () => {
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

      // Empty tatami
      gameState.tatami = [];

      expect(GameManager.isGameOver(gameState)).toBe(true);
    });
  });

  describe('pickYomiFuda', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = import.meta.env.VITE_RANDOM_YOMIFUDA;
    });

    afterEach(() => {
      import.meta.env.VITE_RANDOM_YOMIFUDA = originalEnv;
    });

    describe('sequential mode (VITE_RANDOM_YOMIFUDA=false)', () => {
      beforeEach(() => {
        import.meta.env.VITE_RANDOM_YOMIFUDA = 'false';
      });

      it('should return first card from tatami', () => {
        const tatami = [5, 3, 7, 1, 9];
        const cardId = GameManager.pickYomiFuda(tatami);
        expect(cardId).toBe(5);
      });

      it('should return null for empty tatami', () => {
        const tatami: number[] = [];
        const cardId = GameManager.pickYomiFuda(tatami);
        expect(cardId).toBeNull();
      });

      it('should always return same card for same tatami', () => {
        const tatami = [2, 4, 6, 8];
        const cardId1 = GameManager.pickYomiFuda(tatami);
        const cardId2 = GameManager.pickYomiFuda(tatami);
        const cardId3 = GameManager.pickYomiFuda(tatami);

        expect(cardId1).toBe(2);
        expect(cardId2).toBe(2);
        expect(cardId3).toBe(2);
      });
    });

    describe('random mode (VITE_RANDOM_YOMIFUDA=true)', () => {
      beforeEach(() => {
        import.meta.env.VITE_RANDOM_YOMIFUDA = 'true';
      });

      it('should return card from tatami', () => {
        const tatami = [5, 3, 7, 1, 9];
        const cardId = GameManager.pickYomiFuda(tatami);

        expect(cardId).not.toBeNull();
        expect(tatami).toContain(cardId!);
      });

      it('should return null for empty tatami', () => {
        const tatami: number[] = [];
        const cardId = GameManager.pickYomiFuda(tatami);
        expect(cardId).toBeNull();
      });

      it('should return only card for single-card tatami', () => {
        const tatami = [42];
        const cardId = GameManager.pickYomiFuda(tatami);
        expect(cardId).toBe(42);
      });

      it('should potentially return different cards (randomness check)', () => {
        const tatami = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const results = new Set<number>();

        // Pick 50 times, should get variety
        for (let i = 0; i < 50; i++) {
          const cardId = GameManager.pickYomiFuda(tatami);
          if (cardId !== null) {
            results.add(cardId);
          }
        }

        // With 50 picks from 10 cards, we should see multiple different cards
        expect(results.size).toBeGreaterThan(1);
      });
    });
  });

  describe('processCorrectAnswer', () => {
    let generateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      generateSpy = vi.spyOn(StackManager, 'generate');
    });

    it('should remove card from all players tatami', () => {
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

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      expect(newState.playerStates[0].tatami).not.toContain(1);
      expect(newState.playerStates[1].tatami).not.toContain(1);
    });

    it('should add next card from stack to all players tatami', () => {
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

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      expect(newState.playerStates[0].tatami).toContain(6);
      expect(newState.playerStates[1].tatami).toContain(6);
    });

    it('should update correct player mochiFuda and score', () => {
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

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      expect(newState.playerStates[0].mochiFuda).toEqual([1]);
      expect(newState.playerStates[0].score).toBe(1);
      expect(newState.playerStates[1].mochiFuda).toEqual([]);
      expect(newState.playerStates[1].score).toBe(0);
    });

    it('should update shared tatami', () => {
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

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      expect(newState.tatami).not.toContain(1);
      expect(newState.tatami).toContain(6);
      expect(newState.tatami).toEqual([2, 3, 4, 5, 6]);
    });

    it('should handle empty stack gracefully', () => {
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

      expect(gameState.stack).toEqual([]);

      const newState = GameManager.processCorrectAnswer(
        gameState,
        'player-1',
        1,
      );

      expect(newState.playerStates[0].tatami).toHaveLength(4);
      expect(newState.playerStates[1].tatami).toHaveLength(4);
      expect(newState.tatami).toHaveLength(4);
      expect(newState.stack).toEqual([]);
    });
  });

  describe('processIncorrectAnswer', () => {
    let generateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      generateSpy = vi.spyOn(StackManager, 'generate');
    });

    it('should decrease score by 1 for incorrect player', () => {
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

      gameState.playerStates[0].score = 5;
      gameState.playerStates[1].score = 3;

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      expect(newState.playerStates[0].score).toBe(4);
      expect(newState.playerStates[1].score).toBe(3);
    });

    it('should not decrease score below 0', () => {
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

      expect(gameState.playerStates[0].score).toBe(0);

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      expect(newState.playerStates[0].score).toBe(0);
    });

    it('should not modify tatami or mochiFuda', () => {
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

      gameState.playerStates[0].score = 5;
      gameState.playerStates[0].mochiFuda = [1, 2, 3];

      const newState = GameManager.processIncorrectAnswer(
        gameState,
        'player-1',
      );

      expect(newState.playerStates[0].tatami).toEqual(
        gameState.playerStates[0].tatami,
      );
      expect(newState.playerStates[0].mochiFuda).toEqual([1, 2, 3]);
      expect(newState.tatami).toEqual(gameState.tatami);
      expect(newState.stack).toEqual(gameState.stack);
    });
  });
});
