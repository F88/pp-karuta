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
import { UIDebugOverlay } from '@/components/ui-debug-overlay';
import { ScreenSizeProvider } from '@/contexts/screen-size-provider';
import { useScreenSizeContext } from '@/hooks/use-screen-size-context';
import { PlayerManager } from '@/lib/karuta';
import { logger } from '@/lib/logger';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import { promidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
      <ScreenSizeProvider>
        <RootLayout />
      </ScreenSizeProvider>
    </ThemeProvider>
  );
}

function RootLayout() {
  const screenSize = useScreenSizeContext();
  const [repoState, setRepoState] = useState<RepositoryState>(() =>
    promidasRepositoryManager.getState(),
  );
  const [openRepoSetupDialog, setOpenRepoSetupDialog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRepoState(promidasRepositoryManager.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize players on app startup
  useEffect(() => {
    PlayerManager.initialize().catch((error) => {
      logger.error('Failed to initialize players:', error);
    });
  }, []);

  const headerPadding = screenSize
    ? {
        smartphone: 'pt-12',
        tablet: 'pt-14',
        pc: 'pt-16',
      }[screenSize]
    : 'pt-12 md:pt-14 lg:pt-16';

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50">
        <AppHeader
          repoState={repoState}
          onRepoIndicatorClick={() => setOpenRepoSetupDialog(true)}
          screenSize={screenSize}
        />
      </div>

      {/* Add padding-top to account for fixed header */}
      <div className={headerPadding}>
        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="flex items-center justify-center p-4">
            <RepoSetup screenSize={screenSize} />
          </div>
        )}

        <RepoSetupDialog
          open={openRepoSetupDialog}
          onOpenChange={() => setOpenRepoSetupDialog(false)}
          autoCloseOnValid={false}
          screenSize={screenSize}
        />
        <Outlet />
      </div>

      {import.meta.env.VITE_UI_DEBUG === 'true' && (
        <UIDebugOverlay screenSize={screenSize} />
      )}
    </>
  );
}
