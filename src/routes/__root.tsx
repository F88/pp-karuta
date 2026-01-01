/**
 * Root route definition for TanStack Router.
 *
 * This file intentionally keeps global wrappers minimal. In particular, the shared
 * shadcn/ui theme provider is NOT applied here so that `/intro` can enforce its
 * own standalone theme.
 */
import { AppHeader } from '@/components/layout/app-header';
import { RepoSetup } from '@/components/layout/repo-setup';
import { RepoSetupDialog } from '@/components/layout/repo-setup-dialog';
import { ThemeProvider } from '@/components/theme-provider';
import { ScreenSizeProvider } from '@/contexts/screen-size-provider';
import { PlayerManager } from '@/lib/karuta';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import { getRepositoryState } from '@/lib/repository/promidas-repository-manager';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [repoState, setRepoState] = useState<RepositoryState>(() =>
    getRepositoryState(),
  );
  const [openRepoSetupDialog, setOpenRepoSetupDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRepoState(getRepositoryState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize players on app startup
  useEffect(() => {
    PlayerManager.initialize().catch((error) => {
      console.error('Failed to initialize players:', error);
    });
  }, []);

  // const handleDialogOpenChange = (open: boolean) => {
  //   setRepoSetupDialog(open);
  // };

  // const handleRepoIndicatorClick = () => {
  //   setRepoSetupDialog(true);
  // };

  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
      <AppHeader
        repoState={repoState}
        onRepoIndicatorClick={() => setOpenRepoSetupDialog(true)}
      />

      {import.meta.env.VITE_DEBUG_MODE === 'true' && (
        <div className="flex items-center justify-center p-4">
          <RepoSetup />
        </div>
      )}

      <RepoSetupDialog
        open={openRepoSetupDialog}
        onOpenChange={() => setOpenRepoSetupDialog(false)}
        autoCloseOnValid={false}
      />
      <ScreenSizeProvider>
        <Outlet />
      </ScreenSizeProvider>
    </ThemeProvider>
  );
}
