/**
 * Intro route (`/intro`).
 *
 * This route renders the intro page that enforces its own standalone theme.
 * It must not be wrapped by the shared shadcn/ui theme provider.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { IntroPage } from '@/components/intro/IntroPage';

export const Route = createFileRoute('/intro')({
  component: Intro,
});

function Intro() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/' });
  };

  return <IntroPage onBack={handleBack} />;
}
