import type { TatamiSize } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { TATAMI_SIZES } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';

export type TatamiSizeSelectorProps = {
  selectedTatamiSize: TatamiSize;
  onSelectTatamiSize: (size: TatamiSize) => void;
  isLoading: boolean;
  screenSize?: ScreenSize;
};

export function TatamiSizeSelector({
  selectedTatamiSize,
  onSelectTatamiSize,
  isLoading,
  screenSize,
}: TatamiSizeSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {TATAMI_SIZES.map((size) => {
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
