import { createContext } from 'react';
import type { ScreenSize } from '@/types/screen-size';

export const ScreenSizeContext = createContext<ScreenSize | undefined>(
  undefined,
);
