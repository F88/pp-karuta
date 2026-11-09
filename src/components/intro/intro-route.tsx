/**
 * Component rendered by the intro route (`/intro`).
 *
 * It lives outside `src/routes` so the route file only exports `Route`, which
 * keeps Fast Refresh working for this component.
 */
import { useNavigate } from '@tanstack/react-router';

import { IntroPage } from '@/components/intro/intro-page';

export function IntroRoute() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/' });
  };

  return <IntroPage onBack={handleBack} />;
}
