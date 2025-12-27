import { createPromidasForLocal } from '@f88/promidas';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import type { LogLevel } from '@f88/promidas/logger';
import { tokenStorage as defaultTokenStorage } from '@/lib/token-storage';
import {
  parsePromidasRepositoryInitError,
  parseSnapshotFailure,
} from './error-utils';

/**
 * Repository state as a discriminated union
 * Represents the lifecycle of repository creation and token validation
 */
export type RepositoryState =
  | { type: 'not-created' }
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
 * - getState(): Get current repository state (3 states)
 * - reset(): Clear repository and reset state
 * - getRepository(): Get or create validated repository instance
 *
 * Internal Implementation:
 * - Uses 2-axis state model (repository existence + token validation status)
 * - Exposes 3-state discriminated union externally (not-created/created-token-valid/token-invalid)
 * - Validates tokens using setupSnapshot({ limit: 0 }) for minimal API verification
 */
export class PromidasRepositoryManager {
  private repository: ProtopediaInMemoryRepository | null = null;
  private tokenStatus: 'not-validated' | 'valid' | 'invalid' = 'not-validated';
  private error: string | null = null;
  private initPromise: Promise<ProtopediaInMemoryRepository> | null = null;
  private storage: typeof defaultTokenStorage;

  constructor(storage = defaultTokenStorage) {
    this.storage = storage;
  }

  /**
   * Get the current repository state as a discriminated union
   *
   * Note: Internal 'not-validated' state is not exposed externally.
   * Repository is only returned when token validation is complete and successful.
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
        // Internal state - not exposed externally
        // Token validation is in progress or not yet started
        return { type: 'not-created' };
      case 'valid':
        return { type: 'created-token-valid', repository: this.repository };
      case 'invalid':
        return {
          type: 'token-invalid',
          error: this.error || 'Unknown error',
        };
    }
  }

  /**
   * Reset repository state to not-created
   * Call this when token is removed or when forcing re-validation.
   * This also clears any pending initialization promise.
   */
  reset(): void {
    this.initPromise = null;
    this.repository = null;
    this.tokenStatus = 'not-validated';
    this.error = null;
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
   * Handles concurrent calls by returning the same promise (request deduplication).
   *
   * Note: Token validation is done with setupSnapshot({ limit: 0 }), so the repository
   * is ready to use but contains no data. Callers should call setupSnapshot() with
   * appropriate limit when they need actual prototype data.
   *
   * @returns Validated Promidas repository instance ready for data loading
   * @throws Error if token is missing or validation fails
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
          this.repository = repo;
          this.tokenStatus = 'not-validated';
          this.error = null;
        } catch (err) {
          console.error('Failed to create Promidas repository:', err);
          const parsed = parsePromidasRepositoryInitError(err);
          this.repository = null;
          this.tokenStatus = 'invalid';
          this.error = parsed.message;
          throw new Error(parsed.message);
        }

        // Step 2: Validate token by testing API access
        const result = await this.validateRepository(repo);
        if (!result.ok) {
          console.error('Token validation failed:', result);
          const parsed = parseSnapshotFailure(result);
          this.repository = null;
          this.tokenStatus = 'invalid';
          this.error = parsed.message;
          throw new Error(parsed.message);
        }

        // Token is valid
        this.tokenStatus = 'valid';
        this.error = null;
        return repo;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }
}
