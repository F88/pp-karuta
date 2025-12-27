import { useState, useEffect } from 'react';
import { useToken } from '@/hooks/useToken';
import { usePromidasStoreState } from '@/hooks/usePromidasStoreState';
import {
  getRepositoryState,
  resetRepository,
  type RepositoryState,
} from '@/lib/repository/promidas-repo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TokenManager() {
  const { token, hasToken, saveToken, removeToken } = useToken();
  const { storeState, stats } = usePromidasStoreState();
  const [inputValue, setInputValue] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [repoState, setRepoState] = useState<RepositoryState>({
    type: 'not-created',
  });
  const [repoError, setRepoError] = useState<string | null>(null);

  const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

  // Update repo state when token changes
  useEffect(() => {
    if (!hasToken) {
      setRepoState({ type: 'not-created' });
      setRepoError(null);
      return;
    }

    // Skip validation in dummy mode
    if (useDummyData) {
      setRepoState({ type: 'not-created' });
      setRepoError(null);
      return;
    }

    // Check current repo state
    const status = getRepositoryState();
    setRepoState(status);
    setRepoError(status.type === 'token-invalid' ? status.error : null);
  }, [hasToken, useDummyData]);

  const handleSave = async () => {
    if (!inputValue.trim()) return;

    await saveToken(inputValue.trim());
    setInputValue('');

    // Skip validation in dummy mode
    if (useDummyData) {
      return;
    }

    // Validate token by creating repository
    setIsValidating(true);
    try {
      const { getPromidasRepositoryManager } =
        await import('@/lib/repository/promidas-repository-manager');
      const manager = getPromidasRepositoryManager();
      await manager.getRepository();
      const status = getRepositoryState();
      setRepoState(status);
      setRepoError(status.type === 'token-invalid' ? status.error : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setRepoState({ type: 'token-invalid', error: message });
      setRepoError(message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = async () => {
    await removeToken();
    resetRepository();
    setInputValue('');
    setRepoState({ type: 'not-created' });
    setRepoError(null);
  };

  const getValidationMessage = () => {
    if (useDummyData) {
      return null;
    }

    if (isValidating) {
      return <p className="text-muted-foreground text-xs">Tokenを確認中...</p>;
    }

    if (repoState.type === 'created-token-valid') {
      const storeInfo =
        storeState === 'stored' && stats
          ? ` (${stats.size}件のプロトタイプ)`
          : storeState === 'expired'
            ? ' (期限切れ)'
            : '';
      return (
        <p className="text-muted-foreground text-xs">
          Tokenは有効です{storeInfo}
        </p>
      );
    }

    if (repoState.type === 'token-invalid') {
      return (
        <p className="text-destructive text-xs">
          Tokenが無効か、APIに接続できません
          {repoError ? `: ${repoError}` : ''}
        </p>
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>API Token</CardTitle>
        <CardDescription>ProtoPedia APIトークンを設定</CardDescription>
      </CardHeader>
      <CardContent>
        {hasToken ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={token || ''}
                readOnly
                aria-label="Saved API token"
                title="Saved API token"
                className="border-input bg-muted flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowToken(!showToken)}
                aria-label={showToken ? 'Hide token' : 'Show token'}
              >
                👁️
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRemove}
            >
              削除
            </Button>

            {getValidationMessage()}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="トークンを入力"
              className="border-input bg-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={!inputValue.trim()}
            >
              一時的に保存
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          トークンは{' '}
          <a
            href="https://protopedia.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-semibold underline underline-offset-4"
          >
            ProtoPedia
          </a>{' '}
          で確認してください
        </p>
      </CardFooter>
    </Card>
  );
}
