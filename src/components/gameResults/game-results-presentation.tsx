import type { NormalizedPrototype } from '@f88/promidas/types';
import type { GamePlayerState, Deck } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MochiFudaCard } from './mochi-fuda-card';

type ActionButtonsProps = {
  onBackToTop: () => void;
  onReplay: () => void;
  buttonsGap: string;
  buttonSize: 'default' | 'lg';
};

function ActionButtons({
  onBackToTop,
  onReplay,
  buttonsGap,
  buttonSize,
}: ActionButtonsProps) {
  return (
    <div className={`flex flex-col justify-center sm:flex-row ${buttonsGap}`}>
      <Button
        onClick={onBackToTop}
        variant="secondary"
        size={buttonSize}
        className="shadow-lg"
      >
        🎴 MENU
      </Button>
      <Button
        onClick={onReplay}
        variant="default"
        size={buttonSize}
        className="shadow-lg"
      >
        🔄 REPLAY
      </Button>
    </div>
  );
}

export type GameResultsPresentationProps = {
  playerStates: GamePlayerState[];
  deck: Deck;
  onBackToTop: () => void;
  onReplay: () => void;
  screenSize?: ScreenSize;
};

export function GameResultsPresentation({
  playerStates,
  deck,
  onBackToTop,
  onReplay,
  screenSize,
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

  const sizeStyles = screenSize
    ? {
        smartphone: {
          container: {
            padding: 'p-4',
            maxWidth: 'max-w-full',
          },
          header: {
            margin: 'mb-4',
          },
          title: {
            size: 'text-xl',
          },
          card: {
            margin: 'mb-4',
          },
          ranking: {
            icon: 'h-8 w-8 text-lg',
            name: 'text-base',
            info: 'text-xs',
            badge: 'text-lg',
            padding: 'p-3',
            gap: 'gap-2',
          },
          playerCard: {
            icon: 'h-8 w-8 text-base',
            title: 'text-lg',
            gap: 'gap-2',
          },
          grid: 'grid-cols-1',
          buttons: {
            size: 'default' as const,
            gap: 'gap-2',
          },
        },
        tablet: {
          container: {
            padding: 'p-6',
            maxWidth: 'max-w-3xl',
          },
          header: {
            margin: 'mb-6',
          },
          title: {
            size: 'text-2xl',
          },
          card: {
            margin: 'mb-5',
          },
          ranking: {
            icon: 'h-10 w-10 text-xl',
            name: 'text-lg',
            info: 'text-sm',
            badge: 'text-xl',
            padding: 'p-3',
            gap: 'gap-3',
          },
          playerCard: {
            icon: 'h-9 w-9 text-lg',
            title: 'text-xl',
            gap: 'gap-2',
          },
          grid: 'grid-cols-2',
          buttons: {
            size: 'lg' as const,
            gap: 'gap-3',
          },
        },
        pc: {
          container: {
            padding: 'p-8',
            maxWidth: 'max-w-4xl',
          },
          header: {
            margin: 'mb-8',
          },
          title: {
            size: 'text-2xl',
          },
          card: {
            margin: 'mb-6',
          },
          ranking: {
            icon: 'h-12 w-12 text-2xl',
            name: 'text-lg',
            info: 'text-sm',
            badge: 'text-2xl',
            padding: 'p-4',
            gap: 'gap-4',
          },
          playerCard: {
            icon: 'h-10 w-10 text-lg',
            title: 'text-xl',
            gap: 'gap-3',
          },
          grid: 'grid-cols-3',
          buttons: {
            size: 'lg' as const,
            gap: 'gap-4',
          },
        },
      }[screenSize]
    : {
        container: {
          padding: 'p-4 md:p-6 lg:p-8',
          maxWidth: 'max-w-full md:max-w-3xl lg:max-w-4xl',
        },
        header: {
          margin: 'mb-4 md:mb-6 lg:mb-8',
        },
        title: {
          size: 'text-xl md:text-2xl',
        },
        card: {
          margin: 'mb-4 md:mb-5 lg:mb-6',
        },
        ranking: {
          icon: 'h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-lg md:text-xl lg:text-2xl',
          name: 'text-base md:text-lg',
          info: 'text-xs md:text-sm',
          badge: 'text-lg md:text-xl lg:text-2xl',
          padding: 'p-3 md:p-3 lg:p-4',
          gap: 'gap-2 md:gap-3 lg:gap-4',
        },
        playerCard: {
          icon: 'h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-base md:text-lg',
          title: 'text-lg md:text-xl',
          gap: 'gap-2 md:gap-2 lg:gap-3',
        },
        grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        buttons: {
          size: 'lg' as const,
          gap: 'gap-2 md:gap-3 lg:gap-4',
        },
      };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${sizeStyles.container.padding}`}
    >
      <div className={`mx-auto ${sizeStyles.container.maxWidth}`}>
        {/* Header */}
        <div className={`text-center ${sizeStyles.header.margin}`}>
          {/* <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
            🎉 Game Complete!
          </h1> */}
          {/* <p className="text-xl text-gray-600 dark:text-gray-300">
            お疲れ様でした！
          </p> */}
        </div>

        {/* Player Rankings */}
        <Card className={sizeStyles.card.margin}>
          <CardHeader>
            <h2
              className={`font-bold text-gray-800 dark:text-gray-100 ${sizeStyles.title.size}`}
            >
              🏆 Player Rankings
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankedPlayers.map((ps, index) => (
                <div
                  key={ps.player.id}
                  className={`flex items-center justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800 ${sizeStyles.ranking.padding}`}
                >
                  <div
                    className={`flex items-center ${sizeStyles.ranking.gap}`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 ${sizeStyles.ranking.icon}`}
                    >
                      {playerRanks[index]}
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-gray-800 dark:text-gray-100 ${sizeStyles.ranking.name}`}
                      >
                        {ps.player.name}
                      </h3>
                      <p
                        className={`text-gray-600 dark:text-gray-400 ${sizeStyles.ranking.info}`}
                      >
                        {ps.mochiFuda.length} cards acquired
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 ${sizeStyles.ranking.badge}`}
                    >
                      {ps.score} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Top */}
        <div className={sizeStyles.card.margin}>
          <ActionButtons
            onBackToTop={onBackToTop}
            onReplay={onReplay}
            buttonsGap={sizeStyles.buttons.gap}
            buttonSize={sizeStyles.buttons.size}
          />
        </div>

        {/* MochiFuda by Player */}
        {rankedPlayers.map((ps, index) => {
          const playerMochiFudaCards = ps.mochiFuda
            .map((cardId) => deck.get(cardId))
            .filter((card): card is NormalizedPrototype => card !== undefined);

          return (
            <Card key={ps.player.id} className={sizeStyles.card.margin}>
              <CardHeader>
                <div
                  className={`flex items-center ${sizeStyles.playerCard.gap}`}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 ${sizeStyles.playerCard.icon}`}
                  >
                    {playerRanks[index]}
                  </div>
                  <h2
                    className={`font-bold text-gray-800 dark:text-gray-100 ${sizeStyles.playerCard.title}`}
                  >
                    {ps.player.name} (
                    {playerMochiFudaCards.length.toLocaleString()} 枚)
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                {playerMochiFudaCards.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    NO FUDA
                  </p>
                ) : (
                  <div className={`grid gap-4 ${sizeStyles.grid}`}>
                    {playerMochiFudaCards.map((card) => (
                      <MochiFudaCard key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Action Buttons - Bottom */}
        <ActionButtons
          onBackToTop={onBackToTop}
          onReplay={onReplay}
          buttonsGap={sizeStyles.buttons.gap}
          buttonSize={sizeStyles.buttons.size}
        />
      </div>
    </div>
  );
}
