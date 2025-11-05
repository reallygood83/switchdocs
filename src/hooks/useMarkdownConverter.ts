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
        if (sourceType === 'url') {
          // URL에서 의미있는 파일명 생성
          const url = new URL(input);
          const pathParts = url.pathname.split('/').filter(p => p);
          const lastPart = pathParts[pathParts.length - 1] || url.hostname;
          // 쿼리스트링 제거 및 안전한 파일명 생성
          filename = lastPart
            .replace(/[?#].*$/, '')  // 쿼리스트링, 앵커 제거
            .replace(/[^a-zA-Z0-9가-힣._-]/g, '_')  // 안전한 문자만 허용
            .substring(0, 100) || 'converted';  // 최대 100자
          filename = `${filename}-${Date.now()}.md`;
        } else {
          filename = `document-${Date.now()}.md`;
        }
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
