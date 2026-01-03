import { useEffect, useState } from 'react';
import type { ScreenSize } from '@/types/screen-size';

/**
 * Detects the current screen size based on Tailwind CSS breakpoints.
 *
 * Breakpoints:
 * - smartphone: width < 768px (base)
 * - tablet: 768px <= width < 1024px (md)
 * - pc: width >= 1024px (lg)
 *
 * @returns {ScreenSize} The current screen size category
 *
 * @example
 * ```tsx
 * const screenSize = useScreenSize();
 * if (screenSize === 'smartphone') {
 *   // Render mobile layout
 * }
 * ```
 */
export function useScreenSize(): ScreenSize {
  const getScreenSize = (): ScreenSize => {
    // Handle SSR - default to smartphone for safety
    if (typeof window === 'undefined') {
      return 'smartphone';
    }

    const width = window.innerWidth;

    if (width >= 1024) {
      return 'pc';
    }
    if (width >= 768) {
      return 'tablet';
    }
    return 'smartphone';
  };

  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize);

  useEffect(() => {
    // Skip if running in SSR environment
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
}
