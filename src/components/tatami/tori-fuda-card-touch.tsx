import { Card, CardContent } from '@/components/ui/card';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';

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
  const borderWidthClass = screenSize
    ? {
        smartphone: 'border-4',
        tablet: 'border-8',
        pc: 'border-8',
      }[screenSize]
    : 'border-4 md:border-8';
  const cardBaseClass = `rounded-none ${borderWidthClass} border-black dark:border-white`;
  const cardClickableClass =
    'group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95';

  const cardContentClass = 'relative p-0';

  const indexBaseClass =
    'flex items-center justify-center rounded-full text-xs font-bold text-white';
  const indexClass = screenSize
    ? {
        smartphone: 'h-5 w-5 bg-indigo-500',
        tablet: 'h-6 w-6 bg-indigo-500',
        pc: 'h-6 w-6 bg-indigo-500',
      }[screenSize]
    : 'h-5 w-5 md:h-6 md:w-6 bg-indigo-500';

  const imageContainerClass = screenSize
    ? {
        smartphone: 'aspect-video overflow-hidden rounded-none bg-gray-200',
        tablet: 'aspect-video overflow-hidden rounded-none bg-gray-200',
        pc: 'aspect-video overflow-hidden rounded-none bg-gray-200',
      }[screenSize]
    : 'aspect-video overflow-hidden rounded-none bg-gray-200';
  const imageClass = 'h-full w-full object-cover';

  const titleClass = screenSize
    ? {
        smartphone: 'mb-1 text-xs font-semibold text-gray-800',
        tablet: 'mb-1 text-md font-semibold text-gray-800',
        pc: 'mb-1 text-2xl font-semibold text-gray-800',
      }[screenSize]
    : 'mb-1 text-xs md:text-sm font-semibold text-gray-800';
  const summaryClass = screenSize
    ? {
        smartphone: 'text-xs text-gray-600',
        tablet: 'text-md text-gray-600',
        pc: 'text-xl text-gray-600',
      }[screenSize]
    : 'text-xs text-gray-600';
  const idClass = screenSize
    ? {
        smartphone: 'mt-1 text-xs text-gray-400',
        tablet: 'mt-2 text-md text-gray-400',
        pc: 'mt-2 text-2xl text-gray-400',
      }[screenSize]
    : 'mt-1 md:mt-2 text-xs text-gray-400';

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
            <div className={`${indexBaseClass} ${indexClass}`}>{index + 1}</div>
            <div className={idClass}>ID: {card.id}</div>
            <h3 className={titleClass}>{card.prototypeNm}</h3>
            <p className={summaryClass}>
              {card.summary || 'No summary available'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
