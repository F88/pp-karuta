import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { ToriFudaCard } from './tori-fuda-card';

export type SharedTatamiProps = {
  tatamiCards: NormalizedPrototype[];
  playMode?: PlayMode;
  screenSize?: ScreenSize;
};

export function SharedTatami({
  tatamiCards,
  playMode,
  screenSize,
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
          <ToriFudaCard
            key={card.id}
            normalizedPrototype={card}
            index={index}
            isClickable={false}
            playMode={playMode}
          />
        ))}
      </div>
    </div>
  );
}
