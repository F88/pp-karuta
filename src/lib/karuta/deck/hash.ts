import type {
  Deck,
  DeckIdentifier,
  DeckMetaData,
  DeckIdsHash,
} from '@/models/karuta';
import { getDeckIds } from './utils';

/**
 * Generate SHA-256 hash from string
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

/**
 * Create DeckIdsHash from prototype IDs
 * Same IDs = Same hash (reproducible)
 */
export async function createDeckIdsHash(
  prototypeIds: number[],
): Promise<DeckIdsHash> {
  const sortedIds = [...prototypeIds].sort((a, b) => a - b);
  const source = sortedIds.join(',');
  return await sha256(source);
}

/**
 * Create DeckIdentifier from deck and fetch timestamp
 */
export async function createDeckIdentifier(
  deck: Deck,
  fetchedAt: number,
): Promise<DeckIdentifier> {
  const prototypeIds = getDeckIds(deck);
  const source = `${fetchedAt}:${prototypeIds.join(',')}`;
  const deckHash = await sha256(source);
  return { deckHash };
}

/**
 * Create DeckMetaData from deck, fetch timestamp, and title
 */
export async function createDeckMetaData(
  deck: Deck,
  fetchedAt: number,
  title: string,
): Promise<DeckMetaData> {
  const prototypeIds = getDeckIds(deck);

  // Generate both hashes
  const deckHash = await sha256(`${fetchedAt}:${prototypeIds.join(',')}`);
  const deckIdsHash = await sha256(prototypeIds.join(','));

  return {
    deckHash,
    deckIdsHash,
    title,
    fetchedAt,
    prototypeIds,
  };
}
