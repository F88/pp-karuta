import { Link, useNavigate } from '@tanstack/react-router';
import { ThemeIndicator } from '@/components/theme-indicator';
import { Button } from '@/components/ui/button';
import { RepoStateIndicator } from './repo-state-indicator';
import { AppHeaderPresentation } from './app-header-presentation';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

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

  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      buttonText: 'text-xs',
      iconText: 'text-base',
    },
    tablet: {
      buttonText: 'text-sm',
      iconText: 'text-lg',
    },
    pc: {
      buttonText: 'text-base',
      iconText: 'text-xl',
    },
    responsive: {
      buttonText: 'text-xs md:text-sm lg:text-base',
      iconText: 'text-base md:text-lg lg:text-xl',
    },
  });

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
          className={sizeStyles.buttonText}
        >
          <Link to="/" onClick={handleHomeClick} title="ホームに戻る">
            <span className={sizeStyles.iconText}>🎴</span> MENU
          </Link>
        </Button>
      }
      playerButton={
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="プレイヤー管理"
          className={sizeStyles.buttonText}
        >
          <Link to="/player" title="プレイヤー管理">
            <span className={sizeStyles.iconText}>🧙</span> PLAYER
          </Link>
        </Button>
      }
      rulesButton={
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="掟を確認"
          className={sizeStyles.buttonText}
        >
          <Link to="/intro" title="掟を確認">
            <span className={sizeStyles.iconText}>📜</span> 掟
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
