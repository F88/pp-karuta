/**
 * Root route definition for TanStack Router.
 *
 * This file intentionally keeps global wrappers minimal. In particular, the shared
 * shadcn/ui theme provider is NOT applied here so that `/intro` can enforce its
 * own standalone theme.
 */
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/layout/app-header';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
      <AppHeader />
      <Outlet />
    </ThemeProvider>
  );
}
