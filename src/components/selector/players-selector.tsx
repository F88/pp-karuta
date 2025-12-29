import type { Player } from '@/models/karuta';
import { GameManager } from '@/lib/karuta';
import { PlayerSelectionCard } from '@/components/player/player-selection-card';

export type PlayersSelectorProps = {
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  onTogglePlayer: (playerId: string) => void;
  isLoading: boolean;
};

export function PlayersSelector({
  availablePlayers,
  selectedPlayerIds,
  onTogglePlayer,
  isLoading,
}: PlayersSelectorProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {availablePlayers.map((player) => {
          const isSelected = selectedPlayerIds.includes(player.id);
          const maxPlayersReached =
            selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS;
          return (
            <PlayerSelectionCard
              key={player.id}
              player={player}
              isSelected={isSelected}
              onToggle={onTogglePlayer}
              isDisabled={isLoading || (!isSelected && maxPlayersReached)}
            />
          );
        })}
      </div>
      {selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          最大{GameManager.MAX_GAME_PLAYERS}人まで選択できます
        </p>
      )}
    </>
  );
}
