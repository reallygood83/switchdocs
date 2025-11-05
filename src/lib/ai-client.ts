import type { AIProvider } from '../types/ai';
import { GeminiClient } from './gemini-client';

export interface AIRequestParams {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export interface AIClient {
  generateText(prompt: string, systemPrompt: string, temperature?: number): Promise<string>;
  streamText(
    prompt: string,
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    temperature?: number
  ): Promise<void>;
  supportsStreaming: boolean;
}

/**
 * Create Gemini AI client wrapper
 */
function createGeminiWrapper(params: AIRequestParams): AIClient {
  const client = new GeminiClient({ apiKey: params.apiKey, model: params.model });

  return {
    supportsStreaming: true,
    generateText: (prompt, systemPrompt, temperature) =>
      client.generateText(prompt, systemPrompt, temperature),
    streamText: (prompt, systemPrompt, onChunk, temperature) =>
      client.streamText(prompt, systemPrompt, onChunk, temperature),
  };
}

export function createAIClient(params: AIRequestParams): AIClient {
  // TeacherDoc AI only supports Gemini
  return createGeminiWrapper(params);
}
