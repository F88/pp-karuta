/**
 * Intro route (`/intro`).
 *
 * This route renders the intro page that enforces its own standalone theme.
 * It must not be wrapped by the shared shadcn/ui theme provider.
 */
import { createFileRoute } from '@tanstack/react-router';

import { IntroRoute } from '@/components/intro/intro-route';

export const Route = createFileRoute('/intro')({
  component: IntroRoute,
});
