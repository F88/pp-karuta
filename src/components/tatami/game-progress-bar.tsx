import type { GamePlayerState } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

type GameProgressBarProps = {
  totalRaces: number;
  currentRace: number;
  playerStates: GamePlayerState[];
  screenSize?: ScreenSize;
};

const PLAYER_COLORS = [
  'bg-blue-500 dark:bg-blue-600',
  'bg-green-500 dark:bg-green-600',
  'bg-purple-500 dark:bg-purple-600',
  'bg-orange-500 dark:bg-orange-600',
];

export function GameProgressBar({
  playerStates,
  totalRaces,
  currentRace,
  screenSize,
}: GameProgressBarProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      bar: {
        height: 'h-2',
        textSize: 'text-xs',
        // showLabels: true,
      },
      legend: {
        textSize: 'text-xs',
      },
      raceInfo: {
        margin: 'me-2',
      },
      container: 'px-4 py-2',
    },
    tablet: {
      bar: {
        height: 'h-4',
        textSize: 'text-sm',
        // showLabels: true,
      },
      legend: {
        textSize: 'text-sm',
      },
      raceInfo: {
        margin: 'me-4',
      },
      container: 'px-8 py-2',
    },
    pc: {
      bar: {
        height: 'h-8',
        textSize: 'text-xl',
        showLabels: true,
      },
      legend: {
        textSize: 'text-base',
      },
      raceInfo: {
        margin: 'me-8',
      },
      container: 'px-12 py-2',
    },
    responsive: {
      bar: {
        height: 'h-4 md:h-6',
        textSize: 'text-xs md:text-sm',
        showLabels: true,
      },
      legend: {
        textSize: 'text-xs md:text-sm',
      },
      raceInfo: {
        margin: 'me-2 md:me-4 lg:me-8',
      },
      container: 'px-4 py-2 md:px-8 lg:px-12',
    },
  });

  // Calculate remaining cards (cards not yet acquired by any player)
  const totalAcquired = playerStates.reduce(
    (sum, ps) => sum + ps.mochiFuda.length,
    0,
  );
  const remainingCards = totalRaces - totalAcquired;

  const showLegend = playerStates.length > 1;

  // Calculate max width for each legend item based on player count
  const legendItemMaxWidth = Math.floor(90 / playerStates.length);

  return (
    <div className={`w-full space-y-1 ${styles.container}`}>
      {/* Legend (optional, shown on larger screens) */}
      {showLegend && (
        <div
          className={`text-muted-foreground flex flex-wrap items-center justify-center gap-2 ${styles.legend.textSize}`}
        >
          {playerStates.map((ps, index) => (
            <div
              key={ps.player.id}
              style={{ maxWidth: `${legendItemMaxWidth}%` }}
              className="flex items-center gap-1"
            >
              <div
                className={`h-3 w-3 shrink-0 rounded-sm ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}
              />
              <span className="min-w-0 flex-1 truncate">
                {ps.player.name}: {ps.mochiFuda.length}
              </span>
            </div>
          ))}
          {/* <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-gray-300 dark:bg-gray-600" />
            <span>残り: {remainingCards}</span>
          </div> */}
        </div>
      )}

      {/* Race info and Stacked bar */}
      <div className="flex items-center gap-2">
        {/* Race info */}
        <div
          className={`shrink-0 font-bold ${styles.raceInfo.margin} ${styles.bar.textSize}`}
        >
          {currentRace} / {totalRaces}
        </div>

        {/* Stacked bar */}
        <div
          className={`flex min-w-0 flex-1 overflow-hidden rounded ${styles.bar.height}`}
        >
          {playerStates.map((ps, index) => {
            const percentage = (ps.mochiFuda.length / totalRaces) * 100;
            if (percentage === 0) return null;

            return (
              <div
                key={ps.player.id}
                style={{ width: `${percentage}%` }}
                className={`${PLAYER_COLORS[index % PLAYER_COLORS.length]} flex items-center justify-center ${styles.bar.textSize} font-semibold text-white transition-all duration-300`}
                title={`${ps.player.name}: ${ps.mochiFuda.length} cards`}
              >
                {styles.bar.showLabels && ps.mochiFuda.length > 0 && (
                  <span className="px-1">{ps.mochiFuda.length}</span>
                )}
              </div>
            );
          })}

          {/* Remaining stack */}
          {remainingCards > 0 && (
            <div
              style={{ width: `${(remainingCards / totalRaces) * 100}%` }}
              className={`flex items-center justify-center bg-gray-300 ${styles.bar.textSize} font-medium text-gray-600 transition-all duration-300 dark:bg-gray-600 dark:text-gray-300`}
              title={`残り: ${remainingCards} cards`}
            >
              {styles.bar.showLabels && remainingCards > 0 && (
                <span className="px-1">{remainingCards}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
