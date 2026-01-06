import { useMemo } from 'react';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

/**
 * Hook to get responsive grid column classes based on screen size
 */
export function useResponsiveGridColumns(
  screenSize: ScreenSize | undefined,
  columns: {
    smartphone: number;
    tablet: number;
    pc: number;
  },
) {
  return useMemo(() => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    } as const;

    return getResponsiveStyles<string>(screenSize, {
      smartphone: gridClasses[columns.smartphone as keyof typeof gridClasses],
      tablet: gridClasses[columns.tablet as keyof typeof gridClasses],
      pc: gridClasses[columns.pc as keyof typeof gridClasses],
      responsive: `grid-cols-${columns.smartphone} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.pc}`,
    });
  }, [screenSize, columns.smartphone, columns.tablet, columns.pc]);
}

/**
 * Hook to get responsive gap classes based on screen size
 */
export function useResponsiveGap(
  screenSize: ScreenSize | undefined,
  gap?: {
    smartphone?: number;
    tablet?: number;
    pc?: number;
  },
) {
  return useMemo(() => {
    const gapClasses = {
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
    } as const;

    const smartphone = gap?.smartphone ?? 2;
    const tablet = gap?.tablet ?? 3;
    const pc = gap?.pc ?? 4;

    return getResponsiveStyles<string>(screenSize, {
      smartphone: gapClasses[smartphone as keyof typeof gapClasses],
      tablet: gapClasses[tablet as keyof typeof gapClasses],
      pc: gapClasses[pc as keyof typeof gapClasses],
      responsive: `gap-${smartphone} md:gap-${tablet} lg:gap-${pc}`,
    });
  }, [screenSize, gap]);
}
