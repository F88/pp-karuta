import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Player } from '@/models/karuta';

interface PlayerManagerPresentationProps {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  onAddPlayer: () => void;
  onUpdatePlayer: (id: string, name: string) => void;
  onDeletePlayer: (id: string) => void;
}

export function PlayerManagerPresentation({
  players,
  isLoading,
  error,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
}: PlayerManagerPresentationProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>プレイヤー管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p>読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>プレイヤー管理</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {players.map((player) => (
              <PlayerItem
                key={player.id}
                player={player}
                onUpdate={onUpdatePlayer}
                onDelete={onDeletePlayer}
                canDelete={players.length > 1}
              />
            ))}
          </div>

          <div className="mt-4">
            <Button
              onClick={onAddPlayer}
              disabled={players.length >= 4}
              className="w-full"
            >
              + プレイヤーを追加
            </Button>
            {players.length >= 4 && (
              <p className="mt-2 text-center text-sm text-gray-500">
                最大4人まで登録できます
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlayerItemProps {
  player: Player;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function PlayerItem({
  player,
  onUpdate,
  onDelete,
  canDelete,
}: PlayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(player.id, editName);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(player.name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 rounded border p-3">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 rounded border px-2 py-1 dark:bg-gray-800"
            autoFocus
            placeholder="プレイヤー名"
            aria-label="プレイヤー名"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button size="sm" onClick={handleSave}>
            保存
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 font-medium">{player.name}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            編集
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(player.id)}
            disabled={!canDelete}
          >
            削除
          </Button>
        </>
      )}
    </div>
  );
}
