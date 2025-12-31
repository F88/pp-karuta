import type { ReactNode } from 'react';

/**
 * SelectableCard component for displaying selectable options with optional icons.
 */
export type SelectableCardProps = {
  /** Whether the card is currently selected */
  isSelected: boolean;
  /** Callback function when the card is clicked */
  onClick: () => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Optional icon to display in a circular badge */
  icon?: ReactNode;
  /** Label text to display */
  label: string;
  /** Additional CSS classes */
  className?: string;
  /** Alignment of content: 'start' (left) or 'center' */
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
    <div
      onClick={disabled ? undefined : onClick}
      className={`group relative h-auto w-full overflow-hidden rounded-xl p-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 md:p-4 ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:scale-105'
      } ${
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
        className={`relative flex items-center gap-2 md:gap-3 ${
          alignment === 'start' ? 'justify-start' : 'justify-center'
        }`}
      >
        {icon && (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12 ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 dark:bg-indigo-900'
            }`}
          >
            {icon}
          </div>
        )}
        <div
          className={`${alignment === 'start' ? 'w-full' : ''} ${alignment === 'start' && icon ? 'flex-1' : ''}`}
        >
          <div
            className={`${alignment === 'start' ? 'w-full' : ''} text-base font-semibold md:text-xl ${
              alignment === 'start' ? 'text-left' : 'text-center'
            } ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
