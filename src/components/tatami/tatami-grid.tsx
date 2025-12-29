import type { NormalizedPrototype } from '@f88/promidas/types';
import { Button } from '@/components/ui/button';

export type TatamiGridProps = {
  normalizedPrototypes: NormalizedPrototype[];
  onCardClick: (card: NormalizedPrototype) => void;
};

export function TatamiGrid({
  normalizedPrototypes,
  onCardClick,
}: TatamiGridProps) {
  return (
    <div>
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
        🃏 ToriFuda - Select the correct card!
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {normalizedPrototypes.map((normalizedPrototype, index) => (
          <Button
            key={normalizedPrototype.id}
            onClick={() => onCardClick(normalizedPrototype)}
            variant="outline"
            className="group relative h-auto overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
              <img
                src={normalizedPrototype.mainUrl}
                alt={normalizedPrototype.prototypeNm}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800">
              {normalizedPrototype.prototypeNm}
            </h3>
            <p className="line-clamp-3 text-sm text-gray-600">
              {normalizedPrototype.summary || 'No summary available'}
            </p>
            <div className="mt-3 text-xs text-gray-400">
              ID: {normalizedPrototype.id}
            </div>
          </Button>
        ))}
      </div>
      {normalizedPrototypes.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <p className="text-xl">No cards on Tatami</p>
        </div>
      )}
    </div>
  );
}
