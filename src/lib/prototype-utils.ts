import type { ResultOfListPrototypesApiResponse } from 'protopedia-api-v2-client';

export type SortOrder = 'asc' | 'desc';

const toNumericId = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Compare two records with numeric id fields according to sort order.
 */
export function compareById<T extends { id?: number | null }>(
  left: T,
  right: T,
  order: SortOrder = 'asc',
): number {
  const leftId = toNumericId(left.id) ?? Number.POSITIVE_INFINITY;
  const rightId = toNumericId(right.id) ?? Number.POSITIVE_INFINITY;
  const diff = leftId - rightId;
  return order === 'asc' ? diff : -diff;
}

/**
 * Sort prototypes by their numeric ID in the requested order without mutating the input.
 * @param prototypes Records to sort.
 * @param order Sort direction (`asc` by default for ascending order).
 * @returns New array sorted according to the provided order.
 */
export function sortPrototypesById<T extends { id: number }>(
  prototypes: T[],
  order: SortOrder = 'asc',
): T[] {
  return prototypes.slice().sort((a, b) => compareById(a, b, order));
}

/**
 * Return the smallest numeric prototype id present in the response data.
 */
export function getMinPrototypeId(
  prototypes: ResultOfListPrototypesApiResponse[],
): number | undefined {
  let minId: number | undefined;

  for (const prototype of prototypes) {
    const currentId = toNumericId(prototype.id);
    if (currentId === undefined) {
      continue;
    }

    if (minId === undefined || currentId < minId) {
      minId = currentId;
    }
  }

  return minId;
}

/**
 * Return the largest numeric prototype id present in the response data.
 */
export function getMaxPrototypeId(
  prototypes: ResultOfListPrototypesApiResponse[],
): number | undefined {
  let maxId: number | undefined;

  for (const prototype of prototypes) {
    const currentId = toNumericId(prototype.id);
    if (currentId === undefined) {
      continue;
    }

    if (maxId === undefined || currentId > maxId) {
      maxId = currentId;
    }
  }

  return maxId;
}

const PROTOPEDIA_PROTOTYPE_BASE_URL = 'https://protopedia.net/prototype';
export const buildPrototypeLink = (prototypeId: number): string => {
  return `${PROTOPEDIA_PROTOTYPE_BASE_URL}/${prototypeId}`;
};

const PROTOPEDIA_TAG_BASE_URL = 'https://protopedia.net/tag';
export const buildTagLink = (tag: string): string => {
  const url = new URL(PROTOPEDIA_TAG_BASE_URL);
  url.searchParams.set('tag', tag);
  return url.toString();
};

const PROTOPEDIA_MATERIAL_BASE_URL = 'https://protopedia.net/material';
/**
 * ProtoPedia の素材ページのURLは以下のように /id であるが、文字列を渡しても動作する、ありがたい!!
 * https://protopedia.net/material/1863
 *
 * @param material The material identifier or name to link to.
 * @returns URL to the material page.
 */
export const buildMaterialLink = (material: string): string => {
  return `${PROTOPEDIA_MATERIAL_BASE_URL}/${encodeURIComponent(material)}`;
};
