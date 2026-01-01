import { Link, useNavigate } from '@tanstack/react-router';
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
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use query parameter to trigger game reset without full page reload
    navigate({ to: '/', search: { reset: Date.now().toString() } });
  };

  return (
    <AppHeaderPresentation
      homeButton={
        <Button variant="ghost" asChild aria-label="ホームに戻る">
          <Link to="/" onClick={handleHomeClick} title="ホームに戻る">
            🎴 TOP
          </Link>
        </Button>
      }
      playerButton={
        <Button variant="ghost" asChild aria-label="プレイヤー管理">
          <Link to="/player" title="プレイヤー管理">
            👥 プレイヤー
          </Link>
        </Button>
      }
      rulesButton={
        <Button variant="ghost" asChild aria-label="掟を確認">
          <Link to="/intro" title="掟を確認">
            📜 掟
          </Link>
        </Button>
      }
      repoStateIndicator={
        <RepoStateIndicator state={repoState} onClick={onRepoIndicatorClick} />
      }
      themeToggle={<ThemeIndicator />}
    />
  );
}
