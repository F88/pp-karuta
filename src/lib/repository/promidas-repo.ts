import { createPromidasForLocal } from '@f88/promidas';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { tokenStorage } from '@/lib/token-storage';

export type RepositoryState = 'not-initialized' | 'invalid' | 'valid';

interface RepositoryStatus {
  state: RepositoryState;
  error: string | null;
}

let repository: ProtopediaInMemoryRepository | null = null;
let repositoryStatus: RepositoryStatus = {
  state: 'not-initialized',
  error: null,
};

/**
 * Get the current repository state
 */
export function getRepositoryState(): RepositoryStatus {
  return { ...repositoryStatus };
}

/**
 * Reset repository state (e.g., when token is removed)
 */
export function resetRepository(): void {
  repository = null;
  repositoryStatus = {
    state: 'not-initialized',
    error: null,
  };
}

/**
 * Validate token and create repository
 * Uses limit:0 to minimize API calls while confirming token validity
 */
export async function validateAndCreateRepository(
  token: string,
): Promise<RepositoryStatus> {
  if (token.trim() === '') {
    repositoryStatus = {
      state: 'invalid',
      error: 'Token is empty',
    };
    return getRepositoryState();
  }

  try {
    const repo = createPromidasForLocal({
      protopediaApiToken: token,
      logLevel: 'debug',
    });

    // Use limit:0 for minimal API confirmation
    const result = await repo.setupSnapshot({ limit: 0 });
    if (!result.ok) {
      repositoryStatus = {
        state: 'invalid',
        error: result.message || 'Failed to setup snapshot',
      };
      repository = null;
      return getRepositoryState();
    }

    // Token is valid, now initialize with full dataset
    const fullResult = await repo.setupSnapshot({ limit: 100 });
    if (!fullResult.ok) {
      repositoryStatus = {
        state: 'invalid',
        error: fullResult.message || 'Failed to initialize full snapshot',
      };
      repository = null;
      return getRepositoryState();
    }

    // Warm up
    await repo.getRandomPrototypeFromSnapshot();

    repository = repo;
    repositoryStatus = {
      state: 'valid',
      error: null,
    };

    return getRepositoryState();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    repositoryStatus = {
      state: 'invalid',
      error: message,
    };
    repository = null;
    return getRepositoryState();
  }
}

async function resolveProtopediaApiToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  return await tokenStorage.get();
}

export async function getPromidasRepository(): Promise<ProtopediaInMemoryRepository> {
  if (repository && repositoryStatus.state === 'valid') {
    return repository;
  }

  const token = await resolveProtopediaApiToken();

  if (!token) {
    throw new Error(
      'ProtoPedia API token is missing. Provide a token via the in-app Token UI.',
    );
  }

  // If repository hasn't been validated yet, validate and create it
  if (repositoryStatus.state === 'not-initialized') {
    const status = await validateAndCreateRepository(token);
    if (status.state !== 'valid' || !repository) {
      throw new Error(status.error || 'Failed to create repository');
    }
    return repository;
  }

  if (!repository) {
    throw new Error('Repository is in invalid state');
  }

  return repository;
}
