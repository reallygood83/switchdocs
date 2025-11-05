import { useState } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { MarkdownPreview } from './MarkdownPreview';
import { useClipboard } from '../hooks/useClipboard';
import { OrganizationResult } from '../types/organization';
import { getModeName } from '../lib/content-organizer';
import { detectLanguage } from '../lib/language-detector';

interface ComparisonViewProps {
  result: OrganizationResult;
  onReset: () => void;
  streamedContent?: string;
  isStreaming?: boolean;
}

export function ComparisonView({ result, onReset, streamedContent, isStreaming }: ComparisonViewProps) {
  const [viewMode, setViewMode] = useState<'comparison' | 'organized'>('organized');
  const { copied, copy } = useClipboard();

  const language = detectLanguage(result.originalContent);
  const isKorean = language === 'ko' || language === 'mixed';
  const displayLanguage = isKorean ? 'ko' : 'en';

  const contentToShow = isStreaming && streamedContent ? streamedContent : result.organizedContent;

  const handleCopy = async () => {
    await copy(contentToShow);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([contentToShow], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `organized-${result.mode}-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      {/* Header with metadata */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-black">
        <div>
          <h3 className="text-lg font-semibold text-black">
            {isKorean ? 'AI 구조화 결과' : 'AI Organization Result'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isKorean ? '모드' : 'Mode'}: <span className="font-medium">{getModeName(result.mode, displayLanguage)}</span>
            {' • '}
            {result.timestamp.toLocaleString(isKorean ? 'ko-KR' : 'en-US')}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('organized')}
            className={`px-4 py-2 rounded-none text-sm font-medium transition-colors border-2 ${
              viewMode === 'organized'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-gray-50'
            }`}
          >
            {isKorean ? '구조화된 콘텐츠' : 'Organized'}
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-none text-sm font-medium transition-colors border-2 ${
              viewMode === 'comparison'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-gray-50'
            }`}
          >
            {isKorean ? '비교 보기' : 'Comparison'}
          </button>
        </div>
      </div>

      {/* Content area */}
      {viewMode === 'organized' ? (
        <div className="space-y-4">
          {isStreaming && (
            <div className="bg-gray-50 border-2 border-black rounded-none p-3">
              <p className="text-sm text-black">
                {isKorean ? '⚡ AI가 실시간으로 콘텐츠를 생성하고 있습니다...' : '⚡ AI is generating content in real-time...'}
              </p>
            </div>
          )}

          <div className="max-h-[600px] overflow-y-auto">
            <MarkdownPreview markdown={contentToShow} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original */}
          <div>
            <h4 className="text-sm font-semibold text-black mb-2">
              {isKorean ? '원본' : 'Original'}
            </h4>
            <div className="max-h-[600px] overflow-y-auto border-2 border-black rounded-none p-4">
              <MarkdownPreview markdown={result.originalContent} />
            </div>
          </div>

          {/* Organized */}
          <div>
            <h4 className="text-sm font-semibold text-black mb-2">
              {isKorean ? '구조화됨' : 'Organized'}
            </h4>
            <div className="max-h-[600px] overflow-y-auto border-2 border-black rounded-none p-4">
              <MarkdownPreview markdown={contentToShow} />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-black">
        <Button
          variant="primary"
          size="md"
          onClick={handleCopy}
          icon={<Copy className="h-4 w-4" />}
          disabled={isStreaming}
        >
          {copied ? (isKorean ? '복사 완료!' : 'Copied!') : (isKorean ? '복사' : 'Copy')}
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={handleDownload}
          icon={<Download className="h-4 w-4" />}
          disabled={isStreaming}
        >
          {isKorean ? '다운로드' : 'Download'}
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={onReset}
          icon={<RotateCcw className="h-4 w-4" />}
        >
          {isKorean ? '초기화' : 'Start Over'}
        </Button>
      </div>
    </div>
  );
}
