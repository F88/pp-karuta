import type { ReactNode } from 'react';
import { useScreenSize } from '@/hooks/use-screen-size';
import { ScreenSizeContext } from './screen-size-context';

export function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const screenSize = useScreenSize();
  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
