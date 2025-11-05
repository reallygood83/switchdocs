// Gemini API Configuration Types
export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

// Gemini API Message Types
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text: string;
  }[];
}

// Gemini API Request Types
export interface GeminiGenerateRequest {
  contents: GeminiMessage[];
  systemInstruction?: {
    parts: {
      text: string;
    }[];
  };
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

// Gemini API Response Types
export interface GeminiGenerateResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  }[];
  promptFeedback?: {
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  };
}

// Gemini Streaming Response Types
export interface GeminiStreamChunk {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason?: string;
  }[];
}

// Gemini Models List Response
export interface GeminiModelsResponse {
  models: {
    name: string;
    version: string;
    displayName: string;
    description: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    supportedGenerationMethods: string[];
  }[];
}

// Storage Keys
export const GEMINI_STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  MODEL: 'gemini_model',
} as const;

// Default Configuration
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
