import { getPromidasRepositoryManager } from './promidas-repository-manager';

// Export singleton instance
export const promidasRepositoryManager = getPromidasRepositoryManager();

// Export types
export type { RepositoryState } from './promidas-repository-manager';

// Export convenient functions that use the singleton
export const getRepositoryState = () => promidasRepositoryManager.getState();
export const resetRepository = () => promidasRepositoryManager.reset();
export const getPromidasRepository = () =>
  promidasRepositoryManager.getRepository();
