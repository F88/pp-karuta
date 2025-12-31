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

  return (
    <div
      className={`relative rounded-lg border-2 border-gray-200 p-4 pt-6 dark:border-gray-700 ${className}`}
    >
      <h2
        className={`absolute -top-2.5 left-4 bg-gradient-to-br from-indigo-50 to-purple-50 px-2 font-bold tracking-wider uppercase dark:from-gray-900 dark:to-gray-800 ${titleSizeClass} ${variantStyles[variant]}`}
      >
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
