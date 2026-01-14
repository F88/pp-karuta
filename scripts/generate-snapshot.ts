#!/usr/bin/env tsx
/**
 * @fileoverview Generate development snapshot from ProtoPedia API.
 *
 * This script fetches prototype data from ProtoPedia API v2 and generates
 * a serializable snapshot for development use. The snapshot can be loaded
 * via setupSnapshotFromSerializedData() to enable offline development.
 *
 * Usage:
 *   npm run generate-snapshot
 *
 * Environment:
 *   VITE_PROTOPEDIA_API_V2_TOKEN - Required API token
 *
 * Output:
 *   scripts/dev-snapshot-{timestamp}-{count}.json - Serialized snapshot data
 */

// Node.js modules
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Load environment variables from .env.local
import { config } from 'dotenv';

// Promidas modules
import {
  createPromidasForLocal,
  ProtopediaInMemoryRepository,
} from '@f88/promidas';
import { parseSnapshotOperationFailure } from '@f88/promidas-utils/repository';

// Load .env.local (overrides .env if exists)
config({
  path: ['.env.local'],
  // debug: true,
});

// Snapshot configuration
const OFFSET = 0;
const LIMIT = 10;

/**
 * Generate output filename with timestamp and count
 */
function getOutputPath(count: number): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .replace('T', '-');
  const filename = `dev-snapshot-${timestamp}-${count}.json`;
  return resolve(process.cwd(), 'scripts/dev', filename);
}

async function fetchPrototypeData(
  repository: ReturnType<typeof createPromidasForLocal>,
  offset: number,
  limit: number,
) {
  console.log(`\n🌐 Fetching prototypes (offset=${offset}, limit=${limit})...`);
  const startTime = performance.now();
  const result = await repository.setupSnapshot({ offset, limit });
  const elapsed = performance.now() - startTime;
  if (!result.ok) {
    console.error('\n❌ Snapshot setup failed:');
    console.dir(result, { depth: null });
    const parsed = parseSnapshotOperationFailure(result);
    console.error(`\n📜 ${parsed?.localizedMessage}`);
    process.exit(1);
  }
  console.log(`✓ Fetched ${result.stats.size} prototypes in ${elapsed.toFixed(0)}ms,
  Data size: ${(result.stats.dataSizeBytes / 1024).toFixed(1)} KB
`);
  return result.stats;
}

/**
 * Save snapshot to JSON file
 *
 * @param repository - Promidas repository instance
 * @param prototypeCount - Number of prototypes in the snapshot (for filename)
 */
function saveSnapshotToFile(repository: ProtopediaInMemoryRepository) {
  // Get serializable snapshot
  console.log('📦 Creating serializable snapshot...');
  const snapshot = repository.getSerializableSnapshot();
  if (!snapshot) {
    console.error('❌ Failed to get serializable snapshot');
    process.exit(1);
  }
  console.log(`✓ Snapshot created
  Version: ${snapshot.version}
  Timestamp: ${snapshot.serializedAt}
  Prototypes: ${snapshot.prototypes.length}
`);

  // Generate output path with count and timestamp
  const outputPath = getOutputPath(snapshot.prototypes.length);
  const outputDir = dirname(outputPath);
  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    console.log(`📁 Creating output directory: ${outputDir}`);
    mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Directory created\n`);
  }
  // Write snapshot to file
  console.log(`💾 Writing snapshot to ${outputPath} ...`);
  const jsonContent = JSON.stringify(snapshot, null, 2);
  const fileSizeKB = (Buffer.byteLength(jsonContent, 'utf8') / 1024).toFixed(1);
  writeFileSync(outputPath, jsonContent, 'utf8');
  console.log(`✓ Snapshot saved (${fileSizeKB} KB)`);

  return outputPath;
}

/**
 * Main execution function
 */
async function main() {
  console.log(`
🚀 Starting snapshot generation...
   Limit: ${LIMIT}
   Offset: ${OFFSET}
`);

  // Get API token from environment
  const token = process.env.VITE_PROTOPEDIA_API_V2_TOKEN ?? 'no-token';

  // Create repository
  console.log('⚙️ Creating repository...');
  const repository = createPromidasForLocal({
    protopediaApiToken: token,
    // logLevel: 'info',
    logLevel: 'warn',
  });
  console.log('✓ Repository created');

  // Fetch prototype data from API
  await fetchPrototypeData(repository, OFFSET, LIMIT);

  // Save snapshot to file
  const outputPath = saveSnapshotToFile(repository);

  // Cleanup
  repository.dispose();

  console.log('\n✅ Snapshot generation completed successfully!');
  console.log(`   File: ${outputPath}`);
}

// Execute main function
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
