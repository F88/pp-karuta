import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { SelectableCard } from '@/components/selector/selectable-card';
import { Keyboard, Smartphone } from 'lucide-react';
import { getResponsiveStyles } from '@/lib/ui-utils';

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
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gridCols: 'grid-cols-2',
      gap: 'gap-2',
    },
    tablet: {
      gridCols: 'grid-cols-2',
      gap: 'gap-3',
    },
    pc: {
      gridCols: 'grid-cols-2',
      gap: 'gap-4',
    },
    responsive: {
      gridCols: 'grid-cols-2',
      gap: 'gap-2 md:gap-3 lg:gap-4',
    },
  });

  return (
    <div className={`grid ${styles.gap} ${styles.gridCols}`}>
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
