import { useState, useEffect, useCallback } from 'react';
import { PlayerManager } from '@/lib/karuta';
import type { Player } from '@/models/karuta';
import { PlayerManagerPresentation } from './player-manager-presentation';

export function PlayerManagerContainer() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load players on mount
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPlayers = await PlayerManager.initialize();
      setPlayers(loadedPlayers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load players';
      setError(errorMessage);
      console.error('Failed to load players:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlayer = useCallback(() => {
    if (players.length >= PlayerManager.MAX_PLAYERS) {
      setError(`Maximum ${PlayerManager.MAX_PLAYERS} players allowed`);
      return;
    }

    const newId = `player-${Date.now()}`;
    const newPlayer = PlayerManager.createPlayer(
      newId,
      `Player ${players.length + 1}`,
    );
    const updatedPlayers = [...players, newPlayer];

    setPlayers(updatedPlayers);
    PlayerManager.savePlayers(updatedPlayers).catch((err) => {
      console.error('Failed to save players:', err);
      setError('Failed to save players');
    });
  }, [players]);

  const handleUpdatePlayer = useCallback(
    (id: string, name: string) => {
      const updatedPlayers = players.map((p) =>
        p.id === id ? { ...p, name: name.trim() } : p,
      );

      setPlayers(updatedPlayers);
      PlayerManager.savePlayers(updatedPlayers).catch((err) => {
        console.error('Failed to save players:', err);
        setError('Failed to save players');
      });
    },
    [players],
  );

  const handleDeletePlayer = useCallback(
    (id: string) => {
      if (players.length <= 1) {
        setError('At least one player must exist');
        return;
      }

      const updatedPlayers = players.filter((p) => p.id !== id);

      setPlayers(updatedPlayers);
      PlayerManager.savePlayers(updatedPlayers).catch((err) => {
        console.error('Failed to save players:', err);
        setError('Failed to save players');
      });
    },
    [players],
  );

  return (
    <PlayerManagerPresentation
      players={players}
      isLoading={isLoading}
      error={error}
      onAddPlayer={handleAddPlayer}
      onUpdatePlayer={handleUpdatePlayer}
      onDeletePlayer={handleDeletePlayer}
    />
  );
}
