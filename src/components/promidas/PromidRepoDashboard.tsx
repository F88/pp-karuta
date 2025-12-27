import { useEffect, useState } from 'react';
import {
  getRepositoryState,
  type RepositoryState,
} from '@/lib/repository/promidas-repo';
import { usePromidasStoreState } from '@/hooks/usePromidasStoreState';
import type { StoreState } from '@f88/promidas-utils/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PromidasRepoDashboard() {
  const [repoState, setRepoState] =
    useState<RepositoryState>('not-initialized');
  const [repoError, setRepoError] = useState<string | null>(null);
  const { storeState, stats } = usePromidasStoreState();

  const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

  useEffect(() => {
    const updateRepoState = () => {
      const status = getRepositoryState();
      setRepoState(status.state);
      setRepoError(status.error);
    };

    updateRepoState();

    // Poll every 5 seconds to sync with repo state changes
    const interval = setInterval(updateRepoState, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRepoStateLabel = (state: RepositoryState): string => {
    switch (state) {
      case 'not-initialized':
        return '未初期化';
      case 'invalid':
        return '無効';
      case 'valid':
        return '有効';
    }
  };

  const getRepoStateBadgeColor = (state: RepositoryState): string => {
    switch (state) {
      case 'not-initialized':
        return 'bg-muted text-muted-foreground';
      case 'invalid':
        return 'bg-destructive text-destructive-foreground';
      case 'valid':
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
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getRepoStateBadgeColor(repoState)}`}
            >
              {getRepoStateLabel(repoState)}
            </span>
          </div>
          {repoError && <p className="text-destructive text-xs">{repoError}</p>}
        </div>

        {/* Store State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Store</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStoreStateBadgeColor(storeState)}`}
            >
              {getStoreStateLabel(storeState)}
            </span>
          </div>

          {/* Store Stats Details */}
          {stats && storeState !== 'not-stored' && (
            <div className="text-muted-foreground space-y-1 text-xs">
              <div className="flex justify-between">
                <span>プロトタイプ数:</span>
                <span className="font-mono">{stats.size}件</span>
              </div>
              {stats.cachedAt && (
                <div className="flex justify-between">
                  <span>キャッシュ日時:</span>
                  <span className="font-mono">
                    {new Date(stats.cachedAt).toLocaleTimeString('ja-JP')}
                  </span>
                </div>
              )}
              {storeState === 'stored' && (
                <div className="flex justify-between">
                  <span>残り時間:</span>
                  <span className="font-mono">
                    {formatTime(stats.remainingTtlMs)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>データサイズ:</span>
                <span className="font-mono">
                  {(stats.dataSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
