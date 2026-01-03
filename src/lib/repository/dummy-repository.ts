import type {
  ProtopediaInMemoryRepository,
  PrototypeInMemoryStats,
  PrototypeInMemoryStoreConfig,
} from '@f88/promidas';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { EventEmitter } from 'events';
import type {
  SnapshotOperationSuccess,
  SnapshotOperationFailure,
} from '@f88/promidas/repository/types';
import type { PrototypeAnalysisResult } from '@f88/promidas/repository/types';
import { generateDummyPrototypes } from './dummy-data';

type SnapshotOperationResult =
  | SnapshotOperationSuccess
  | SnapshotOperationFailure;

/**
 * Dummy implementation of ProtopediaInMemoryRepository for development
 * Returns fake data without making actual API calls
 *
 * Features:
 * - Generates 10000 dummy prototypes on initialization
 * - Supports filtering by userNm, materialNm, tagNm, eventNm (exact match)
 * - Supports pagination with offset and limit
 * - No actual API calls or token validation
 */
export class DummyRepository implements ProtopediaInMemoryRepository {
  private allPrototypes: readonly NormalizedPrototype[];
  private filteredPrototypes: readonly NormalizedPrototype[];
  readonly events = new EventEmitter();

  constructor() {
    const startTime = performance.now();
    this.allPrototypes = generateDummyPrototypes(10000);
    const endTime = performance.now();
    const elapsedMs = endTime - startTime;

    this.filteredPrototypes = this.allPrototypes;
    console.debug(
      `[DummyRepository] Generated 10000 prototypes in ${elapsedMs.toFixed(2)}ms`,
    );
    console.info('[DummyRepository] Initialized with 10000 dummy prototypes');
  }

  getConfig(): Omit<Required<PrototypeInMemoryStoreConfig>, 'logger'> {
    return {
      ttlMs: Infinity,
      maxDataSizeBytes: 30 * 1024 * 1024,
      logLevel: 'info',
    };
  }

  getStats(): PrototypeInMemoryStats {
    return {
      size: this.filteredPrototypes.length,
      cachedAt: new Date(),
      isExpired: false,
      remainingTtlMs: Infinity,
      dataSizeBytes: 0,
      refreshInFlight: false,
    };
  }

  async setupSnapshot(
    params: ListPrototypesParams,
  ): Promise<SnapshotOperationResult> {
    console.info('[DummyRepository] setupSnapshot called with params:', params);

    this.events.emit('snapshotStarted', 'setup');

    const startTime = performance.now();

    // Filter all prototypes in a single pass
    const filtered = this.allPrototypes.filter((p) => {
      // Filter by userNm (exact match within array)
      if (params.userNm && !p.users.some((user) => user === params.userNm)) {
        return false;
      }

      // Filter by materialNm (exact match within array)
      if (
        params.materialNm &&
        !p.materials.some((material) => material === params.materialNm)
      ) {
        return false;
      }

      // Filter by tagNm (exact match within array)
      if (params.tagNm && !p.tags.some((tag) => tag === params.tagNm)) {
        return false;
      }

      // Filter by eventNm (exact match within array)
      if (
        params.eventNm &&
        !p.events.some((event) => event === params.eventNm)
      ) {
        return false;
      }

      return true;
    });

    // Apply pagination
    const offset = params.offset ?? 0;
    const limit = params.limit ?? filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    this.filteredPrototypes = paginated;

    const endTime = performance.now();
    const elapsedMs = endTime - startTime;

    console.debug(`[DummyRepository] Filtering took ${elapsedMs.toFixed(2)}ms`);
    console.info(
      `[DummyRepository] Filtered ${this.allPrototypes.length} -> ${filtered.length} -> ${paginated.length} prototypes`,
    );

    const stats = this.getStats();
    this.events.emit('snapshotCompleted', stats);

    return {
      ok: true,
      stats,
    };
  }

  async refreshSnapshot(): Promise<SnapshotOperationResult> {
    console.info('[DummyRepository] refreshSnapshot called (no-op)');

    this.events.emit('snapshotStarted', 'refresh');

    const stats = this.getStats();
    this.events.emit('snapshotCompleted', stats);

    return {
      ok: true,
      stats,
    };
  }

  async analyzePrototypes(): Promise<PrototypeAnalysisResult> {
    if (this.filteredPrototypes.length === 0) {
      return { min: null, max: null };
    }

    let min = this.filteredPrototypes[0].id;
    let max = this.filteredPrototypes[0].id;

    for (const prototype of this.filteredPrototypes) {
      if (prototype.id < min) min = prototype.id;
      if (prototype.id > max) max = prototype.id;
    }

    return { min, max };
  }

  async getAllFromSnapshot(): Promise<readonly NormalizedPrototype[]> {
    return this.filteredPrototypes;
  }

  async getPrototypeIdsFromSnapshot(): Promise<readonly number[]> {
    return this.filteredPrototypes.map((p) => p.id);
  }

  async getPrototypeFromSnapshotByPrototypeId(
    prototypeId: number,
  ): Promise<NormalizedPrototype | null> {
    return this.filteredPrototypes.find((p) => p.id === prototypeId) ?? null;
  }

  async getRandomPrototypeFromSnapshot(): Promise<NormalizedPrototype | null> {
    if (this.filteredPrototypes.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(
      Math.random() * this.filteredPrototypes.length,
    );
    return this.filteredPrototypes[randomIndex] ?? null;
  }

  async getRandomSampleFromSnapshot(
    size: number,
  ): Promise<readonly NormalizedPrototype[]> {
    if (size <= 0 || this.filteredPrototypes.length === 0) {
      return [];
    }

    const shuffled = [...this.filteredPrototypes].sort(
      () => Math.random() - 0.5,
    );
    return shuffled.slice(0, Math.min(size, shuffled.length));
  }

  dispose(): void {
    console.info('[DummyRepository] dispose called (no-op)');
  }
}

/**
 * Create a singleton instance of DummyRepository
 */
let dummyRepositoryInstance: DummyRepository | null = null;

export function createDummyRepository(): DummyRepository {
  if (!dummyRepositoryInstance) {
    dummyRepositoryInstance = new DummyRepository();
  }
  return dummyRepositoryInstance;
}
