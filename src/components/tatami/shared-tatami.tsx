import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { ToriFudaCardTouch } from './tori-fuda-card-touch';

export type SharedTatamiProps = {
  tatamiCards: NormalizedPrototype[];
  playMode?: PlayMode;
  screenSize?: ScreenSize;
};

export function SharedTatami({
  tatamiCards,
  screenSize = 'pc',
}: SharedTatamiProps) {
  const titleSizeClass = screenSize
    ? {
        smartphone: 'text-base',
        tablet: 'text-lg',
        pc: 'text-xl',
      }[screenSize]
    : 'text-base md:text-lg lg:text-xl';

  const gridColsClass = screenSize
    ? {
        smartphone: 'grid-cols-4',
        tablet: 'grid-cols-4',
        pc: 'grid-cols-4',
      }[screenSize]
    : 'grid-cols-4 md:grid-cols-4 lg:grid-cols-4';

  return (
    <div className="mb-6">
      <h2
        className={`mb-4 text-center font-bold text-gray-700 dark:text-gray-300 ${titleSizeClass}`}
      >
        🎴 Shared Tatami (Reference Only)
      </h2>
      <div className={`grid gap-4 ${gridColsClass}`}>
        {tatamiCards.map((card, index) => (
          <ToriFudaCardTouch
            key={card.id}
            normalizedPrototype={card}
            index={index}
            isClickable={false}
            showImage={true}
            screenSize={screenSize}
          />
        ))}
      </div>
    </div>
  );
}
