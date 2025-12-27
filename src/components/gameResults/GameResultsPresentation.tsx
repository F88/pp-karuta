import type { NormalizedPrototype } from '@f88/promidas/types';

export type GameResultsPresentationProps = {
  score: number;
  mochiFudaCards: NormalizedPrototype[];
  onBackToTop: () => void;
  onReplay: () => void;
};

export function GameResultsPresentation({
  score,
  mochiFudaCards,
  onBackToTop,
  onReplay,
}: GameResultsPresentationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            🎉 Game Complete!
          </h1>
          <p className="text-xl text-gray-600">お疲れ様でした！</p>
        </div>

        {/* Score */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <p className="mb-2 text-lg text-gray-600">Final Score</p>
            <p className="text-5xl font-bold text-indigo-600">{score}</p>
          </div>
        </div>

        {/* MochiFuda */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            MochiFuda ({mochiFudaCards.length} cards)
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mochiFudaCards.map((card) => (
              <div
                key={card.id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                {card.mainUrl && (
                  <img
                    src={card.mainUrl}
                    alt={card.prototypeNm}
                    className="mb-2 h-32 w-full rounded object-cover"
                  />
                )}
                <h3 className="mb-1 text-sm font-semibold text-gray-800">
                  {card.prototypeNm}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {card.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={onBackToTop}
            className="rounded-lg bg-gray-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-gray-700"
          >
            🏠 TOP
          </button>
          <button
            onClick={onReplay}
            className="rounded-lg bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700"
          >
            🔄 Replay
          </button>
        </div>
      </div>
    </div>
  );
}
