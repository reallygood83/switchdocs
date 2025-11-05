import { AIProvider, ProviderMetadata } from '../types/ai';

const PROVIDER_STORAGE_KEY = 'ai_provider';
const API_KEY_STORAGE_PREFIX = 'ai_api_key_';
const MODEL_STORAGE_PREFIX = 'ai_model_';

export const PROVIDERS: ProviderMetadata[] = [
  {
    id: 'gemini',
    label: 'Google Gemini',
    description: 'Google Gemini 2.5 Flash 모델을 사용하여 교육 콘텐츠를 최적화합니다.',
    defaultModel: 'gemini-2.5-flash-latest',
    placeholderKey: 'AIza...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  }
];

export function getProviderMetadata(provider: AIProvider): ProviderMetadata {
  const metadata = PROVIDERS.find((item) => item.id === provider);
  if (!metadata) {
    return PROVIDERS[0];
  }
  return metadata;
}

export function getStoredProvider(): AIProvider {
  if (typeof window === 'undefined') {
    return PROVIDERS[0].id;
  }

  try {
    const provider = localStorage.getItem(PROVIDER_STORAGE_KEY) as AIProvider | null;
    return provider || PROVIDERS[0].id;
  } catch {
    return PROVIDERS[0].id;
  }
}

export function setStoredProvider(provider: AIProvider): void {
  try {
    localStorage.setItem(PROVIDER_STORAGE_KEY, provider);
  } catch (error) {
    console.error('Failed to store provider:', error);
  }
}

export function getStoredProviderApiKey(provider: AIProvider): string {
  try {
    return localStorage.getItem(`${API_KEY_STORAGE_PREFIX}${provider}`) || '';
  } catch {
    return '';
  }
}

export function setStoredProviderApiKey(provider: AIProvider, apiKey: string): void {
  try {
    localStorage.setItem(`${API_KEY_STORAGE_PREFIX}${provider}`, apiKey);
  } catch (error) {
    console.error('Failed to store provider API key:', error);
  }
}

export function clearStoredProviderApiKey(provider: AIProvider): void {
  try {
    localStorage.removeItem(`${API_KEY_STORAGE_PREFIX}${provider}`);
  } catch (error) {
    console.error('Failed to clear provider API key:', error);
  }
}

export function getStoredProviderModel(provider: AIProvider): string {
  try {
    return (
      localStorage.getItem(`${MODEL_STORAGE_PREFIX}${provider}`) ||
      getProviderMetadata(provider).defaultModel
    );
  } catch {
    return getProviderMetadata(provider).defaultModel;
  }
}

export function setStoredProviderModel(provider: AIProvider, model: string): void {
  try {
    const trimmed = model.trim();
    const value = trimmed || getProviderMetadata(provider).defaultModel;
    localStorage.setItem(`${MODEL_STORAGE_PREFIX}${provider}`, value);
  } catch (error) {
    console.error('Failed to store provider model:', error);
  }
}

export function clearStoredProviderModel(provider: AIProvider): void {
  try {
    localStorage.removeItem(`${MODEL_STORAGE_PREFIX}${provider}`);
  } catch (error) {
    console.error('Failed to clear provider model:', error);
  }
}
