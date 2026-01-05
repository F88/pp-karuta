import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { tokenStorage } from '@/lib/token-storage';

export function useToken() {
  const [token, setTokenValue] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from storage
  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = await tokenStorage.get();
        setTokenValue(storedToken);
        setHasToken(await tokenStorage.has());
      } catch (err) {
        logger.error('[useToken] Failed to load token from storage', err);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, []);

  const saveToken = useCallback(async (newToken: string) => {
    await tokenStorage.save(newToken);
    setTokenValue(newToken);
    setHasToken(true);
  }, []);

  const removeToken = useCallback(async () => {
    await tokenStorage.remove();
    setTokenValue(null);
    setHasToken(false);
  }, []);

  return {
    token,
    hasToken,
    isLoading,
    saveToken,
    removeToken,
  };
}
