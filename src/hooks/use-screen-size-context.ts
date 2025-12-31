import { useContext } from 'react';
import { ScreenSizeContext } from '@/contexts/screen-size-context';

export function useScreenSizeContext() {
  const context = useContext(ScreenSizeContext);
  if (context === undefined) {
    throw new Error(
      'useScreenSizeContext must be used within ScreenSizeProvider',
    );
  }
  return context;
}
