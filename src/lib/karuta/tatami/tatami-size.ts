/**
 * TatamiSize - Available sizes for initial tatami configuration
 */
export const TATAMI_SIZES_8 = [4, 8] as const;
export type TatamiSize8 = (typeof TATAMI_SIZES_8)[number];
export const DEFAULT_TATAMI_SIZE_8: TatamiSize8 = 8;

export const TATAMI_SIZES_16 = [4, 8, 12, 16] as const;
export type TatamiSize16 = (typeof TATAMI_SIZES_16)[number];
export const DEFAULT_TATAMI_SIZE_16: TatamiSize16 = 8;
