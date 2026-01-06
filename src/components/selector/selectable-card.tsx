import type { ReactNode } from 'react';
import type { ScreenSize } from '@/types/screen-size';
import { getSelectableCardClasses, getResponsiveStyles } from '@/lib/ui-utils';
import React from 'react';
import { cn } from '@/lib/utils';

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
  /** Screen size for fixed sizing. If not provided, responsive classes will be used */
  screenSize?: ScreenSize;
};

export function SelectableCard({
  isSelected,
  onClick,
  disabled = false,
  icon,
  label,
  className = '',
  alignment = 'center',
  screenSize,
}: SelectableCardProps) {
  const styles = getSelectableCardClasses(isSelected);

  // Size-specific styles
  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      padding: 'p-2',
      gap: 'gap-2',
      iconContainerSize: 'h-6 w-6',
      iconSize: 'h-4 w-4',
      textSize: 'text-sm',
    },
    tablet: {
      padding: 'p-2',
      gap: 'gap-2',
      iconContainerSize: 'h-8 w-8',
      iconSize: 'h-5 w-5',
      textSize: 'text-base',
    },
    pc: {
      padding: 'p-2',
      gap: 'gap-2',
      iconContainerSize: 'h-10 w-10',
      iconSize: 'h-6 w-6',
      textSize: 'text-xl',
    },
    responsive: {
      padding: 'p-2 md:p-4',
      gap: 'gap-2 md:gap-3',
      iconContainerSize: 'h-8 w-8 md:h-12 md:w-12',
      iconSize: 'h-5 w-5 md:h-8 md:w-8',
      textSize: 'text-sm md:text-base lg:text-xl',
    },
  });

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`group relative flex h-full w-full flex-col justify-center overflow-hidden rounded-lg shadow-md ${styles.animation} ${sizeStyles.padding} ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${styles.base} ${className}`}
    >
      <div className={styles.gradient} />
      <div
        className={`relative flex items-center ${sizeStyles.gap} ${
          alignment === 'start' ? 'justify-start' : 'justify-center'
        }`}
      >
        {icon && (
          <div
            className={`flex shrink-0 items-center justify-center rounded-full ${sizeStyles.iconContainerSize} ${styles.iconBg}`}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(
                  icon as React.ReactElement<{ className?: string }>,
                  {
                    className: cn(
                      (icon as React.ReactElement<{ className?: string }>).props
                        .className,
                      sizeStyles.iconSize,
                    ),
                  },
                )
              : icon}
          </div>
        )}
        <div
          className={`flex items-center font-semibold ${sizeStyles.textSize} ${
            alignment === 'start' ? 'w-full flex-1 text-left' : 'text-center'
          } ${styles.title}`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
