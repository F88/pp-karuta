import type { PlayMode } from '@/lib/karuta';
import { Button } from '@/components/ui/button';
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
      <Button
        onClick={() => onSelectPlayMode('touch')}
        disabled={isLoading}
        variant={selectedPlayMode === 'touch' ? 'default' : 'outline'}
        className={`h-auto p-6 ${
          selectedPlayMode === 'touch'
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : ''
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              selectedPlayMode === 'touch'
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 dark:bg-indigo-900'
            }`}
          >
            <Smartphone className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">タッチ</span>
          {/* <span className="text-xs">モバイル向け</span> */}
        </div>
      </Button>

      <Button
        onClick={() => onSelectPlayMode('keyboard')}
        disabled={isLoading}
        variant={selectedPlayMode === 'keyboard' ? 'default' : 'outline'}
        className={`h-auto p-6 ${
          selectedPlayMode === 'keyboard'
            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
            : ''
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              selectedPlayMode === 'keyboard'
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 dark:bg-indigo-900'
            }`}
          >
            <Keyboard className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">キーボード</span>
          {/* <span className="text-xs">PC環境向け</span> */}
        </div>
      </Button>
    </div>
  );
}
