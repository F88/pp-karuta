import { Link } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { RepoStateIndicator } from './repo-state-indicator';
import { AppHeaderPresentation } from './app-header-presentation';

export function AppHeader() {
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
      repoStateIndicator={<RepoStateIndicator />}
      themeToggle={<ThemeToggle />}
    />
  );
}
