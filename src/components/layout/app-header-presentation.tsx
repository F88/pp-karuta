interface AppHeaderPresentationProps {
  homeButton: React.ReactNode;
  rulesButton: React.ReactNode;
  playerButton: React.ReactNode;
  repoStateIndicator: React.ReactNode;
  themeToggle: React.ReactNode;
}

export function AppHeaderPresentation({
  homeButton,
  rulesButton,
  playerButton,
  repoStateIndicator,
  themeToggle,
}: AppHeaderPresentationProps) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {homeButton}
        {rulesButton}
        {playerButton}
      </div>
      <div className="flex items-center gap-2">
        {repoStateIndicator}
        {themeToggle}
      </div>
    </header>
  );
}
