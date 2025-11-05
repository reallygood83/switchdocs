import { useState, useCallback } from 'react';
import { convertToMarkdown, detectFileType } from '../lib/markitdown';
import { ConversionResult, ConversionState, FileType } from '../types/index';

export function useMarkdownConverter() {
  const [state, setState] = useState<ConversionState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const convert = useCallback(async (input: string | File, sourceType?: FileType) => {
    setState({ isLoading: true, error: null, result: null });

    try {
      // Determine source type
      let finalSourceType = sourceType;
      let filename = '';

      if (typeof input === 'string') {
        finalSourceType = sourceType || 'url';
        filename = sourceType === 'url' ? new URL(input).hostname : `document-${Date.now()}.md`;
      } else if (input instanceof File) {
        finalSourceType = sourceType || detectFileType(input.name);
        filename = input.name.replace(/\.[^.]+$/, '.md');
      }

      if (!finalSourceType) {
        throw new Error('Could not determine file type');
      }

      const markdown = await convertToMarkdown(input, finalSourceType);

      const result: ConversionResult = {
        markdown,
        filename,
        timestamp: new Date(),
        sourceType: finalSourceType,
      };

      setState({ isLoading: false, error: null, result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      setState({ isLoading: false, error: errorMessage, result: null });
      throw error;
    }
  }, []);

  return { ...state, convert };
}
