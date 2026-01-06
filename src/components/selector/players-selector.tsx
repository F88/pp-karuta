import type { Player } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { GameManager } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { User, UserPlus } from 'lucide-react';

export type PlayersSelectorProps = {
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  onTogglePlayer: (playerId: string) => void;
  onAddPlayer: () => void;
  isLoading: boolean;
  screenSize?: ScreenSize;
};

export function PlayersSelector({
  availablePlayers,
  selectedPlayerIds,
  onTogglePlayer,
  onAddPlayer,
  isLoading,
  screenSize,
}: PlayersSelectorProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gridCols: 'grid-cols-2',
      gap: 'gap-2',
    },
    tablet: {
      gridCols: 'grid-cols-3',
      gap: 'gap-3',
    },
    pc: {
      gridCols: 'grid-cols-4',
      gap: 'gap-4',
    },
    responsive: {
      gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      gap: 'gap-2 md:gap-3 lg:gap-4',
    },
  });

  return (
    <>
      <div className={`grid ${styles.gap} ${styles.gridCols}`}>
        {availablePlayers.map((player) => {
          const isSelected = selectedPlayerIds.includes(player.id);
          const maxPlayersReached =
            selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS;
          return (
            <SelectableCard
              key={player.id}
              isSelected={isSelected}
              onClick={() => onTogglePlayer(player.id)}
              disabled={isLoading || (!isSelected && maxPlayersReached)}
              icon={<User />}
              label={player.name}
              alignment="start"
              screenSize={screenSize}
            />
          );
        })}

        {/* Add Player Button */}
        <SelectableCard
          isSelected={false}
          onClick={onAddPlayer}
          disabled={
            isLoading ||
            selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS
          }
          icon={<UserPlus />}
          label=""
          className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
          alignment="center"
          screenSize={screenSize}
        />
      </div>
      {selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ゲームに参加できるのは最大{GameManager.MAX_GAME_PLAYERS}人までです
        </p>
      )}
    </>
  );
}
