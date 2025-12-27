const PROTOPEDIA_API_V2_TOKEN_KEY = 'protopedia_api_v2_token';

class TokenStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async get(): Promise<string | null> {
    return sessionStorage.getItem(this.key);
  }

  async has(): Promise<boolean> {
    return sessionStorage.getItem(this.key) !== null;
  }

  async save(token: string): Promise<void> {
    sessionStorage.setItem(this.key, token);
  }

  async remove(): Promise<void> {
    sessionStorage.removeItem(this.key);
  }
}

export const tokenStorage = new TokenStorage(PROTOPEDIA_API_V2_TOKEN_KEY);
