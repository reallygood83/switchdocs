import {
  GeminiConfig,
  GeminiGenerateRequest,
  GeminiGenerateResponse,
  GeminiStreamChunk,
  GeminiModelsResponse,
  DEFAULT_GEMINI_MODEL,
  GEMINI_API_BASE,
  GEMINI_STORAGE_KEYS,
} from '../types/gemini';

/**
 * Build detailed error from Gemini API response
 */
async function buildApiError(response: Response): Promise<never> {
  let detail = '';

  try {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const errorData = await response.json();
      detail = errorData?.error?.message || errorData?.message || '';
    } else {
      detail = await response.text();
    }
  } catch {
    detail = '';
  }

  const baseMessage = `Gemini API Error: ${response.status} ${response.statusText}`;
  const message = detail ? `${baseMessage} - ${detail}`.trim() : baseMessage;

  throw new Error(message);
}

/**
 * Gemini API Client for TeacherDoc AI
 * Provides text generation, streaming, and model management
 */
export class GeminiClient {
  private apiKey: string;
  private model: string;

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model && config.model.trim()
      ? config.model.trim()
      : DEFAULT_GEMINI_MODEL;
  }

  /**
   * Generate text using Gemini API (non-streaming)
   */
  async generateText(
    prompt: string,
    systemPrompt: string,
    temperature = 0.3
  ): Promise<string> {
    try {
      const requestBody: GeminiGenerateRequest = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      };

      const response = await fetch(
        `${GEMINI_API_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        await buildApiError(response);
      }

      const data: GeminiGenerateResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const textParts = data.candidates[0].content.parts;
      return textParts.map((part) => part.text).join('');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error during Gemini API call');
    }
  }

  /**
   * Generate text using Gemini API (streaming)
   */
  async streamText(
    prompt: string,
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    temperature = 0.3
  ): Promise<void> {
    try {
      const requestBody: GeminiGenerateRequest = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      };

      const response = await fetch(
        `${GEMINI_API_BASE}/models/${this.model}:streamGenerateContent?key=${this.apiKey}&alt=sse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        await buildApiError(response);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response stream');
      }

      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') continue;

            try {
              const parsed: GeminiStreamChunk = JSON.parse(data);
              if (parsed.candidates && parsed.candidates.length > 0) {
                const content = parsed.candidates[0].content;
                const textParts = content.parts.map((part) => part.text).join('');
                if (textParts) {
                  onChunk(textParts);
                }
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error during Gemini streaming');
    }
  }

  /**
   * Validate API key by attempting to list models
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * List available Gemini models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/models?key=${this.apiKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        await buildApiError(response);
      }

      const data: GeminiModelsResponse = await response.json();

      if (Array.isArray(data?.models)) {
        return data.models
          .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
          .map((model) => model.name.replace('models/', ''))
          .filter((name): name is string => typeof name === 'string' && name.length > 0);
      }

      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to retrieve models from Gemini API');
    }
  }
}

// Local Storage Management Functions

/**
 * Get stored Gemini API key from localStorage
 */
export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(GEMINI_STORAGE_KEYS.API_KEY);
  } catch {
    return null;
  }
}

/**
 * Store Gemini API key in localStorage
 */
export function setStoredApiKey(apiKey: string): void {
  try {
    localStorage.setItem(GEMINI_STORAGE_KEYS.API_KEY, apiKey);
  } catch (error) {
    console.error('Failed to store API key:', error);
  }
}

/**
 * Clear Gemini API key from localStorage
 */
export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(GEMINI_STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Failed to clear API key:', error);
  }
}

/**
 * Get stored Gemini model from localStorage
 */
export function getStoredModel(): string {
  try {
    return localStorage.getItem(GEMINI_STORAGE_KEYS.MODEL) || DEFAULT_GEMINI_MODEL;
  } catch {
    return DEFAULT_GEMINI_MODEL;
  }
}

/**
 * Store Gemini model in localStorage
 */
export function setStoredModel(model: string): void {
  try {
    const value = model.trim();
    if (value) {
      localStorage.setItem(GEMINI_STORAGE_KEYS.MODEL, value);
    } else {
      localStorage.setItem(GEMINI_STORAGE_KEYS.MODEL, DEFAULT_GEMINI_MODEL);
    }
  } catch (error) {
    console.error('Failed to store Gemini model:', error);
  }
}

/**
 * Clear Gemini model from localStorage
 */
export function clearStoredModel(): void {
  try {
    localStorage.removeItem(GEMINI_STORAGE_KEYS.MODEL);
  } catch (error) {
    console.error('Failed to clear Gemini model:', error);
  }
}
