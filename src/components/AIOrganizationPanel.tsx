import { useState } from 'react';
import { Sparkles, Settings } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { OrganizationMode } from '../types/organization';
import { getModeName, getModeDescription } from '../lib/content-organizer';
import { detectLanguage } from '../lib/language-detector';

interface AIOrganizationPanelProps {
  markdown: string;
  onOrganize: (mode: OrganizationMode) => void;
  onOpenSettings: () => void;
  isProcessing: boolean;
  hasApiKey: boolean;
  providerLabel: string;
}

const organizationModes: OrganizationMode[] = [
  'restructure',
  'summarize',
  'extract-key-points',
  'translate-organize',
  'clean-format',
  // Teacher-specific modes
  'lesson-plan',
  'observation-record',
  'meeting-minutes',
  'official-document',
];

export function AIOrganizationPanel({
  markdown,
  onOrganize,
  onOpenSettings,
  isProcessing,
  hasApiKey,
  providerLabel,
}: AIOrganizationPanelProps) {
  const [selectedMode, setSelectedMode] = useState<OrganizationMode>('restructure');
  const [targetLanguage, setTargetLanguage] = useState<'ko' | 'en'>('en');

  const language = detectLanguage(markdown);
  const isKorean = language === 'ko' || language === 'mixed';
  const displayLanguage = isKorean ? 'ko' : 'en';

  const handleOrganize = () => {
    onOrganize(selectedMode);
  };

  if (!markdown) {
    return null;
  }

  return (
    <Card
      title={isKorean ? 'AI 콘텐츠 구조화' : 'AI Content Organization'}
      description={
        isKorean
          ? `${providerLabel} 모델을 사용하여 콘텐츠를 자동으로 구조화하세요`
          : `Automatically organize your content using ${providerLabel} models`
      }
      className="mt-6"
    >
      <div className="space-y-4">
        {!hasApiKey && (
          <div className="bg-gray-50 border-2 border-black rounded-none p-4">
            <p className="text-sm text-black mb-2">
              {isKorean
                ? `${providerLabel} API 키가 설정되지 않았습니다. AI 기능을 사용하려면 API 키를 추가하세요.`
                : `${providerLabel} API key not configured. Add your API key to use AI features.`}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenSettings}
              icon={<Settings className="h-4 w-4" />}
            >
              {isKorean ? '설정 열기' : 'Open Settings'}
            </Button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            {isKorean ? '구조화 모드' : 'Organization Mode'}
          </label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as OrganizationMode)}
            disabled={isProcessing}
            className="input-field"
          >
            {organizationModes.map((mode) => (
              <option key={mode} value={mode}>
                {getModeName(mode, displayLanguage)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-600">
            {getModeDescription(selectedMode, displayLanguage)}
          </p>
        </div>

        {selectedMode === 'translate-organize' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              {isKorean ? '대상 언어' : 'Target Language'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTargetLanguage('ko')}
                className={`flex-1 px-4 py-2 rounded-none border-2 font-medium transition-colors ${
                  targetLanguage === 'ko'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-50'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => setTargetLanguage('en')}
                className={`flex-1 px-4 py-2 rounded-none border-2 font-medium transition-colors ${
                  targetLanguage === 'en'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black hover:bg-gray-50'
                }`}
              >
                English
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleOrganize}
            isLoading={isProcessing}
            disabled={!hasApiKey || isProcessing}
            icon={<Sparkles className="h-5 w-5" />}
            className="flex-1"
          >
            {isProcessing
              ? (isKorean ? '처리 중...' : 'Processing...')
              : (isKorean ? 'AI로 구조화' : 'Organize with AI')}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={onOpenSettings}
            icon={<Settings className="h-5 w-5" />}
          >
            {isKorean ? '설정' : 'Settings'}
          </Button>
        </div>

        {language !== 'en' && (
          <div className="bg-gray-50 border-2 border-black rounded-none p-3">
            <p className="text-sm text-black">
              {language === 'ko'
                ? '✨ 한국어 콘텐츠가 감지되었습니다. AI가 한국어에 최적화된 구조화를 제공합니다.'
                : '✨ Mixed language content detected. AI will optimize accordingly.'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
