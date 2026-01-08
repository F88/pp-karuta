import { Card, CardContent } from '@/components/ui/card';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';

export type ToriFudaCardTouchProps = {
  normalizedPrototype: NormalizedPrototype;
  index: number;
  isClickable?: boolean;
  showImage?: boolean;
  onClick?: (card: NormalizedPrototype) => void;
  screenSize: ScreenSize;
};

export function ToriFudaCardTouch({
  normalizedPrototype: card,
  index,
  isClickable = false,
  showImage = true,
  onClick,
  screenSize,
}: ToriFudaCardTouchProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      borderWidth: 'border-4',
      index: 'h-5 w-5 bg-indigo-500',
      title: 'mb-1 text-xs font-semibold text-gray-800',
      summary: 'text-xs text-gray-600',
      id: 'mt-1 text-xs text-gray-400',
    },
    tablet: {
      borderWidth: 'border-8',
      index: 'h-6 w-6 bg-indigo-500',
      title: 'mb-1 text-md font-semibold text-gray-800',
      summary: 'text-md text-gray-600',
      id: 'mt-2 text-md text-gray-400',
    },
    pc: {
      borderWidth: 'border-8',
      index: 'h-6 w-6 bg-indigo-500',
      title: 'mb-1 text-2xl font-semibold text-gray-800',
      summary: 'text-xl text-gray-600',
      id: 'mt-2 text-2xl text-gray-400',
    },
    responsive: {
      borderWidth: 'border-4 md:border-8',
      index: 'h-5 w-5 md:h-6 md:w-6 bg-indigo-500',
      title: 'mb-1 text-xs md:text-sm font-semibold text-gray-800',
      summary: 'text-xs text-gray-600',
      id: 'mt-1 md:mt-2 text-xs text-gray-400',
    },
  });

  const cardBaseClass = `rounded-none ${styles.borderWidth} border-black dark:border-white`;
  const cardClickableClass =
    'group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95';

  const cardContentClass = 'relative p-0';
  const indexBaseClass =
    'flex items-center justify-center rounded-full text-xs font-bold text-white';
  const imageContainerClass =
    'aspect-video overflow-hidden rounded-none bg-gray-200';
  const imageClass = 'h-full w-full object-cover';

  return (
    <Card
      className={
        isClickable ? `${cardBaseClass} ${cardClickableClass}` : cardBaseClass
      }
      onClick={isClickable && onClick ? () => onClick(card) : undefined}
    >
      <CardContent className={cardContentClass}>
        {showImage && (
          <div className={imageContainerClass}>
            <img
              src={card.mainUrl}
              alt={card.prototypeNm}
              className={imageClass}
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <>
            <div className={`${indexBaseClass} ${styles.index}`}>
              {index + 1}
            </div>
            <div className={styles.id}>ID: {card.id}</div>
            <h3 className={styles.title}>{card.prototypeNm}</h3>
            {/* <p className={styles.summary}>
              {card.summary || 'No summary available'}
            </p> */}
          </>
        )}
      </CardContent>
    </Card>
  );
}
