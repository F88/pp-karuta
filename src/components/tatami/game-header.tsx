import { Badge } from '@/components/ui/badge';
import type { ScreenSize } from '@/types/screen-size';

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
  const textSizeClass = screenSize
    ? {
        smartphone: 'text-xs',
        tablet: 'text-sm',
        pc: 'text-base',
      }[screenSize]
    : 'text-xs sm:text-sm md:text-base';

  const gapClass = screenSize
    ? {
        smartphone: 'gap-1',
        tablet: 'gap-2',
        pc: 'gap-4',
      }[screenSize]
    : 'gap-1 sm:gap-2 md:gap-4';

  const raceInfoSizeClass = screenSize
    ? {
        smartphone: 'text-lg',
        tablet: 'text-xl',
        pc: 'text-2xl',
      }[screenSize]
    : 'text-lg sm:text-xl md:text-2xl';

  const marginClass = screenSize
    ? {
        smartphone: 'my-2',
        tablet: 'my-3',
        pc: 'my-4',
      }[screenSize]
    : 'my-2 sm:my-3 md:my-4';

  return (
    <div className={`text-center ${marginClass}`}>
      {/* Race info  */}
      <div
        className={`font-bold text-gray-800 dark:text-gray-100 ${raceInfoSizeClass}`}
      >
        <span>
          {currentRace} / {totalRaces}
        </span>
      </div>

      {import.meta.env.VITE_DEBUG_MODE === 'true' && (
        // Statistics info
        <>
          <div
            className={`flex flex-wrap items-center justify-center ${gapClass} ${textSizeClass}`}
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
