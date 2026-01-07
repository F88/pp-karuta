import type { ScreenSize } from '@/types/screen-size';

/**
 * Get consistent selectable card style classes based on selection state
 */
export function getSelectableCardClasses(isSelected: boolean) {
  return {
    base: isSelected
      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
      : 'bg-white dark:bg-gray-800',
    title: isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100',
    description: isSelected
      ? 'text-white/90'
      : 'text-gray-600 dark:text-gray-400',
    label: isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400',
    content: isSelected ? 'text-white/90' : 'text-gray-700 dark:text-gray-300',
    iconBg: isSelected
      ? 'bg-white/20 text-white'
      : 'bg-indigo-100 dark:bg-indigo-900',
    animation:
      'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0',
    gradient: `absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10 ${
      isSelected ? 'opacity-20' : ''
    }`,
  };
}

/**
 * Get responsive style configuration based on screen size
 */
export function getResponsiveStyles<T>(
  screenSize: ScreenSize | undefined,
  variants: {
    smartphone: T;
    tablet: T;
    pc: T;
    responsive?: T;
  },
): T {
  if (!screenSize && variants.responsive) {
    return variants.responsive;
  }
  return variants[screenSize || 'tablet'];
}
