import type { Player } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { GameManager } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';

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
  return (
    <>
      <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-3 lg:grid-cols-4">
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
              icon={isSelected ? '✓' : '👤'}
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
          icon={<span className="text-4xl text-gray-400">+</span>}
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
