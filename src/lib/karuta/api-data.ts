import { getPromidasRepository } from '@/lib/repository/promidas-repo';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Fetch prototypes from PROMIDAS API
 * @param limit - Maximum number of prototypes to fetch (default: 100)
 * @returns Array of NormalizedPrototype from API
 * @throws Error if repository is not available or fetch fails
 */
export async function fetchPrototypesFromAPI(
  limit: number = 100,
): Promise<NormalizedPrototype[]> {
  const repo = await getPromidasRepository();

  // Setup snapshot with requested limit
  // This will fetch fresh data from PROMIDAS API
  const result = await repo.setupSnapshot({ limit });

  if (!result.ok) {
    throw new Error(
      `Failed to fetch prototypes from PROMIDAS: ${result.message}`,
    );
  }

  // Get all prototypes from the snapshot
  const prototypes: NormalizedPrototype[] = [];
  const seenIds = new Set<number>();

  // Fetch unique prototypes from snapshot
  // Use a bounded loop to avoid infinite loops
  const maxAttempts = Math.max(200, limit * 10);
  let attempts = 0;

  while (prototypes.length < limit && attempts < maxAttempts) {
    attempts += 1;
    const prototype = await repo.getRandomPrototypeFromSnapshot();
    if (prototype && !seenIds.has(prototype.id)) {
      prototypes.push(prototype);
      seenIds.add(prototype.id);
    }

    // If we haven't found new prototypes in the last 20 attempts, stop
    if (attempts > prototypes.length + 20) {
      console.warn(
        `Only found ${prototypes.length} unique prototypes out of ${limit} requested after ${attempts} attempts`,
      );
      break;
    }
  }

  if (prototypes.length === 0) {
    throw new Error('No prototypes fetched from PROMIDAS snapshot');
  }

  console.log(
    `Fetched ${prototypes.length} unique prototypes from PROMIDAS (requested: ${limit}, attempts: ${attempts})`,
  );

  return prototypes;
}
