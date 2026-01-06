import { Badge } from '@/components/ui/badge';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

export type GameHeaderProps = {
  currentRace: number;
  totalRaces: number;
  score: number;
  mochiFudaCount: number;
  stackCount: number;
  tatamiCount: number;
  screenSize?: ScreenSize;
};

export function GameHeader({
  currentRace,
  totalRaces,
  score,
  mochiFudaCount,
  stackCount,
  tatamiCount,
  screenSize,
}: GameHeaderProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      text: 'text-xs',
      gap: 'gap-1',
      raceInfo: 'text-lg',
      margin: 'm-2',
    },
    tablet: {
      text: 'text-sm',
      gap: 'gap-2',
      raceInfo: 'text-xl',
      margin: 'm-3',
    },
    pc: {
      text: 'text-base',
      gap: 'gap-4',
      raceInfo: 'text-2xl',
      margin: 'm-4',
    },
    responsive: {
      text: 'text-xs md:text-sm lg:text-base',
      gap: 'gap-1 sm:gap-2 md:gap-4',
      raceInfo: 'text-lg md:text-xl lg:text-2xl',
      margin: 'm-2 md:m-3 lg:m-4',
    },
  });

  return (
    <div className={`text-center ${styles.margin}`}>
      {/* Race info  */}
      <div
        className={`font-bold text-gray-800 dark:text-gray-100 ${styles.raceInfo}`}
      >
        <span>
          {currentRace} / {totalRaces}
        </span>
      </div>

      {import.meta.env.VITE_DEBUG_MODE === 'true' && (
        // Statistics info
        <>
          <div
            className={`flex flex-wrap items-center justify-center ${styles.gap} ${styles.text}`}
          >
            {(!screenSize || screenSize !== 'smartphone') && (
              <span className="text-gray-400 dark:text-gray-600">•</span>
            )}
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                Score:
              </span>
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
              >
                {score} pts
              </Badge>
            </span>
            {(!screenSize || screenSize !== 'smartphone') && (
              <span className="text-gray-400 dark:text-gray-600">•</span>
            )}
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-pink-600 dark:text-pink-400">
                MochiFuda:
              </span>
              <Badge
                variant="outline"
                className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200"
              >
                {mochiFudaCount} cards
              </Badge>
            </span>
            {(!screenSize || screenSize !== 'smartphone') && (
              <span className="text-gray-400 dark:text-gray-600">•</span>
            )}
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Stack:
              </span>
              <Badge
                variant="outline"
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {stackCount} remaining
              </Badge>
            </span>
            {(!screenSize || screenSize !== 'smartphone') && (
              <span className="text-gray-400 dark:text-gray-600">•</span>
            )}
            <span className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-green-600 dark:text-green-400">
                Tatami:
              </span>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              >
                {tatamiCount} cards
              </Badge>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
