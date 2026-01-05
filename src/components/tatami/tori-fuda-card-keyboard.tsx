import { Card, CardContent } from '@/components/ui/card';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';

export type ToriFudaCardKeyboardProps = {
  normalizedPrototype: NormalizedPrototype;
  index: number;
  keyboardKey?: string;
  screenSize: ScreenSize;
};

export function ToriFudaCardKeyboard({
  normalizedPrototype: card,
  index,
  keyboardKey,
  screenSize,
}: ToriFudaCardKeyboardProps) {
  const borderWidthClass = screenSize
    ? {
        smartphone: 'border-2',
        tablet: 'border-2',
        pc: 'border-2',
      }[screenSize]
    : 'border-2';
  const cardBaseClass = `@container aspect-video overflow-hidden rounded-none ${borderWidthClass} border-black bg-white shadow-none dark:border-white dark:bg-gray-950`;
  const cardContentClass = 'flex h-full items-center justify-center p-0';

  const keyboardKeyClass =
    'font-bold text-gray-700 dark:text-gray-300 @[60px]:text-base @[80px]:text-lg @[100px]:text-xl @[120px]:text-2xl @[140px]:text-3xl @[180px]:text-4xl @[220px]:text-5xl @[280px]:text-6xl';

  const indexBaseClass =
    'flex items-center justify-center rounded-full text-xs font-bold text-white';
  const indexClass = screenSize
    ? {
        smartphone: 'h-6 w-6 bg-indigo-600 text-xs shadow-md',
        tablet: 'h-7 w-7 bg-indigo-600 text-sm shadow-md',
        pc: 'h-8 w-8 bg-indigo-600 text-base shadow-md',
      }[screenSize]
    : 'h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 bg-indigo-600 text-xs md:text-sm lg:text-base shadow-md';

  const titleClass = screenSize
    ? {
        smartphone: 'mb-1 line-clamp-2 text-xs font-semibold text-gray-800',
        tablet: 'mb-1 line-clamp-2 text-sm font-semibold text-gray-800',
        pc: 'mb-1 line-clamp-2 text-sm font-semibold text-gray-800',
      }[screenSize]
    : 'mb-1 line-clamp-2 text-xs md:text-sm font-semibold text-gray-800';
  const summaryClass = screenSize
    ? {
        smartphone: 'line-clamp-2 text-xs text-gray-600',
        tablet: 'line-clamp-2 text-xs text-gray-600',
        pc: 'line-clamp-2 text-xs text-gray-600',
      }[screenSize]
    : 'line-clamp-2 text-xs text-gray-600';
  const idClass = screenSize
    ? {
        smartphone: 'mt-1 text-xs text-gray-400',
        tablet: 'mt-2 text-xs text-gray-400',
        pc: 'mt-2 text-xs text-gray-400',
      }[screenSize]
    : 'mt-1 md:mt-2 text-xs text-gray-400';

  return (
    <Card className={cardBaseClass}>
      <CardContent className={cardContentClass}>
        {/* Keyboard Key Indicator */}
        {keyboardKey && (
          <span className={keyboardKeyClass}>{keyboardKey.toUpperCase()}</span>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <>
            <div className={`${indexBaseClass} ${indexClass}`}>{index + 1}</div>

            <h3 className={titleClass}>{card.prototypeNm}</h3>
            <p className={summaryClass}>
              {card.summary || 'No summary available'}
            </p>
            <div className={idClass}>ID: {card.id}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
