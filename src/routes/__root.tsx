/**
 * Root route definition for TanStack Router.
 *
 * This file intentionally keeps global wrappers minimal. In particular, the shared
 * shadcn/ui theme provider is NOT applied here so that `/intro` can enforce its
 * own standalone theme.
 */
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/layout/app-header';
import { RepoSetupDialog } from '@/components/layout/repo-setup-dialog';
import { getRepositoryState } from '@/lib/repository/promidas-repo';
import type { RepositoryState } from '@/lib/repository/promidas-repo';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [repoState, setRepoState] = useState<RepositoryState>(() =>
    getRepositoryState(),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRepoState(getRepositoryState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleRepoIndicatorClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
      <AppHeader
        repoState={repoState}
        onRepoIndicatorClick={handleRepoIndicatorClick}
      />
      <RepoSetupDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        autoCloseOnValid={false}
      />
      <Outlet />
    </ThemeProvider>
  );
}
