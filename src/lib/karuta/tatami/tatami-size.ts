/**
 * TatamiSize - Available sizes for initial tatami configuration
 */
export const TATAMI_SIZES = [4, 8, 12, 16, 20] as const;

export type TatamiSize = (typeof TATAMI_SIZES)[number];

export const DEFAULT_TATAMI_SIZE: TatamiSize = 8;
