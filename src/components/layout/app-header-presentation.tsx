import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

interface AppHeaderPresentationProps {
  screenSize: ScreenSize;
  homeButton: React.ReactNode;
  rulesButton: React.ReactNode;
  playerButton: React.ReactNode;
  repoStateIndicator: React.ReactNode;
  themeToggle: React.ReactNode;
}

export function AppHeaderPresentation({
  screenSize,
  homeButton,
  rulesButton,
  playerButton,
  repoStateIndicator,
  themeToggle,
}: AppHeaderPresentationProps) {
  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      height: 'h-10',
      padding: 'px-2',
      gap: 'gap-1',
    },
    tablet: {
      height: 'h-12',
      padding: 'px-4',
      gap: 'gap-2',
    },
    pc: {
      height: 'h-14',
      padding: 'px-4',
      gap: 'gap-2',
    },
    responsive: {
      height: 'h-12 md:h-14 lg:h-16',
      padding: 'px-2 md:px-4',
      gap: 'gap-1 md:gap-2',
    },
  });

  const headerLabel = `Application header - ${screenSize} view`;

  return (
    <header
      className={`border-b bg-white dark:border-gray-800 dark:bg-gray-950 ${sizeStyles.height}`}
      aria-label={headerLabel}
    >
      <div
        className={`mx-auto flex h-full max-w-7xl items-center justify-between ${sizeStyles.padding}`}
      >
        <div className={`flex items-center ${sizeStyles.gap}`}>
          {homeButton}
          {playerButton}
        </div>
        <div className={`flex items-center ${sizeStyles.gap}`}>
          {rulesButton}
          {repoStateIndicator}
          {themeToggle}
        </div>
      </div>
    </header>
  );
}
