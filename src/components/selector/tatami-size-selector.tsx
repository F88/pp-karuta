import { SelectableCard } from '@/components/selector/selectable-card';
import type { TatamiSize } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import {
  useResponsiveGridColumns,
  useResponsiveGap,
} from '@/hooks/use-responsive-styles';

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
  const gridCols = useResponsiveGridColumns(screenSize, {
    smartphone: 4,
    tablet: 4,
    pc: 4,
  });
  const gridGap = useResponsiveGap(screenSize);

  return (
    <div className={`grid ${gridGap} ${gridCols}`}>
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
