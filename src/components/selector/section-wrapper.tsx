import type { ReactNode } from 'react';
import type { ScreenSize } from '@/types/screen-size';

export type SectionWrapperProps = {
  /** Section title displayed at the top */
  title: string;
  /** Color variant for the section header */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Child content to display in the section */
  children: ReactNode;
  /** Optional additional CSS classes */
  className?: string;
  /** Screen size for fixed sizing. If not provided, responsive classes will be used */
  screenSize?: ScreenSize;
};

const variantStyles = {
  primary: 'text-indigo-600 dark:text-indigo-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  danger: 'text-red-600 dark:text-red-400',
};

export function SectionWrapper({
  title,
  variant = 'primary',
  children,
  className = '',
  screenSize,
}: SectionWrapperProps) {
  const titleSizeClass = screenSize
    ? {
        smartphone: 'text-xs',
        tablet: 'text-sm',
        pc: 'text-base',
      }[screenSize]
    : 'text-xs md:text-sm lg:text-base';

  const paddingClass = screenSize
    ? {
        smartphone: 'p-3 pt-5',
        tablet: 'p-4 pt-6',
        pc: 'p-4 pt-6',
      }[screenSize]
    : 'p-3 pt-5 md:p-4 md:pt-6';

  const titlePositionClass = screenSize
    ? {
        smartphone: '-top-2 left-3 px-1.5',
        tablet: '-top-2.5 left-4 px-2',
        pc: '-top-2.5 left-4 px-2',
      }[screenSize]
    : '-top-2 left-3 px-1.5 md:-top-2.5 md:left-4 md:px-2';

  const spacingClass = screenSize
    ? {
        smartphone: 'space-y-2',
        tablet: 'space-y-3',
        pc: 'space-y-3',
      }[screenSize]
    : 'space-y-2 md:space-y-3';

  return (
    <div
      className={`relative rounded-lg border-2 border-gray-200 dark:border-gray-700 ${paddingClass} ${className}`}
    >
      <h2
        className={`absolute bg-gradient-to-br from-indigo-50 to-purple-50 font-bold tracking-wider uppercase dark:from-gray-900 dark:to-gray-800 ${titleSizeClass} ${titlePositionClass} ${variantStyles[variant]}`}
      >
        {title}
      </h2>
      <div className={spacingClass}>{children}</div>
    </div>
  );
}
