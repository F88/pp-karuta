import type { Player } from '@/models/karuta';
import { GameManager } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';

export type PlayersSelectorProps = {
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  onTogglePlayer: (playerId: string) => void;
  onAddPlayer: () => void;
  isLoading: boolean;
};

export function PlayersSelector({
  availablePlayers,
  selectedPlayerIds,
  onTogglePlayer,
  onAddPlayer,
  isLoading,
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
            />
          );
        })}

        {/* Add Player Button */}
        <SelectableCard
          isSelected={false}
          onClick={onAddPlayer}
          disabled={isLoading}
          icon={<span className="text-4xl text-gray-400">+</span>}
          alignment="start"
          label=""
          className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
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
