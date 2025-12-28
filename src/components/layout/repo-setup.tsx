import { TokenManagerContainer } from '@/components/token/token-manager-container';
import { PromidasRepoDashboard } from '@/components/promidas/promid-repo-dashboard-container';

export function RepoSetup() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TokenManagerContainer />
      <PromidasRepoDashboard />
    </div>
  );
}
