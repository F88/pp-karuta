import { SelectableCard } from '@/components/selector/selectable-card';
import type { TatamiSize } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';

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
  return (
    <div className="grid grid-cols-4 gap-4">
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
