import type { RepositoryState } from '@/lib/repository/promidas-repo';
import type { StoreState } from '@f88/promidas-utils/store';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PromidasRepoDashboardPresentationProps {
  repoState: RepositoryState;
  repoError: string | null;
  storeState: StoreState;
  storeStats: PrototypeInMemoryStats | null;
  useDummyData: boolean;
}

export function PromidasRepoDashboardPresentation({
  repoState,
  repoError,
  storeState,
  storeStats,
  useDummyData,
}: PromidasRepoDashboardPresentationProps) {
  const getRepoStateLabel = (state: RepositoryState): string => {
    switch (state.type) {
      case 'not-created':
        return '未初期化';
      case 'validating':
        return '検証中';
      case 'token-invalid':
        return '無効';
      case 'created-token-valid':
        return '有効';
    }
  };

  const getRepoStateBadgeColor = (state: RepositoryState): string => {
    switch (state.type) {
      case 'not-created':
        return 'bg-muted text-muted-foreground';
      case 'validating':
        return 'bg-blue-600 text-white dark:bg-blue-700';
      case 'token-invalid':
        return 'bg-destructive text-destructive-foreground';
      case 'created-token-valid':
        return 'bg-green-600 text-white dark:bg-green-700';
    }
  };

  const getStoreStateLabel = (state: StoreState): string => {
    switch (state) {
      case 'not-stored':
        return '未保存';
      case 'stored':
        return '保存済み';
      case 'expired':
        return '期限切れ';
    }
  };

  const getStoreStateBadgeColor = (state: StoreState): string => {
    switch (state) {
      case 'not-stored':
        return 'bg-muted text-muted-foreground';
      case 'stored':
        return 'bg-blue-600 text-white dark:bg-blue-700';
      case 'expired':
        return 'bg-yellow-600 text-white dark:bg-yellow-700';
    }
  };

  const formatTime = (ms: number): string => {
    if (ms <= 0) return '0秒';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}時間${minutes % 60}分`;
    }
    if (minutes > 0) {
      return `${minutes}分${seconds % 60}秒`;
    }
    return `${seconds}秒`;
  };

  if (useDummyData) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base">PROMIDAS Repository</CardTitle>
          <CardDescription>ダミーデータモード</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            環境変数 VITE_USE_DUMMY_DATA=true のため、
            実際のRepositoryは使用されていません。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-base">PROMIDAS Repository</CardTitle>
        <CardDescription>Repository & Store 状態</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Repository State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Repository</span>
            <Badge
              variant="outline"
              className={getRepoStateBadgeColor(repoState)}
            >
              {getRepoStateLabel(repoState)}
            </Badge>
          </div>
          {repoError && <p className="text-destructive text-xs">{repoError}</p>}
        </div>

        {/* Store State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Store</span>
            <Badge
              variant="outline"
              className={getStoreStateBadgeColor(storeState)}
            >
              {getStoreStateLabel(storeState)}
            </Badge>
          </div>

          {/* Store Stats Details */}
          {storeStats && storeState !== 'not-stored' && (
            <div className="text-muted-foreground space-y-1 text-xs">
              <div className="flex justify-between">
                <span>プロトタイプ数:</span>
                <span className="font-mono">{storeStats.size}件</span>
              </div>
              {storeStats.cachedAt && (
                <div className="flex justify-between">
                  <span>キャッシュ日時:</span>
                  <span className="font-mono">
                    {new Date(storeStats.cachedAt).toLocaleTimeString('ja-JP')}
                  </span>
                </div>
              )}
              {storeState === 'stored' && (
                <div className="flex justify-between">
                  <span>残り時間:</span>
                  <span className="font-mono">
                    {formatTime(storeStats.remainingTtlMs)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>データサイズ:</span>
                <span className="font-mono">
                  {(storeStats.dataSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
