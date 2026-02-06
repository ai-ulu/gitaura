import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadApiConfig, saveGeminiApiKey, isApiConfigReady } from '../services/configService';

describe('configService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should load API config from localStorage', () => {
    localStorage.setItem('gitaura_gemini_api_key', 'test-key');
    const config = loadApiConfig();
    expect(config.geminiApiKey).toBe('test-key');
  });

  it('should return null if no key is in localStorage', () => {
    const config = loadApiConfig();
    expect(config.geminiApiKey).toBeNull();
  });

  it('should save Gemini API key to localStorage', () => {
    saveGeminiApiKey('new-key');
    expect(localStorage.getItem('gitaura_gemini_api_key')).toBe('new-key');
  });

  it('should always be ready now that we use a backend proxy', () => {
    const readyStatus = isApiConfigReady();
    expect(readyStatus.ready).toBe(true);
    expect(readyStatus.missing).toHaveLength(0);
  });
});
