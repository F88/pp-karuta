import type { PlayMode } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';
import { Keyboard, Smartphone } from 'lucide-react';

export type PlayModeSelectorProps = {
  selectedPlayMode: PlayMode | null;
  onSelectPlayMode: (mode: PlayMode) => void;
  isLoading: boolean;
};

export function PlayModeSelector({
  selectedPlayMode,
  onSelectPlayMode,
  isLoading,
}: PlayModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectableCard
        isSelected={selectedPlayMode === 'touch'}
        onClick={() => onSelectPlayMode('touch')}
        disabled={isLoading}
        icon={<Smartphone className="h-6 w-6" />}
        label={<span className="text-lg">タッチ</span>}
      />
      <SelectableCard
        isSelected={selectedPlayMode === 'keyboard'}
        onClick={() => onSelectPlayMode('keyboard')}
        disabled={isLoading}
        icon={<Keyboard className="h-6 w-6" />}
        label={<span className="text-lg">キーボード</span>}
      />
    </div>
  );
}
