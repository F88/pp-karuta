import { Card, CardContent } from '@/components/ui/card';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';

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
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      index: 'h-6 w-6 bg-indigo-600 text-xs shadow-md',
      title: 'mb-1 line-clamp-2 text-xs font-semibold text-gray-800',
      summary: 'line-clamp-2 text-xs text-gray-600',
      id: 'mt-1 text-xs text-gray-400',
    },
    tablet: {
      index: 'h-7 w-7 bg-indigo-600 text-sm shadow-md',
      title: 'mb-1 line-clamp-2 text-sm font-semibold text-gray-800',
      summary: 'line-clamp-2 text-xs text-gray-600',
      id: 'mt-2 text-xs text-gray-400',
    },
    pc: {
      index: 'h-8 w-8 bg-indigo-600 text-base shadow-md',
      title: 'mb-1 line-clamp-2 text-sm font-semibold text-gray-800',
      summary: 'line-clamp-2 text-xs text-gray-600',
      id: 'mt-2 text-xs text-gray-400',
    },
    responsive: {
      index:
        'h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 bg-indigo-600 text-xs md:text-sm lg:text-base shadow-md',
      title: 'mb-1 line-clamp-2 text-xs md:text-sm font-semibold text-gray-800',
      summary: 'line-clamp-2 text-xs text-gray-600',
      id: 'mt-1 md:mt-2 text-xs text-gray-400',
    },
  });

  const borderWidthClass = 'border-2';
  const cardBaseClass = `@container overflow-hidden rounded-none ${borderWidthClass} border-black bg-white shadow-none dark:border-white dark:bg-gray-950`;
  const cardContentClass = 'flex h-full items-center justify-center p-0';
  const keyboardKeyClass =
    'inline-flex min-h-8 min-w-8 items-center justify-center font-bold text-gray-700 dark:text-gray-300 @[60px]:text-base @[80px]:text-lg @[100px]:text-xl @[120px]:text-2xl @[140px]:text-3xl @[180px]:text-4xl @[220px]:text-5xl @[280px]:text-6xl';
  const indexBaseClass =
    'flex items-center justify-center rounded-full text-xs font-bold text-white';

  return (
    <Card className={cardBaseClass}>
      <CardContent className={cardContentClass}>
        {/* Keyboard Key Indicator */}
        {keyboardKey && (
          <span className={keyboardKeyClass}>{keyboardKey.toUpperCase()}</span>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <>
            <div className={`${indexBaseClass} ${styles.index}`}>
              {index + 1}
            </div>

            <h3 className={styles.title}>{card.prototypeNm}</h3>
            {/* <p className={styles.summary}>
              {card.summary || 'No summary available'}
            </p> */}
            <div className={styles.id}>ID: {card.id}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
