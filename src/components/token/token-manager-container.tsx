import { useState, useEffect } from 'react';
import { useToken } from '@/hooks/use-token';
import {
  getRepositoryState,
  resetRepository,
  type RepositoryState,
} from '@/lib/repository/promidas-repository-manager';
import { getPromidasRepositoryManager } from '@/lib/repository/promidas-repository-manager';
import type { ScreenSize } from '@/types/screen-size';
import { TokenManagerPresentation } from './token-manager-presentation';

interface TokenManagerContainerProps {
  screenSize: ScreenSize;
}

export function TokenManagerContainer({
  screenSize,
}: TokenManagerContainerProps) {
  const { token, hasToken, saveToken, removeToken } = useToken();
  const [inputValue, setInputValue] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [repoState, setRepoState] = useState<RepositoryState>({
    type: 'not-created',
  });

  // Sync inputValue with token
  useEffect(() => {
    setInputValue(token || '');
  }, [token]);

  // Update repo state when token changes
  useEffect(() => {
    if (!hasToken) {
      setRepoState({ type: 'not-created' });
      return;
    }

    // Check current repo state
    const status = getRepositoryState();
    setRepoState(status);
  }, [hasToken]);

  const handleSave = async () => {
    if (!inputValue.trim()) return;

    // Reset repository before validation
    resetRepository();

    await saveToken(inputValue.trim());

    // Validate token by creating repository
    setIsValidating(true);
    try {
      const manager = getPromidasRepositoryManager();
      await manager.getRepository();
      const status = getRepositoryState();
      console.log('[TokenManager] Repository state after validation:', status);
      setRepoState(status);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[TokenManager] Validation failed:', message);
      setRepoState({ type: 'token-invalid', error: message });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = async () => {
    await removeToken();
    resetRepository();
    setInputValue('');
    setRepoState({ type: 'not-created' });
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleToggleShowToken = () => {
    setShowToken(!showToken);
  };

  return (
    <TokenManagerPresentation
      inputValue={inputValue}
      showToken={showToken}
      hasToken={hasToken}
      isValidating={isValidating}
      repoState={repoState}
      onInputChange={handleInputChange}
      onToggleShowToken={handleToggleShowToken}
      onSave={handleSave}
      onRemove={handleRemove}
      screenSize={screenSize}
    />
  );
}
