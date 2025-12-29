import type { NormalizedPrototype } from '@f88/promidas/types';
import type { GamePlayerState } from '@/models/karuta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type GameResultsPresentationProps = {
  playerStates: GamePlayerState[];
  totalScore: number;
  mochiFudaCards: NormalizedPrototype[];
  onBackToTop: () => void;
  onReplay: () => void;
};

export function GameResultsPresentation({
  playerStates,
  totalScore,
  mochiFudaCards,
  onBackToTop,
  onReplay,
}: GameResultsPresentationProps) {
  // Sort players by score (descending)
  const rankedPlayers = [...playerStates].sort((a, b) => b.score - a.score);
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="mb-2 text-lg text-gray-600">Total Score</p>
              <p className="text-5xl font-bold text-indigo-600">{totalScore}</p>
            </div>
          </CardContent>
        </Card>

        {/* Player Rankings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              🏆 Player Rankings
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankedPlayers.map((ps, index) => (
                <div
                  key={ps.player.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {ps.player.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {ps.mochiFuda.length} cards acquired
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-indigo-100 text-2xl font-bold text-indigo-700"
                    >
                      {ps.score} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MochiFuda */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              MochiFuda ({mochiFudaCards.length} cards)
            </h2>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            onClick={onBackToTop}
            variant="secondary"
            size="lg"
            className="shadow-lg"
          >
            🏠 TOP
          </Button>
          <Button
            onClick={onReplay}
            variant="default"
            size="lg"
            className="shadow-lg"
          >
            🔄 Replay
          </Button>
        </div>
      </div>
    </div>
  );
}
