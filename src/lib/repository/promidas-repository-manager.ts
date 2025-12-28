import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { createPromidasForLocal } from '@f88/promidas';
import { toErrorMessage } from '@f88/promidas-utils/builder';
import { parseSnapshotOperationFailure } from '@f88/promidas-utils/repository';
import type { LogLevel } from '@f88/promidas/logger';

import { tokenStorage as defaultTokenStorage } from '@/lib/token-storage';

/**
 * Repository state as a discriminated union
 * Represents the lifecycle of repository creation and token validation
 *
 * States:
 * - `not-created`: No repository instance exists, token not validated yet
 * - `validating`: Repository instance exists, token validation in progress
 * - `created-token-valid`: Repository created and token validated successfully
 * - `token-invalid`: Token validation failed with error details
 */
export type RepositoryState =
  | { type: 'not-created' }
  | { type: 'validating' }
  | { type: 'created-token-valid'; repository: ProtopediaInMemoryRepository }
  | { type: 'token-invalid'; error: string };

/**
 * Manages Promidas repository singleton instance with token validation
 *
 * Primary Responsibility: Provide a valid ProtopediaInMemoryRepository instance
 *
 * This class ensures only one repository instance exists and manages token validation
 * state internally. Token validation is performed automatically when needed.
 *
 * Features:
 * - Singleton management of repository instance
 * - Token validation state management
 * - Request deduplication for concurrent getRepository calls
 * - Dependency injection support for token storage
 *
 * Public API:
 * - getState(): Get current repository state (4 states)
 * - reset(): Clear repository and reset state
 * - getRepository(): Get or create validated repository instance
 *
 * Internal Implementation:
 * - Uses 2-axis state model (repository existence + token validation status)
 * - Exposes 4-state discriminated union externally (not-created/validating/created-token-valid/token-invalid)
 * - Validates tokens using setupSnapshot({ limit: 0 }) for minimal API verification
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
   * Creates a new PromidasRepositoryManager instance
   *
   * @param storage - Token storage implementation for retrieving API tokens.
   *                  Defaults to sessionStorage-based token storage.
   *                  Can be injected for testing purposes.
   */
  private constructor(storage = defaultTokenStorage) {
    this.storage = storage;
  }

  /**
   * Gets the singleton instance of PromidasRepositoryManager
   *
   * @param storage - Optional token storage implementation (only used on first call)
   * @returns The singleton instance
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
   * Get the current repository state as a discriminated union
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
        // Token validation is in progress
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
   * Clears the repository instance, validation state, error messages,
   * and any pending initialization promises.
   *
   * Call this when:
   * - Token is removed or changed
   * - Forcing re-validation of the repository
   * - Cleaning up the manager state
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
   * Reset singleton instance (for testing only)
   * @internal
   */
  static resetInstance(): void {
    PromidasRepositoryManager.instance = null;
  }

  /**
   * Create repository instance with token
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
   * Validate repository by calling setupSnapshot with limit:0
   * This is for token verification only, not for data initialization
   * @private
   */
  private async validateRepository(
    repo: ProtopediaInMemoryRepository,
  ): Promise<
    Awaited<ReturnType<ProtopediaInMemoryRepository['setupSnapshot']>>
  > {
    return await repo.setupSnapshot({ limit: 0 });
  }

  /**
   * Get the repository instance
   *
   * Returns a cached repository if already validated, otherwise retrieves token
   * from storage, creates repository, and validates it.
   *
   * Request deduplication: Concurrent calls to this method will receive the
   * same Promise, preventing duplicate initialization and API calls.
   *
   * Validation process:
   * 1. Check if repository is already valid (returns cached instance)
   * 2. Check if initialization is in progress (returns existing promise)
   * 3. Retrieve token from storage
   * 4. Create repository instance
   * 5. Validate token with minimal API call (setupSnapshot with limit: 0)
   * 6. Update state and return repository
   *
   * Note: Token validation is done with setupSnapshot({ limit: 0 }), so the repository
   * is ready to use but contains no data. Callers should call setupSnapshot() with
   * appropriate limit when they need actual prototype data.
   *
   * @returns Validated Promidas repository instance ready for data loading
   * @throws Error if token is missing, empty, or validation fails
   * @throws Error if repository creation fails
   * @throws Error if API token is invalid or API is unreachable
   */
  async getRepository(): Promise<ProtopediaInMemoryRepository> {
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
 * Gets the singleton instance of PromidasRepositoryManager
 *
 * @returns The singleton manager instance
 */
export function getPromidasRepositoryManager(): PromidasRepositoryManager {
  return PromidasRepositoryManager.getInstance();
}
