import { TokenManager, TOKEN_KEYS } from 'promidas-utils/token';

export const tokenStorage = TokenManager.forSessionStorage(
  TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);
