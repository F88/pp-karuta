import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromidasRepositoryManager } from './promidas-repository-manager';
import type {
  ProtopediaInMemoryRepository,
  PrototypeInMemoryStats,
} from '@f88/promidas';
import type { tokenStorage } from '@/lib/token-storage';

type TokenStorage = typeof tokenStorage;

// Mock the promidas module
vi.mock('@f88/promidas', () => ({
  createPromidasForLocal: vi.fn(),
}));

// Mock promidas-utils repository module
vi.mock('@f88/promidas-utils/repository', () => ({
  parseSnapshotOperationFailure: vi.fn((failure) => ({
    ...failure,
    localizedMessage: failure.message || 'スナップショット操作に失敗しました。',
  })),
}));

// Mock promidas-utils builder module
vi.mock('@f88/promidas-utils/builder', () => ({
  toErrorMessage: vi.fn((err) => String(err)),
}));

const mockStats: PrototypeInMemoryStats = {
  size: 0,
  cachedAt: new Date(),
  isExpired: false,
  remainingTtlMs: 0,
  dataSizeBytes: 0,
  refreshInFlight: false,
};

const mockSuccessResult = {
  ok: true as const,
  stats: mockStats,
};

const mockFailureResult = (message: string) => ({
  ok: false as const,
  origin: 'unknown' as const,
  message,
});

interface MockTokenStorage {
  get: ReturnType<typeof vi.fn>;
  has: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  key: string;
}

describe('PromidasRepositoryManager', () => {
  let manager: PromidasRepositoryManager;
  let mockStorage: MockTokenStorage;
  let mockRepository: ProtopediaInMemoryRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock storage
    mockStorage = {
      get: vi.fn(),
      has: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
      key: 'mock-key',
    };

    // Create mock repository
    mockRepository = {
      setupSnapshot: vi.fn(),
    } as unknown as ProtopediaInMemoryRepository;

    // Reset singleton instance for testing
    PromidasRepositoryManager.resetInstance();
    manager = PromidasRepositoryManager.getInstance(
      mockStorage as unknown as TokenStorage,
    );
  });

  describe('getState', () => {
    it('returns not-created when no repository exists', () => {
      const state = manager.getState();
      expect(state).toEqual({ type: 'not-created' });
    });

    it('returns token-invalid when token validation fails', async () => {
      mockStorage.get.mockResolvedValue('invalid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      try {
        await manager.getRepository();
      } catch {
        // Expected to throw
      }

      const state = manager.getState();
      expect(state.type).toBe('token-invalid');
      if (state.type === 'token-invalid') {
        expect(state.error).toContain('Invalid token');
      }
    });
  });

  describe('reset', () => {
    it('clears all state', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      await manager.getRepository();
      expect(manager.getState().type).toBe('created-token-valid');

      manager.reset();
      expect(manager.getState().type).toBe('not-created');
    });
  });

  describe('getRepository', () => {
    it('throws error when token is missing', async () => {
      mockStorage.get.mockResolvedValue(null);

      await expect(manager.getRepository()).rejects.toThrow(
        'ProtoPedia API token is missing',
      );
    });

    it('throws error when token is empty', async () => {
      mockStorage.get.mockResolvedValue('   ');

      await expect(manager.getRepository()).rejects.toThrow('Token is empty');
    });

    it('creates and validates repository successfully', async () => {
      const originalEnv = import.meta.env.VITE_PROMIDAS_LOG_LEVEL;
      import.meta.env.VITE_PROMIDAS_LOG_LEVEL = 'info';

      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      const repo = await manager.getRepository();

      expect(repo).toBe(mockRepository);
      expect(createPromidasForLocal).toHaveBeenCalledWith({
        protopediaApiToken: 'valid-token',
        logLevel: 'info',
      });
      expect(mockRepository.setupSnapshot).toHaveBeenCalledWith({ limit: 0 });

      import.meta.env.VITE_PROMIDAS_LOG_LEVEL = originalEnv;
    });

    it('returns cached repository on subsequent calls', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      const repo1 = await manager.getRepository();
      const repo2 = await manager.getRepository();

      expect(repo1).toBe(repo2);
      expect(createPromidasForLocal).toHaveBeenCalledTimes(1);
      expect(mockRepository.setupSnapshot).toHaveBeenCalledTimes(1);
    });

    it('handles concurrent calls with request deduplication', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      const [repo1, repo2, repo3] = await Promise.all([
        manager.getRepository(),
        manager.getRepository(),
        manager.getRepository(),
      ]);

      expect(repo1).toBe(repo2);
      expect(repo2).toBe(repo3);
      expect(createPromidasForLocal).toHaveBeenCalledTimes(1);
      expect(mockRepository.setupSnapshot).toHaveBeenCalledTimes(1);
    });

    it('throws error when repository creation fails', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockImplementation(() => {
        throw new Error('Configuration error');
      });

      await expect(manager.getRepository()).rejects.toThrow(
        'Configuration error',
      );

      const state = manager.getState();
      expect(state.type).toBe('token-invalid');
    });

    it('throws error when token validation fails', async () => {
      mockStorage.get.mockResolvedValue('invalid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockFailureResult('Authentication failed'),
      );

      await expect(manager.getRepository()).rejects.toThrow();

      const state = manager.getState();
      expect(state.type).toBe('token-invalid');
    });

    it('allows retry after failed validation', async () => {
      mockStorage.get.mockResolvedValue('invalid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);

      // First call fails
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockFailureResult('Authentication failed'),
      );

      await expect(manager.getRepository()).rejects.toThrow();

      // Reset and try again with valid token
      manager.reset();
      mockStorage.get.mockResolvedValue('valid-token');
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockSuccessResult,
      );

      const repo = await manager.getRepository();
      expect(repo).toBe(mockRepository);
    });

    it('uses VITE_PROMIDAS_LOG_LEVEL environment variable', async () => {
      const originalEnv = import.meta.env.VITE_PROMIDAS_LOG_LEVEL;
      import.meta.env.VITE_PROMIDAS_LOG_LEVEL = 'debug';

      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      await manager.getRepository();

      expect(createPromidasForLocal).toHaveBeenCalledWith({
        protopediaApiToken: 'valid-token',
        logLevel: 'debug',
      });

      import.meta.env.VITE_PROMIDAS_LOG_LEVEL = originalEnv;
    });
  });

  describe('state transitions', () => {
    it('transitions through states correctly during successful initialization', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      expect(manager.getState().type).toBe('not-created');

      const repoPromise = manager.getRepository();
      expect(manager.getState().type).toBe('not-created'); // Still not-created during validation

      await repoPromise;
      expect(manager.getState().type).toBe('created-token-valid');
    });

    it('transitions to token-invalid on validation failure', async () => {
      mockStorage.get.mockResolvedValue('invalid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockFailureResult('Invalid token'),
      );

      expect(manager.getState().type).toBe('not-created');

      try {
        await manager.getRepository();
      } catch {
        // Expected
      }

      expect(manager.getState().type).toBe('token-invalid');
    });
  });

  describe('edge cases and error recovery', () => {
    it('handles reset during ongoing initialization', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);

      let resolveSetup: (value: unknown) => void;
      const setupPromise = new Promise((resolve) => {
        resolveSetup = resolve;
      });
      vi.mocked(mockRepository.setupSnapshot).mockReturnValue(
        setupPromise as Promise<
          Awaited<ReturnType<typeof mockRepository.setupSnapshot>>
        >,
      );

      const repoPromise = manager.getRepository();

      // Reset while initialization is in progress
      manager.reset();

      // Resolve the setup promise after reset
      resolveSetup!({ ok: true, cachedAt: new Date() });
      await repoPromise;

      // After reset, the singleton instance is the same, but state should be reset
      expect(manager.getState().type).toBe('not-created');
    });

    it('allows new initialization after reset during ongoing operation', async () => {
      mockStorage.get.mockResolvedValue('token1');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);

      let resolveSetup: (value: unknown) => void;
      const setupPromise = new Promise((resolve) => {
        resolveSetup = resolve;
      });
      vi.mocked(mockRepository.setupSnapshot).mockReturnValueOnce(
        setupPromise as Promise<
          Awaited<ReturnType<typeof mockRepository.setupSnapshot>>
        >,
      );

      const firstPromise = manager.getRepository();
      manager.reset();

      // Get new instance and start new initialization with different token
      const newManager = PromidasRepositoryManager.getInstance(
        mockStorage as unknown as TokenStorage,
      );
      mockStorage.get.mockResolvedValue('token2');
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockSuccessResult,
      );

      const secondPromise = newManager.getRepository();

      // Resolve first promise
      resolveSetup!({ ok: true, cachedAt: new Date() });
      await firstPromise;
      const repo = await secondPromise;

      expect(repo).toBe(mockRepository);
      expect(createPromidasForLocal).toHaveBeenCalledTimes(2);
    });

    it('handles multiple sequential failures', async () => {
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);

      // First failure
      mockStorage.get.mockResolvedValue('token1');
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockFailureResult('Error 1'),
      );
      await expect(manager.getRepository()).rejects.toThrow();

      manager.reset();

      // Second failure
      mockStorage.get.mockResolvedValue('token2');
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockFailureResult('Error 2'),
      );
      await expect(manager.getRepository()).rejects.toThrow();

      manager.reset();

      // Success
      mockStorage.get.mockResolvedValue('token3');
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockSuccessResult,
      );
      const repo = await manager.getRepository();

      expect(repo).toBe(mockRepository);
      expect(manager.getState().type).toBe('created-token-valid');
    });

    it('preserves error state after failed initialization', async () => {
      mockStorage.get.mockResolvedValue('invalid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockFailureResult('Custom error message'),
      );

      await expect(manager.getRepository()).rejects.toThrow();

      const state = manager.getState();
      expect(state.type).toBe('token-invalid');
      if (state.type === 'token-invalid') {
        expect(state.error).toContain('Custom error message');
      }

      // Error state persists across getState calls
      const state2 = manager.getState();
      expect(state2).toEqual(state);
    });

    it('handles storage get throwing error', async () => {
      mockStorage.get.mockRejectedValue(new Error('Storage error'));

      await expect(manager.getRepository()).rejects.toThrow('Storage error');
    });

    it('handles token with only whitespace characters', async () => {
      mockStorage.get.mockResolvedValue('\t\n\r  ');

      await expect(manager.getRepository()).rejects.toThrow('Token is empty');

      const state = manager.getState();
      expect(state.type).toBe('token-invalid');
    });

    it('clears initPromise on successful completion', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      await manager.getRepository();

      // Second call should return cached repository, not reuse promise
      vi.mocked(createPromidasForLocal).mockClear();
      vi.mocked(mockRepository.setupSnapshot).mockClear();

      await manager.getRepository();

      expect(createPromidasForLocal).not.toHaveBeenCalled();
      expect(mockRepository.setupSnapshot).not.toHaveBeenCalled();
    });

    it('clears initPromise on failure', async () => {
      const { createPromidasForLocal } = await import('@f88/promidas');

      // First failure
      mockStorage.get.mockResolvedValue('bad-token');
      vi.mocked(createPromidasForLocal).mockImplementationOnce(() => {
        throw new Error('Error 1');
      });
      await expect(manager.getRepository()).rejects.toThrow('Error 1');

      manager.reset();

      // Second attempt should create new promise
      mockStorage.get.mockResolvedValue('good-token');
      vi.mocked(createPromidasForLocal).mockReturnValueOnce(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValueOnce(
        mockSuccessResult,
      );

      const repo = await manager.getRepository();
      expect(repo).toBe(mockRepository);
    });
  });

  describe('environment configuration', () => {
    it('defaults to info log level when env var is not set', async () => {
      const originalEnv = import.meta.env.VITE_PROMIDAS_LOG_LEVEL;
      delete import.meta.env.VITE_PROMIDAS_LOG_LEVEL;

      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      await manager.getRepository();

      expect(createPromidasForLocal).toHaveBeenCalledWith({
        protopediaApiToken: 'valid-token',
        logLevel: 'info',
      });

      import.meta.env.VITE_PROMIDAS_LOG_LEVEL = originalEnv;
    });

    it('respects different log levels', async () => {
      const logLevels = ['error', 'warn', 'info', 'debug'] as const;

      for (const level of logLevels) {
        vi.clearAllMocks();
        manager.reset();
        const testManager = PromidasRepositoryManager.getInstance(
          mockStorage as unknown as TokenStorage,
        );

        import.meta.env.VITE_PROMIDAS_LOG_LEVEL = level;
        mockStorage.get.mockResolvedValue('valid-token');
        const { createPromidasForLocal } = await import('@f88/promidas');
        vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
        vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
          mockSuccessResult,
        );

        await testManager.getRepository();

        expect(createPromidasForLocal).toHaveBeenCalledWith({
          protopediaApiToken: 'valid-token',
          logLevel: level,
        });
      }
    });
  });

  describe('getState consistency', () => {
    it('returns consistent state object reference when unchanged', () => {
      const state1 = manager.getState();
      const state2 = manager.getState();

      // While they may not be the same reference, they should be deeply equal
      expect(state1).toEqual(state2);
    });

    it('returns created-token-valid with repository after successful init', async () => {
      mockStorage.get.mockResolvedValue('valid-token');
      const { createPromidasForLocal } = await import('@f88/promidas');
      vi.mocked(createPromidasForLocal).mockReturnValue(mockRepository);
      vi.mocked(mockRepository.setupSnapshot).mockResolvedValue(
        mockSuccessResult,
      );

      await manager.getRepository();

      const state = manager.getState();
      expect(state.type).toBe('created-token-valid');
      if (state.type === 'created-token-valid') {
        expect(state.repository).toBe(mockRepository);
      }
    });
  });
});
