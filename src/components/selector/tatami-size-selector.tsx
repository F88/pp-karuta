import type { TatamiSize } from '@/lib/karuta';
import { TATAMI_SIZES } from '@/lib/karuta';
import { Card, CardContent } from '@/components/ui/card';

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
          <Card
            key={size}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              isSelected
                ? 'border-2 border-indigo-600 bg-indigo-50 shadow-lg'
                : 'border border-gray-300 hover:border-indigo-400 hover:shadow-md'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => !isLoading && onSelectTatamiSize(size)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-2 text-3xl font-bold text-indigo-600">
                {size}
              </div>
              {/* <div className="text-xs text-gray-600">cards</div> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
