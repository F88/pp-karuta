/**
 * @fileoverview Singleton manager for PROMIDAS repository lifecycle and token validation.
 *
 * Provides centralized management of ProtopediaInMemoryRepository instance with comprehensive
 * token validation state tracking. Supports both production API mode and development dummy data mode.
 *
 * Key Features:
 * - Singleton pattern ensuring only one repository instance exists
 * - Four-state lifecycle management (not-created → validating → created-token-valid/token-invalid)
 * - Automatic token validation using minimal API calls
 * - Request deduplication for concurrent repository access
 * - Dummy data mode support via VITE_USE_DUMMY_DATA environment variable
 * - Dependency injection for token storage (testability)
 *
 * State Machine:
 * ```
 * not-created → validating → created-token-valid
 *                         ↘ token-invalid
 * ```
 *
 * Usage:
 * ```typescript
 * const manager = getPromidasRepositoryManager();
 * const state = manager.getState();
 *
 * if (state.type === 'created-token-valid') {
 *   const repo = state.repository;
 *   // Use repository for data operations
 * }
 * ```
 *
 * @module PromidasRepositoryManager
 */

import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { createPromidasForLocal } from '@f88/promidas';
import { toErrorMessage } from '@f88/promidas-utils/builder';
import { parseSnapshotOperationFailure } from '@f88/promidas-utils/repository';
import type { LogLevel } from '@f88/promidas/logger';
import type { SnapshotOperationResult } from '@f88/promidas/repository';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';

import { tokenStorage as defaultTokenStorage } from '@/lib/token-storage';
import { createDummyRepository } from './dummy-repository';

/**
 * Repository state as a discriminated union.
 *
 * Represents the complete lifecycle of repository creation and token validation
 * using TypeScript discriminated unions for type-safe state handling.
 *
 * @typedef {Object} RepositoryState
 *
 * State Transitions:
 * - `not-created`: Initial state - no repository instance, token not validated
 * - `validating`: Repository instance created, token validation in progress
 * - `created-token-valid`: Repository created and token validated successfully
 * - `token-invalid`: Token validation failed with localized error message
 *
 * @example
 * ```typescript
 * const state = manager.getState();
 *
 * switch (state.type) {
 *   case 'not-created':
 *     console.log('Repository not initialized');
 *     break;
 *   case 'validating':
 *     console.log('Token validation in progress...');
 *     break;
 *   case 'created-token-valid':
 *     const repo = state.repository; // Type-safe access
 *     break;
 *   case 'token-invalid':
 *     console.error('Token error:', state.error);
 *     break;
 * }
 * ```
 */
export type RepositoryState =
  | { type: 'not-created' }
  | { type: 'validating' }
  | { type: 'created-token-valid'; repository: ProtopediaInMemoryRepository }
  | { type: 'token-invalid'; error: string };

/**
 * Singleton manager for PROMIDAS repository lifecycle with comprehensive token validation.
 *
 * Primary Responsibility:
 * Provide a single, validated ProtopediaInMemoryRepository instance throughout the application lifecycle.
 *
 * Architecture:
 * - **Singleton Pattern**: Ensures only one repository instance exists globally
 * - **State Machine**: Manages 4-state lifecycle (not-created → validating → created-token-valid/token-invalid)
 * - **Dual Mode Support**: Seamlessly switches between real API and dummy data modes
 * - **Request Deduplication**: Prevents multiple concurrent initialization attempts
 *
 * Features:
 * - **Token Validation**: Validates API tokens using minimal setupSnapshot({ limit: 0 }) calls
 * - **Dummy Mode**: Development mode with auto-generated test data (VITE_USE_DUMMY_DATA=true)
 * - **Dependency Injection**: Supports custom token storage for testing
 * - **Error Handling**: Provides localized error messages for token validation failures
 * - **Type Safety**: Uses discriminated unions for compile-time state verification
 *
 * Public API:
 * - `getState()`: Returns current repository state as discriminated union
 * - `reset()`: Clears repository and resets to not-created state
 * - `getRepository()`: Gets or creates validated repository instance
 * - `setupSnapshot()`: Prepares repository snapshot with API parameters
 *
 * Internal State Model:
 * ```
 * 2-Axis State Space:
 * - Axis 1: repository existence (null | instance)
 * - Axis 2: tokenStatus (not-validated | valid | invalid)
 *
 * Exposed as 4-State Union:
 * - not-created: repository=null, tokenStatus=not-validated
 * - validating: repository=instance, tokenStatus=not-validated
 * - created-token-valid: repository=instance, tokenStatus=valid
 * - token-invalid: tokenStatus=invalid (repository may be null)
 * ```
 *
 * Mode Behaviors:
 * - **Dummy Mode**: Creates DummyRepository, sets tokenStatus='valid' immediately
 * - **Normal Mode**: Creates real repository, validates via setupSnapshot({ limit: 0 })
 *
 * @example Basic Usage
 * ```typescript
 * const manager = PromidasRepositoryManager.getInstance();
 * const repo = await manager.getRepository(); // Validates token automatically
 * await manager.setupSnapshot(repo, { offset: 0, limit: 100 });
 * const prototypes = await repo.getAllFromSnapshot();
 * ```
 *
 * @example State Monitoring
 * ```typescript
 * const state = manager.getState();
 * if (state.type === 'created-token-valid') {
 *   console.log('Repository ready:', state.repository);
 * } else if (state.type === 'token-invalid') {
 *   console.error('Token error:', state.error);
 * }
 * ```
 */
export class PromidasRepositoryManager {
  private static instance: PromidasRepositoryManager | null = null;

  private repository: ProtopediaInMemoryRepository | null = null;
  private tokenStatus: 'not-validated' | 'valid' | 'invalid' = 'not-validated';
  private error: string | null = null;
  private initPromise: Promise<ProtopediaInMemoryRepository> | null = null;
  private initPromiseId = 0;
  private storage: typeof defaultTokenStorage;

  /**
   * Creates a new PromidasRepositoryManager instance.
   *
   * This constructor is private to enforce the singleton pattern.
   * Use `getInstance()` to obtain the singleton instance.
   *
   * @param storage - Token storage implementation for retrieving API tokens.
   *                  Defaults to sessionStorage-based token storage.
   *                  Can be injected for testing purposes to mock token retrieval.
   *
   * @private
   */
  private constructor(storage = defaultTokenStorage) {
    this.storage = storage;
  }

  /**
   * Gets the singleton instance of PromidasRepositoryManager.
   *
   * Creates the instance on first call and returns the cached instance on subsequent calls.
   * The storage parameter is only used during the initial instance creation.
   *
   * @param storage - Optional token storage implementation (only used on first call).
   *                  Subsequent calls ignore this parameter and return the existing instance.
   * @returns The singleton PromidasRepositoryManager instance
   *
   * @example
   * ```typescript
   * const manager = PromidasRepositoryManager.getInstance();
   * const state = manager.getState();
   * ```
   */
  static getInstance(
    storage: typeof defaultTokenStorage = defaultTokenStorage,
  ): PromidasRepositoryManager {
    if (!PromidasRepositoryManager.instance) {
      PromidasRepositoryManager.instance = new PromidasRepositoryManager(
        storage,
      );
    }
    return PromidasRepositoryManager.instance;
  }

  /**
   * Checks if dummy data mode is enabled.
   *
   * Dummy mode is activated by setting the VITE_USE_DUMMY_DATA environment variable to 'true'.
   * In dummy mode, the manager creates a DummyRepository with auto-generated test data
   * instead of connecting to the real ProtoPedia API.
   *
   * @returns `true` if VITE_USE_DUMMY_DATA environment variable equals 'true', `false` otherwise
   * @private
   */
  private isDummyMode(): boolean {
    return import.meta.env.VITE_USE_DUMMY_DATA === 'true';
  }

  /**
   * Get the current repository state as a discriminated union
   *
   * Works for both dummy mode and normal mode. State is determined by
   * internal repository existence and tokenStatus fields.
   *
   * State determination based on internal state:
   * - `repository === null && tokenStatus === 'not-validated'` → `not-created`
   * - `repository !== null && tokenStatus === 'not-validated'` → `validating`
   * - `repository !== null && tokenStatus === 'valid'` → `created-token-valid`
   * - `tokenStatus === 'invalid'` → `token-invalid`
   *
   * Repository instance is only returned when token validation is complete and successful.
   *
   * @returns Current repository state (4 possible states)
   */
  getState(): RepositoryState {
    if (!this.repository) {
      if (this.tokenStatus === 'invalid') {
        return {
          type: 'token-invalid',
          error: this.error || 'Unknown error',
        };
      }
      return { type: 'not-created' };
    }

    switch (this.tokenStatus) {
      case 'not-validated':
        return { type: 'validating' };
      case 'valid':
        return {
          type: 'created-token-valid',
          repository: this.repository,
        };
      case 'invalid':
        return {
          type: 'token-invalid',
          error: this.error || 'Unknown error',
        };
    }
  }

  /**
   * Reset repository state to not-created
   *
   * Clears the repository instance (dummy or normal), validation state, error messages,
   * and any pending initialization promises.
   *
   * Call this when:
   * - Token is removed or changed
   * - Forcing re-validation of the repository
   * - Cleaning up the manager state
   * - Switching between dummy and normal modes
   *
   * Warning: If getRepository() is currently executing, results from that
   * operation will be discarded by the finally block. Consider awaiting
   * pending operations before calling reset() in production code.
   */
  reset(): void {
    this.repository = null;
    this.tokenStatus = 'not-validated';
    this.error = null;
    this.initPromise = null;
    this.initPromiseId++;
  }

  /**
   * Resets the singleton instance to null.
   *
   * **Warning**: This method is intended for testing purposes only.
   * Do not use in production code as it breaks the singleton pattern.
   *
   * Use this in test cleanup to ensure each test starts with a fresh instance:
   * ```typescript
   * afterEach(() => {
   *   PromidasRepositoryManager.resetInstance();
   * });
   * ```
   *
   * @internal
   */
  static resetInstance(): void {
    PromidasRepositoryManager.instance = null;
  }

  /**
   * Creates a ProtopediaInMemoryRepository instance with the provided API token.
   *
   * Configures the repository with the log level from VITE_PROMIDAS_LOG_LEVEL
   * environment variable (defaults to 'info' if not set).
   *
   * @param token - ProtoPedia API token for authentication
   * @returns Newly created ProtopediaInMemoryRepository instance
   * @private
   */
  private createRepository(token: string): ProtopediaInMemoryRepository {
    const logLevel: LogLevel =
      import.meta.env.VITE_PROMIDAS_LOG_LEVEL || 'info';

    return createPromidasForLocal({
      protopediaApiToken: token,
      logLevel,
    });
  }

  /**
   * Sets up repository snapshot with specified API parameters.
   *
   * Prepares the repository snapshot using the provided parameters but does not
   * fetch the actual prototype data. After successful snapshot setup, call
   * `repository.getAllFromSnapshot()` to retrieve the prototypes.
   *
   * This is a convenience wrapper around `repository.setupSnapshot()` that provides
   * a unified interface consistent with the manager's API.
   *
   * @param repo - Repository instance to configure
   * @param params - API parameters controlling data retrieval (offset, limit, filters, etc.)
   * @returns Promise resolving to SnapshotOperationResult with success status and statistics
   *
   * @example
   * ```typescript
   * const manager = PromidasRepositoryManager.getInstance();
   * const repo = await manager.getRepository();
   * const result = await manager.setupSnapshot(repo, { offset: 0, limit: 100 });
   *
   * if (result.ok) {
   *   const prototypes = await repo.getAllFromSnapshot();
   *   console.log(`Loaded ${prototypes.length} prototypes`);
   * }
   * ```
   */
  async setupSnapshot(
    repo: ProtopediaInMemoryRepository,
    params: ListPrototypesParams,
  ): Promise<SnapshotOperationResult> {
    return await repo.setupSnapshot(params);
  }

  /**
   * Validates repository token by performing a minimal API call.
   *
   * Calls `setupSnapshot({ limit: 0 })` to verify token validity without
   * fetching actual prototype data. This minimal API call is sufficient to
   * confirm the token is valid and the API is reachable.
   *
   * **Important**: This method directly uses the repository to avoid circular
   * dependency with `getRepository()`. The repository instance is passed as
   * a parameter rather than using the instance field.
   *
   * @param repo - Repository instance to validate
   * @returns Promise resolving to SnapshotOperationResult indicating validation success/failure
   * @private
   */
  private async validateRepository(
    repo: ProtopediaInMemoryRepository,
  ): Promise<SnapshotOperationResult> {
    return await repo.setupSnapshot({ limit: 0 });
  }

  /**
   * Gets or creates a dummy repository for development mode.
   *
   * Creates a DummyRepository instance with auto-generated test data and updates
   * internal state to integrate with the unified state management system.
   *
   * Behavior:
   * - First call: Creates DummyRepository, sets `this.repository` and `this.tokenStatus = 'valid'`
   * - Subsequent calls: Returns cached `this.repository` instance
   *
   * State Updates:
   * - `this.repository`: Set to DummyRepository instance
   * - `this.tokenStatus`: Set to 'valid' (dummy mode skips token validation)
   *
   * **Note**: Dummy mode doesn't require token validation as it uses local test data.
   *
   * @returns Cached or newly created DummyRepository instance
   * @private
   */
  private getDummyRepository(): ProtopediaInMemoryRepository {
    if (!this.repository) {
      this.repository = createDummyRepository();
      this.tokenStatus = 'valid';
      console.info(
        '[PromidasRepositoryManager] Created dummy repository (VITE_USE_DUMMY_DATA=true)',
      );
    }
    return this.repository;
  }

  /**
   * Gets or creates a validated repository instance.
   *
   * Returns a cached repository if already validated, otherwise retrieves the token
   * from storage, creates a repository, and validates it through a minimal API call.
   *
   * Mode Determination:
   * - **Dummy Mode** (VITE_USE_DUMMY_DATA=true): Returns DummyRepository with test data
   * - **Normal Mode**: Creates real repository and validates token via ProtoPedia API
   *
   * Request Deduplication:
   * Concurrent calls to this method receive the same Promise, preventing duplicate
   * initialization attempts and redundant API calls. The `initPromise` field caches
   * the ongoing operation.
   *
   * Dummy Mode Process:
   * 1. Check if dummy repository exists → return cached instance
   * 2. Create DummyRepository and set `tokenStatus = 'valid'`
   * 3. Return repository immediately (no API validation needed)
   *
   * Normal Mode Process:
   * 1. Check if repository is valid → return cached instance
   * 2. Check if initialization is in progress → return existing promise
   * 3. Retrieve token from storage (throws if missing)
   * 4. Create repository instance with token
   * 5. Validate token using `setupSnapshot({ limit: 0 })` (minimal API call)
   * 6. Update state to 'valid' and return repository
   *
   * State Synchronization:
   * Uses `initPromiseId` to detect concurrent reset() calls. If reset() is called
   * during initialization, state updates are skipped for that operation (the finally
   * block will discard results).
   *
   * **Important**: In normal mode, token validation uses `setupSnapshot({ limit: 0 })`,
   * so the returned repository is validated but contains no prototype data. Callers must
   * call `setupSnapshot()` with appropriate parameters to load actual data.
   *
   * @returns Promise resolving to validated ProtopediaInMemoryRepository instance
   * @throws {Error} If token is missing or empty (normal mode only)
   * @throws {Error} If repository creation fails (normal mode only)
   * @throws {Error} If API token is invalid or API is unreachable (normal mode only)
   *
   * @example Basic Usage
   * ```typescript
   * const manager = PromidasRepositoryManager.getInstance();
   * const repo = await manager.getRepository(); // Validates token automatically
   * await manager.setupSnapshot(repo, { offset: 0, limit: 100 });
   * const prototypes = await repo.getAllFromSnapshot();
   * ```
   *
   * @example Error Handling
   * ```typescript
   * try {
   *   const repo = await manager.getRepository();
   *   console.log('Repository ready');
   * } catch (error) {
   *   console.error('Repository initialization failed:', error.message);
   *   // Handle token errors, API failures, etc.
   * }
   * ```
   *
   * @example Concurrent Calls (Request Deduplication)
   * ```typescript
   * // Multiple concurrent calls receive the same Promise
   * const [repo1, repo2, repo3] = await Promise.all([
   *   manager.getRepository(),
   *   manager.getRepository(),
   *   manager.getRepository(),
   * ]);
   * // Only one API validation call is made
   * console.log(repo1 === repo2 && repo2 === repo3); // true
   * ```
   */

  async getRepository(): Promise<ProtopediaInMemoryRepository> {
    if (this.isDummyMode()) {
      return this.getDummyRepository();
    }

    const state = this.getState();

    // Return cached repository if already valid
    if (state.type === 'created-token-valid') {
      return state.repository;
    }

    // Return existing promise if initialization is in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    const promiseId = this.initPromiseId;
    this.initPromise = (async () => {
      try {
        // Retrieve token from storage
        const token = await this.storage.get();
        if (!token) {
          throw new Error(
            'ProtoPedia API token is missing. Provide a token via the in-app Token UI.',
          );
        }

        if (token.trim() === '') {
          this.repository = null;
          this.tokenStatus = 'invalid';
          this.error = 'Token is empty';
          throw new Error('Token is empty');
        }

        let repo: ProtopediaInMemoryRepository;

        // Step 1: Create repository instance
        try {
          repo = this.createRepository(token);
          // Only update state if not reset during operation
          if (this.initPromiseId === promiseId) {
            this.repository = repo;
            this.tokenStatus = 'not-validated';
            this.error = null;
          }
        } catch (err) {
          console.error('Failed to create Promidas repository:', err);
          const errorMessage =
            err instanceof Error
              ? toErrorMessage(err)
              : '不明なエラーが発生しました。';
          if (this.initPromiseId === promiseId) {
            this.repository = null;
            this.tokenStatus = 'invalid';
            this.error = errorMessage;
          }
          throw new Error(errorMessage);
        }

        // Step 2: Validate token by testing API access
        const result = await this.validateRepository(repo);
        if (!result.ok) {
          console.error('Token validation failed:', result);
          const parsed = parseSnapshotOperationFailure(result);
          const errorMessage =
            parsed?.localizedMessage || '不明なエラーが発生しました。';
          console.info('Parsed token validation error:', errorMessage);
          if (this.initPromiseId === promiseId) {
            this.repository = null;
            this.tokenStatus = 'invalid';
            this.error = errorMessage;
          }
          throw new Error(errorMessage);
        }

        // Token is valid - only update state if not reset during operation
        if (this.initPromiseId === promiseId) {
          this.tokenStatus = 'valid';
          this.error = null;
        }
        return repo;
      } finally {
        // Only clear initPromise if it's still the current one
        if (this.initPromiseId === promiseId) {
          this.initPromise = null;
        }
      }
    })();

    return this.initPromise;
  }
}

/**
 * Gets the singleton instance of PromidasRepositoryManager.
 *
 * This is a convenience function that wraps `PromidasRepositoryManager.getInstance()`.
 * Use this function for accessing the manager throughout the application.
 *
 * @returns The singleton PromidasRepositoryManager instance
 *
 * @example
 * ```typescript
 * import { getPromidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';
 *
 * const manager = getPromidasRepositoryManager();
 * const state = manager.getState();
 * ```
 */
export function getPromidasRepositoryManager(): PromidasRepositoryManager {
  return PromidasRepositoryManager.getInstance();
}

/**
 * Pre-initialized singleton instance of PromidasRepositoryManager.
 *
 * This is the recommended way to access the repository manager throughout
 * the application. The instance is created at module load time and cached.
 *
 * @example
 * ```typescript
 * import { promidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';
 *
 * async function loadData() {
 *   const repo = await promidasRepositoryManager.getRepository();
 *   await promidasRepositoryManager.setupSnapshot(repo, { offset: 0, limit: 100 });
 *   const prototypes = await repo.getAllFromSnapshot();
 *   return prototypes;
 * }
 * ```
 */
export const promidasRepositoryManager = getPromidasRepositoryManager();
