import { Link, useNavigate } from '@tanstack/react-router';
import { ThemeIndicator } from '@/components/theme-indicator';
import { Button } from '@/components/ui/button';
import { RepoStateIndicator } from './repo-state-indicator';
import { AppHeaderPresentation } from './app-header-presentation';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import type { ScreenSize } from '@/types/screen-size';

interface AppHeaderProps {
  repoState: RepositoryState;
  onRepoIndicatorClick: () => void;
  screenSize: ScreenSize;
}

export function AppHeader({
  repoState,
  onRepoIndicatorClick,
  screenSize,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use query parameter to trigger game reset without full page reload
    navigate({ to: '/', search: { reset: Date.now().toString() } });
  };

  return (
    <AppHeaderPresentation
      screenSize={screenSize}
      homeButton={
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="ホームに戻る"
          className="text-xs md:text-sm lg:text-base"
        >
          <Link to="/" onClick={handleHomeClick} title="ホームに戻る">
            <span className="text-base md:text-lg lg:text-xl">🎴</span> TOP
          </Link>
        </Button>
      }
      playerButton={
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="プレイヤー管理"
          className="text-xs md:text-sm lg:text-base"
        >
          <Link to="/player" title="プレイヤー管理">
            <span className="text-base md:text-lg lg:text-xl">👥</span>{' '}
            プレイヤー
          </Link>
        </Button>
      }
      rulesButton={
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="掟を確認"
          className="text-xs md:text-sm lg:text-base"
        >
          <Link to="/intro" title="掟を確認">
            <span className="text-base md:text-lg lg:text-xl">📜</span> 掟
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
