import { createPromidasForLocal } from '@f88/promidas';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';

let repository: ProtopediaInMemoryRepository | null = null;

export async function getPromidasRepository(): Promise<ProtopediaInMemoryRepository> {
  if (repository) {
    return repository;
  }

  const token = import.meta.env.VITE_PROTOPEDIA_API_V2_TOKEN;

  if (!token) {
    throw new Error(
      'VITE_PROTOPEDIA_API_V2_TOKEN is not set in environment variables',
    );
  }

  repository = createPromidasForLocal({
    protopediaApiToken: token,
  });

  // Initialize snapshot with 100 prototypes
  const result = await repository.setupSnapshot({ limit: 100 });

  if (!result.ok) {
    throw new Error(`Failed to setup snapshot: ${result.message}`);
  }

  return repository;
}
