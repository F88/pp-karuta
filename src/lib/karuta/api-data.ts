import { getPromidasRepository } from '@/lib/repository/promidas-repo';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Fetch prototypes from PROMIDAS API
 * @param limit - Maximum number of prototypes to fetch (optional)
 * @returns Array of NormalizedPrototype from API
 */
export async function fetchPrototypesFromAPI(
  limit?: number,
): Promise<NormalizedPrototype[]> {
  const repo = await getPromidasRepository();

  // Repository already has snapshot initialized with 100 prototypes in lib/promidas.ts
  // Use getRandomPrototypeFromSnapshot() repeatedly to get prototypes
  const count = limit && limit > 0 ? Math.min(limit, 100) : 100;
  const prototypes: NormalizedPrototype[] = [];
  const seenIds = new Set<number>();

  // Bound sampling attempts to avoid hanging when the snapshot has fewer
  // unique prototypes than requested.
  const maxAttempts = Math.max(200, count * 10);
  let attempts = 0;

  // Get unique prototypes from snapshot
  while (prototypes.length < count && attempts < maxAttempts) {
    attempts += 1;
    const prototype = await repo.getRandomPrototypeFromSnapshot();
    if (prototype && !seenIds.has(prototype.id)) {
      prototypes.push(prototype);
      seenIds.add(prototype.id);
    }
  }

  return prototypes;
}
