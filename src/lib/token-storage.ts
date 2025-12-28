import { TokenManager, TOKEN_KEYS } from '@f88/promidas-utils/token';

export const tokenStorage = TokenManager.forSessionStorage(
  TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);
