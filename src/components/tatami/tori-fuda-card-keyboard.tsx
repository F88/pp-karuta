import { Card, CardContent } from '@/components/ui/card';
import { Kbd } from '@/components/ui/kbd';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';

export type ToriFudaCardKeyboardProps = {
  normalizedPrototype: NormalizedPrototype;
  index: number;
  isClickable?: boolean;
  showImage?: boolean;
  onClick?: (card: NormalizedPrototype) => void;
  keyboardKey?: string;
  screenSize: ScreenSize;
};

export function ToriFudaCardKeyboard({
  normalizedPrototype: card,
  index,
  isClickable = false,
  showImage = false,
  onClick,
  keyboardKey,
  screenSize,
}: ToriFudaCardKeyboardProps) {
  const cardBaseClass = 'rounded-none border-2 border-black dark:border-white';
  const cardClickableClass =
    'group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95';

  const cardContentClass = 'relative p-0';

  const keyboardKeyContainerClass = showImage
    ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'
    : 'flex h-full min-h-[100px] items-center justify-center';
  const keyboardKeyClass = screenSize
    ? {
        smartphone: 'text-2xl font-bold shadow-lg',
        tablet: 'text-3xl font-bold shadow-lg',
        pc: 'text-4xl font-bold shadow-lg',
      }[screenSize]
    : 'text-2xl md:text-3xl lg:text-4xl font-bold shadow-lg';

  const imageContainerClass = screenSize
    ? {
        smartphone: 'aspect-video overflow-hidden rounded-none bg-gray-200',
        tablet: 'aspect-video overflow-hidden rounded-none bg-gray-200',
        pc: 'aspect-video overflow-hidden rounded-none bg-gray-200',
      }[screenSize]
    : 'aspect-video overflow-hidden rounded-none bg-gray-200';
  const imageClass = 'h-full w-full object-cover';

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
    <Card
      className={
        isClickable ? `${cardBaseClass} ${cardClickableClass}` : cardBaseClass
      }
      onClick={isClickable && onClick ? () => onClick(card) : undefined}
    >
      <CardContent className={cardContentClass}>
        {/* Keyboard Key Indicator (when no image) */}
        {keyboardKey && !showImage && (
          <div className={keyboardKeyContainerClass}>
            <Kbd className={keyboardKeyClass}>{keyboardKey.toUpperCase()}</Kbd>
          </div>
        )}

        {showImage && (
          <div className={`${imageContainerClass} relative`}>
            {/* Keyboard Key Indicator (overlay on image) */}
            {keyboardKey && (
              <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <Kbd className={keyboardKeyClass}>
                  {keyboardKey.toUpperCase()}
                </Kbd>
              </div>
            )}
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
