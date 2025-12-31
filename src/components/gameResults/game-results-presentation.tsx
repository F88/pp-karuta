import type { NormalizedPrototype } from '@f88/promidas/types';
import type { GamePlayerState, Deck } from '@/models/karuta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MochiFudaCard } from './mochi-fuda-card';

export type GameResultsPresentationProps = {
  playerStates: GamePlayerState[];
  deck: Deck;
  onBackToTop: () => void;
  onReplay: () => void;
};

export function GameResultsPresentation({
  playerStates,
  deck,
  onBackToTop,
  onReplay,
}: GameResultsPresentationProps) {
  // Sort players by score (descending)
  const rankedPlayers = [...playerStates].sort((a, b) => b.score - a.score);

  // Calculate ranks (same score = same rank)
  const playerRanks: number[] = [];
  rankedPlayers.forEach((ps, index) => {
    if (index === 0) {
      playerRanks.push(1);
    } else if (ps.score === rankedPlayers[index - 1].score) {
      playerRanks.push(playerRanks[index - 1]);
    } else {
      playerRanks.push(index + 1);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
            🎉 Game Complete!
          </h1> */}
          {/* <p className="text-xl text-gray-600 dark:text-gray-300">
            お疲れ様でした！
          </p> */}
        </div>

        {/* Player Rankings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              🏆 Player Rankings
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankedPlayers.map((ps, index) => (
                <div
                  key={ps.player.id}
                  className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                      #{playerRanks[index]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {ps.player.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ps.mochiFuda.length} cards acquired
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-indigo-100 text-2xl font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {ps.score} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MochiFuda by Player */}
        {rankedPlayers.map((ps, index) => {
          const playerMochiFudaCards = ps.mochiFuda
            .map((cardId) => deck.get(cardId))
            .filter((card): card is NormalizedPrototype => card !== undefined);

          return (
            <Card key={ps.player.id} className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    #{playerRanks[index]}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {ps.player.name} の MochiFuda ({playerMochiFudaCards.length}{' '}
                    cards)
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                {playerMochiFudaCards.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    カードを取得できませんでした
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {playerMochiFudaCards.map((card) => (
                      <MochiFudaCard key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

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
