import { TokenManagerContainer } from '@/components/token/token-manager-container';
import { PromidasRepoDashboard } from '@/components/promidas/promid-repo-dashboard-container';
import type { ScreenSize } from '@/types/screen-size';

interface RepoSetupProps {
  screenSize: ScreenSize;
}

export function RepoSetup({ screenSize }: RepoSetupProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TokenManagerContainer screenSize={screenSize} />
      <PromidasRepoDashboard screenSize={screenSize} />
    </div>
  );
}
