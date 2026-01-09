import { Badge } from '@/components/ui/badge';
import type { GamePlayerState } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { GameProgressBar } from './game-progress-bar';

type StatisticItemProps = {
  label: string;
  value: string | number;
  labelColor: string;
  badgeColor: string;
  screenSize?: ScreenSize;
};

function StatisticItem({
  label,
  value,
  labelColor,
  badgeColor,
  screenSize,
}: StatisticItemProps) {
  return (
    <>
      {(!screenSize || screenSize !== 'smartphone') && (
        <span className="text-muted-foreground">•</span>
      )}
      <span className="flex items-center gap-1 sm:gap-2">
        <span className={`font-semibold ${labelColor}`}>{label}:</span>
        <Badge variant="outline" className={badgeColor}>
          {value}
        </Badge>
      </span>
    </>
  );
}

type StatisticsInfoProps = {
  score: number;
  mochiFudaCount: number;
  stackCount: number;
  tatamiCount: number;
  totalRaces: number;
  screenSize?: ScreenSize;
  styles: {
    gap: string;
    text: string;
  };
};

function StatisticsInfo({
  score,
  mochiFudaCount,
  stackCount,
  tatamiCount,
  totalRaces,
  screenSize,
  styles,
}: StatisticsInfoProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center ${styles.gap} ${styles.text}`}
    >
      <StatisticItem
        label="Tatami"
        value={`${tatamiCount} cards`}
        labelColor="text-green-600 dark:text-green-400"
        badgeColor="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
        screenSize={screenSize}
      />
      <StatisticItem
        label="Score"
        value={`${score} pts`}
        labelColor="text-yellow-600 dark:text-yellow-400"
        badgeColor="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
        screenSize={screenSize}
      />

      <StatisticItem
        label="MochiFuda"
        value={`${mochiFudaCount} cards`}
        labelColor="text-pink-600 dark:text-pink-400"
        badgeColor="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200"
        screenSize={screenSize}
      />
      <StatisticItem
        label="Stack"
        value={`${stackCount} remaining`}
        labelColor="text-indigo-600 dark:text-indigo-400"
        badgeColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
        screenSize={screenSize}
      />

      <StatisticItem
        label="TotalRaces"
        value={`${totalRaces} races`}
        labelColor="text-blue-600 dark:text-blue-400"
        badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
        screenSize={screenSize}
      />
    </div>
  );
}

export type GameHeaderProps = {
  currentRace: number;
  totalRaces: number;
  score: number;
  mochiFudaCount: number;
  stackCount: number;
  tatamiCount: number;
  playerStates: GamePlayerState[];
  screenSize?: ScreenSize;
};

export function GameHeader({
  currentRace,
  totalRaces,
  score,
  mochiFudaCount,
  stackCount,
  tatamiCount,
  playerStates,
  screenSize,
}: GameHeaderProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      text: 'text-xs',
      gap: 'gap-1',
      raceInfo: 'text-lg',
      margin: 'm-0',
    },
    tablet: {
      text: 'text-sm',
      gap: 'gap-2',
      raceInfo: 'text-xl',
      margin: 'm-0',
    },
    pc: {
      text: 'text-base',
      gap: 'gap-4',
      raceInfo: 'text-2xl',
      margin: 'm-0',
    },
    responsive: {
      text: 'text-xs md:text-sm lg:text-base',
      gap: 'gap-1 sm:gap-2 md:gap-4',
      raceInfo: 'text-lg md:text-xl lg:text-2xl',
      margin: 'm-2 md:m-3 lg:m-4',
    },
  });

  return (
    <div className={`text-center ${styles.margin} space-y-2`}>
      {/* Race info  */}
      {/* <div className={`text-foreground font-bold ${styles.raceInfo}`}>
        <span>
          {currentRace} / {totalRaces}
        </span>
      </div> */}

      {/* Progress Bar */}
      <GameProgressBar
        totalRaces={totalRaces}
        currentRace={currentRace}
        playerStates={playerStates}
        screenSize={screenSize}
      />

      {import.meta.env.VITE_DEBUG_MODE === 'true' && (
        <StatisticsInfo
          score={score}
          mochiFudaCount={mochiFudaCount}
          stackCount={stackCount}
          tatamiCount={tatamiCount}
          totalRaces={totalRaces}
          screenSize={screenSize}
          styles={styles}
        />
      )}
    </div>
  );
}
