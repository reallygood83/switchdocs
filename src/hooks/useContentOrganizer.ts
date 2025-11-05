import { useState, useCallback } from 'react';
import { OrganizationOptions, OrganizationResult, OrganizationState } from '../types/organization';
import { organizeContent } from '../lib/content-organizer';
import {
  getStoredProvider,
  getStoredProviderApiKey,
  getStoredProviderModel,
  getProviderMetadata,
} from '../lib/ai-config';
import { AIProvider } from '../types/ai';

export function useContentOrganizer() {
  const [state, setState] = useState<OrganizationState>({
    isProcessing: false,
    error: null,
    result: null,
  });

  const [streamedContent, setStreamedContent] = useState<string>('');

  const organize = useCallback(async (
    markdown: string,
    options: OrganizationOptions
  ): Promise<OrganizationResult> => {
    const provider = getStoredProvider();
    const apiKey = getStoredProviderApiKey(provider);
    const model = getStoredProviderModel(provider);
    const providerLabel = getProviderMetadata(provider).label;
    
    if (!apiKey) {
      const error = `${providerLabel} API key not configured. Please add your API key in settings.`;
      setState({ isProcessing: false, error, result: null });
      throw new Error(error);
    }

    setState({ isProcessing: true, error: null, result: null });
    setStreamedContent('');

    try {
      const organizedContent = await organizeContent(
        markdown,
        options,
        { provider, apiKey, model },
        (chunk) => {
          setStreamedContent(chunk);
        }
      );

      const result: OrganizationResult = {
        originalContent: markdown,
        organizedContent,
        mode: options.mode,
        timestamp: new Date(),
        provider: provider as AIProvider,
        model,
      };

      setState({ isProcessing: false, error: null, result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to organize content';
      
      setState({ isProcessing: false, error: errorMessage, result: null });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isProcessing: false, error: null, result: null });
    setStreamedContent('');
  }, []);

  return {
    ...state,
    streamedContent,
    organize,
    reset,
  };
}
