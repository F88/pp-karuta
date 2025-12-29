import { Link } from '@tanstack/react-router';
import { ThemeIndicator } from '@/components/theme-indicator';
import { Button } from '@/components/ui/button';
import { RepoStateIndicator } from './repo-state-indicator';
import { AppHeaderPresentation } from './app-header-presentation';
import type { RepositoryState } from '@/lib/repository/promidas-repo';

interface AppHeaderProps {
  repoState: RepositoryState;
  onRepoIndicatorClick: () => void;
}

export function AppHeader({ repoState, onRepoIndicatorClick }: AppHeaderProps) {
  return (
    <AppHeaderPresentation
      homeButton={
        <Button variant="ghost" asChild>
          <Link to="/">🎴</Link>
        </Button>
      }
      rulesButton={
        <Button variant="ghost" asChild>
          <Link to="/intro">📜 掟</Link>
        </Button>
      }
      playerButton={
        <Button variant="ghost" asChild>
          <Link to="/player">👥 プレイヤー</Link>
        </Button>
      }
      repoStateIndicator={
        <RepoStateIndicator state={repoState} onClick={onRepoIndicatorClick} />
      }
      themeToggle={<ThemeIndicator />}
    />
  );
}
