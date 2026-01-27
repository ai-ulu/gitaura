/**
 * Configuration Service
 * Güvenli API anahtarı yönetimi ve yapılandırma
 */

export interface ApiConfig {
  geminiApiKey: string | null;
  githubToken: string | null;
}

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gitaura_gemini_api_key',
  GITHUB_TOKEN: 'gitaura_github_token',
} as const;

/**
 * API yapılandırmasını yükle
 * Öncelik sırası: localStorage > environment variables
 */
export const loadApiConfig = (): ApiConfig => {
  return {
    geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || null,
    githubToken: localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || null,
  };
};

/**
 * Gemini API anahtarını kaydet
 */
export const saveGeminiApiKey = (apiKey: string): void => {
  if (apiKey && apiKey.trim()) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey.trim());
  }
};

/**
 * GitHub token'ı kaydet
 */
export const saveGithubToken = (token: string): void => {
  if (token && token.trim()) {
    localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, token.trim());
  }
};

/**
 * Gemini API anahtarını sil
 */
export const clearGeminiApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
};

/**
 * GitHub token'ı sil
 */
export const clearGithubToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
};

/**
 * Tüm API yapılandırmasını sil
 */
export const clearAllApiConfig = (): void => {
  clearGeminiApiKey();
  clearGithubToken();
};

/**
 * API anahtarının geçerli olup olmadığını kontrol et
 */
export const validateApiKey = (key: string | null): boolean => {
  return key !== null && key.trim().length > 0;
};

/**
 * API yapılandırmasının hazır olup olmadığını kontrol et
 */
/**
 * API yapılandırmasının hazır olup olmadığını kontrol et
 * Not: Backend proxy'de varsayılan anahtar olduğu için artık her zaman hazır kabul ediyoruz.
 * Kullanıcı kendi anahtarını eklerse o kullanılır.
 */
export const isApiConfigReady = (): { ready: boolean; missing: string[] } => {
  return {
    ready: true,
    missing: [],
  };
};
