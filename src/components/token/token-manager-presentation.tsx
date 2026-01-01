import {
  Eye,
  EyeOff,
  Circle,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RepositoryState } from '@/lib/repository/promidas-repository-manager';
import type { ScreenSize } from '@/types/screen-size';

export interface TokenManagerPresentationProps {
  inputValue: string;
  showToken: boolean;
  hasToken: boolean;
  isValidating: boolean;
  repoState: RepositoryState;
  onInputChange: (value: string) => void;
  onToggleShowToken: () => void;
  onSave: () => void;
  onRemove: () => void;
  screenSize: ScreenSize;
}

export function TokenManagerPresentation({
  inputValue,
  showToken,
  hasToken,
  isValidating,
  repoState,
  onInputChange,
  onToggleShowToken,
  onSave,
  onRemove,
  screenSize: _screenSize, // Reserved for future responsive behavior
}: TokenManagerPresentationProps) {
  const getValidationMessage = () => {
    if (isValidating) {
      return <p className="text-muted-foreground text-xs">Tokenを確認中...</p>;
    }

    if (repoState.type === 'created-token-valid') {
      return <p className="text-muted-foreground text-xs">Tokenは有効です</p>;
    }

    if (repoState.type === 'token-invalid') {
      return (
        <p className="text-destructive text-xs">
          Tokenが無効です。もしくはAPIに接続できません。
        </p>
      );
    }

    return null;
  };

  const getStatusIcon = () => {
    if (!hasToken) {
      return <Circle className="text-muted-foreground" size={20} />;
    }

    if (isValidating) {
      return <Loader2 className="animate-spin" size={20} />;
    }

    if (repoState.type === 'created-token-valid') {
      return <CheckCircle2 className="text-green-600" size={20} />;
    }

    if (repoState.type === 'token-invalid') {
      return <XCircle className="text-destructive" size={20} />;
    }

    return null;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>API Token</CardTitle>
            <CardDescription>ProtoPedia APIトークンを設定</CardDescription>
          </div>
          {getStatusIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              type={showToken ? 'text' : 'password'}
              id="protopedia-api-token"
              name="protopedia-api-token"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="トークンを入力"
              autoComplete="on"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleShowToken}
              aria-label={showToken ? 'Hide token' : 'Show token'}
            >
              {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={!inputValue.trim() || isValidating}
            >
              一時的に保存
            </Button>
            {hasToken && (
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={onRemove}
              >
                削除
              </Button>
            )}
          </div>
          {getValidationMessage()}
        </form>
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
