import { SelectableCard } from '@/components/selector/selectable-card';
import type { TatamiSize } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

export type TatamiSizeSelectorProps = {
  selectedTatamiSize: TatamiSize;
  onSelectTatamiSize: (size: TatamiSize) => void;
  availableSizes: readonly TatamiSize[];
  isLoading: boolean;
  screenSize?: ScreenSize;
};

export function TatamiSizeSelector({
  selectedTatamiSize,
  onSelectTatamiSize,
  availableSizes,
  isLoading,
  screenSize,
}: TatamiSizeSelectorProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gridCols: 'grid-cols-4',
      gap: 'gap-2',
    },
    tablet: {
      gridCols: 'grid-cols-4',
      gap: 'gap-3',
    },
    pc: {
      gridCols: 'grid-cols-4',
      gap: 'gap-4',
    },
    responsive: {
      gridCols: 'grid-cols-4',
      gap: 'gap-2 md:gap-3 lg:gap-4',
    },
  });

  return (
    <div className={`grid ${styles.gap} ${styles.gridCols}`}>
      {availableSizes.map((size) => {
        const isSelected = selectedTatamiSize === size;
        return (
          <SelectableCard
            key={size}
            isSelected={isSelected}
            onClick={() => onSelectTatamiSize(size)}
            disabled={isLoading}
            label={String(size)}
            alignment={'center'}
            screenSize={screenSize}
          />
        );
      })}
    </div>
  );
}
