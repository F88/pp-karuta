import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export type SelectableCardProps = {
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  className?: string;
  alignment?: 'start' | 'center';
};

export function SelectableCard({
  isSelected,
  onClick,
  disabled = false,
  icon,
  label,
  className = '',
  alignment = 'center',
}: SelectableCardProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto w-full overflow-hidden rounded-xl p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
        isSelected
          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
          : 'bg-white dark:bg-gray-800'
      } ${className}`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10 ${
          isSelected ? 'opacity-20' : ''
        }`}
      />
      <div
        className={`relative flex items-center gap-3 ${
          alignment === 'start' ? 'justify-start' : 'justify-center'
        }`}
      >
        {icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 dark:bg-indigo-900'
            }`}
          >
            {icon}
          </div>
        )}
        <div className={`${icon ? 'flex-1 text-left' : 'text-center'}`}>
          <div
            className={`text-xl font-semibold ${
              isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {label}
          </div>
        </div>
      </div>
    </Button>
  );
}
