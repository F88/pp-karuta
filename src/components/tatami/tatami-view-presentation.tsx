import type { NormalizedPrototype } from '@f88/promidas/types';
import { Button } from '@/components/ui/button';

export type TatamiViewPresentationProps = {
  yomiFuda: NormalizedPrototype;
  tatamiCards: NormalizedPrototype[];
  currentRace: number;
  totalRaces: number;
  stackCount: number;
  score: number;
  mochiFudaCount: number;
  onSelectCard: (card: NormalizedPrototype) => void;
};

export function TatamiViewPresentation({
  yomiFuda,
  tatamiCards,
  currentRace,
  totalRaces,
  stackCount,
  score,
  mochiFudaCount,
  onSelectCard,
}: TatamiViewPresentationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">🎴 Karuta</h1>
          <div className="flex items-center justify-center gap-4 text-lg text-gray-600">
            <span>
              Race {currentRace} / {totalRaces}
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-yellow-600">Score:</span>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                {score} pts
              </span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-pink-600">MochiFuda:</span>
              <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-pink-700">
                {mochiFudaCount} cards
              </span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-indigo-600">Stack:</span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
                {stackCount} remaining
              </span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-green-600">Tatami:</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                {tatamiCards.length} cards
              </span>
            </span>
          </div>
        </div>

        {/* YomiFuda Area */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-2xl font-bold text-indigo-600">📖 YomiFuda</h2>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {yomiFuda.prototypeNm}
            </span>
          </div>
          <p className="text-lg leading-relaxed text-gray-700">
            {yomiFuda.summary || yomiFuda.freeComment || 'No description'}
          </p>
        </div>

        {/* Tatami Label */}
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          🃏 ToriFuda - Select the correct card!
        </h2>

        {/* Tatami Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tatamiCards.map((card, index) => (
            <Button
              key={card.id}
              onClick={() => onSelectCard(card)}
              variant="outline"
              className="group relative h-auto overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              {/* Card Number Badge */}
              <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                {index + 1}
              </div>

              {/* Card Image */}
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
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

              {/* Card Title */}
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800">
                {card.prototypeNm}
              </h3>

              {/* Card Summary */}
              <p className="line-clamp-3 text-sm text-gray-600">
                {card.summary || 'No summary available'}
              </p>

              {/* ID Badge */}
              <div className="mt-3 text-xs text-gray-400">ID: {card.id}</div>
            </Button>
          ))}
        </div>

        {/* Empty State */}
        {tatamiCards.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl">No cards on Tatami</p>
          </div>
        )}
      </div>
    </div>
  );
}
