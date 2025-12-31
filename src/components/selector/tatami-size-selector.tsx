import type { TatamiSize } from '@/lib/karuta';
import { TATAMI_SIZES } from '@/lib/karuta';
import { SelectableCard } from '@/components/selector/selectable-card';

export type TatamiSizeSelectorProps = {
  selectedTatamiSize: TatamiSize;
  onSelectTatamiSize: (size: TatamiSize) => void;
  isLoading: boolean;
};

export function TatamiSizeSelector({
  selectedTatamiSize,
  onSelectTatamiSize,
  isLoading,
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
          />
        );
      })}
    </div>
  );
}
