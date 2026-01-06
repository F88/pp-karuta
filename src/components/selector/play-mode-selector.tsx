import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { SelectableCard } from '@/components/selector/selectable-card';
import { Keyboard, Smartphone } from 'lucide-react';
import {
  useResponsiveGridColumns,
  useResponsiveGap,
} from '@/hooks/use-responsive-styles';

export type PlayModeSelectorProps = {
  selectedPlayMode: PlayMode | null;
  onSelectPlayMode: (mode: PlayMode) => void;
  isLoading: boolean;
  screenSize?: ScreenSize;
};

export function PlayModeSelector({
  selectedPlayMode,
  onSelectPlayMode,
  isLoading,
  screenSize,
}: PlayModeSelectorProps) {
  const gridCols = useResponsiveGridColumns(screenSize, {
    smartphone: 2,
    tablet: 2,
    pc: 2,
  });
  const gridGap = useResponsiveGap(screenSize);

  return (
    <div className={`grid ${gridGap} ${gridCols}`}>
      <SelectableCard
        isSelected={selectedPlayMode === 'touch'}
        onClick={() => onSelectPlayMode('touch')}
        disabled={isLoading}
        icon={<Smartphone className="h-6 w-6" />}
        label="タッチ"
        alignment={'center'}
        screenSize={screenSize}
      />
      <SelectableCard
        isSelected={selectedPlayMode === 'keyboard'}
        onClick={() => onSelectPlayMode('keyboard')}
        disabled={isLoading}
        icon={<Keyboard className="h-6 w-6" />}
        label="キーボード"
        alignment={'center'}
        screenSize={screenSize}
      />
    </div>
  );
}
