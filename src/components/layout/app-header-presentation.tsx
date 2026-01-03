import type { ScreenSize } from '@/types/screen-size';

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
  const headerLabel = `Application header - ${screenSize} view`;

  return (
    <header
      className="h-12 border-b bg-white md:h-14 lg:h-16 dark:border-gray-800 dark:bg-gray-950"
      aria-label={headerLabel}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-1 md:gap-2">
          {homeButton}
          {playerButton}
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          {rulesButton}
          {repoStateIndicator}
          {themeToggle}
        </div>
      </div>
    </header>
  );
}
