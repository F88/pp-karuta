import type { NormalizedPrototype } from '@f88/promidas/types';
import { Card, CardContent } from '@/components/ui/card';

export type ToriFudaCardProps = {
  normalizedPrototype: NormalizedPrototype;
  index: number;
  isClickable?: boolean;
  onClick?: (card: NormalizedPrototype) => void;
};

export function ToriFudaCard({
  normalizedPrototype: card,
  index,
  isClickable = false,
  onClick,
}: ToriFudaCardProps) {
  return (
    <Card
      className={
        isClickable
          ? 'group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95'
          : 'border-gray-300'
      }
      onClick={isClickable && onClick ? () => onClick(card) : undefined}
    >
      <CardContent className="relative p-4">
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
          {index + 1}
        </div>
        <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-200">
          <img
            src={card.mainUrl}
            alt={card.prototypeNm}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <>
            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800">
              {card.prototypeNm}
            </h3>
            <p className="line-clamp-2 text-xs text-gray-600">
              {card.summary || 'No summary available'}
            </p>
            <div className="mt-2 text-xs text-gray-400">ID: {card.id}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
