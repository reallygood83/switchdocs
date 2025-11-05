import { useState, useEffect, useCallback } from 'react';
import { X, Key, Check, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import {
  getStoredProvider,
  setStoredProvider,
  getStoredProviderApiKey,
  setStoredProviderApiKey,
  clearStoredProviderApiKey,
  getStoredProviderModel,
  setStoredProviderModel,
  clearStoredProviderModel,
  getProviderMetadata,
} from '../lib/ai-config';
import { AIProvider } from '../types/ai';
import { GeminiClient } from '../lib/gemini-client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(() => getStoredProvider());
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showKey, setShowKey] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const metadata = getProviderMetadata(selectedProvider);

  const loadStateForProvider = useCallback((provider: AIProvider) => {
    const storedKey = getStoredProviderApiKey(provider);
    const storedModel = getStoredProviderModel(provider);

    setApiKey(storedKey);
    setModel(storedModel);
    setValidationStatus(storedKey ? 'valid' : 'idle');
    setAvailableModels([]);
    setModelError(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const provider = getStoredProvider();
      setSelectedProvider(provider);
      loadStateForProvider(provider);
    }
  }, [isOpen, loadStateForProvider]);

  const loadModels = async (provider: AIProvider, key: string): Promise<string[]> => {
    setIsLoadingModels(true);
    setModelError(null);

    try {
      const providerMetadata = getProviderMetadata(provider);
      const client = new GeminiClient({ apiKey: key });
      const models = await client.listModels();

      setAvailableModels(models);

      if (!models.length) {
        return models;
      }

      if (!models.includes(model)) {
        const preferred = models.find((item) => item.includes(providerMetadata.defaultModel));
        setModel(preferred || models[0]);
      }

      return models;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gemini 모델을 불러오는데 실패했습니다';
      setModelError(message);
      setAvailableModels([]);
      throw new Error(message);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');
    setModelError(null);

    try {
      const trimmedKey = apiKey.trim();
      const models = await loadModels(selectedProvider, trimmedKey);
      setValidationStatus('valid');
      if (!models.length) {
        setModelError('No models returned. You can still save a custom model name.');
      }
    } catch {
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    const trimmedModel = model.trim() || metadata.defaultModel;

    setStoredProvider(selectedProvider);

    if (trimmedKey) {
      setStoredProviderApiKey(selectedProvider, trimmedKey);
    } else {
      clearStoredProviderApiKey(selectedProvider);
    }

    setStoredProviderModel(selectedProvider, trimmedModel);
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setModel(metadata.defaultModel);
    clearStoredProviderApiKey(selectedProvider);
    clearStoredProviderModel(selectedProvider);
    setValidationStatus('idle');
    setAvailableModels([]);
    setModelError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border-4 border-black rounded-none shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-black" />
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">
              Gemini API 설정
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:opacity-70 transition-opacity"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm font-medium text-black mb-1">
              🤖 Google Gemini 2.0 Flash
            </p>
            <p className="text-xs text-gray-600">
              {metadata.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Gemini API 키
            </label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationStatus('idle');
                }}
                placeholder={metadata.placeholderKey || 'AIza...'}
                className="pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showKey ? '👁️' : '🔒'}
              </button>
            </div>

            {validationStatus === 'valid' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>API 키가 유효합니다</span>
              </div>
            )}

            {validationStatus === 'invalid' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>유효하지 않은 API 키입니다</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              기본 모델
            </label>
            <Input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={metadata.defaultModel}
            />

            {availableModels.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-600">
                  감지된 모델 중에서 선택
                </p>
                <select
                  value={availableModels.includes(model) ? model : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setModel(value);
                    }
                  }}
                  className="input-field"
                  disabled={isLoadingModels}
                >
                  <option value="">모델 선택</option>
                  {availableModels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isLoadingModels && (
              <p className="mt-2 text-sm text-gray-600">
                사용 가능한 모델을 불러오는 중...
              </p>
            )}

            {modelError && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{modelError}</span>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-600">
              이 모델이 AI 콘텐츠 생성에 기본적으로 사용됩니다.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm font-medium text-black mb-2">
              📝 API 키 발급 방법
            </p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>
                <a
                  href={metadata.docsUrl || 'https://aistudio.google.com/app/apikey'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline font-medium"
                >
                  Google AI Studio
                </a>{' '}
                방문
              </li>
              <li>Google 계정으로 로그인</li>
              <li>API 키 생성 버튼 클릭</li>
              <li>생성된 키를 복사하여 위에 붙여넣기</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm text-black">
              <strong className="font-bold">🔒 개인정보 보호:</strong> API 키는 브라우저에 로컬로 저장되며 서버로 전송되지 않습니다.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm font-medium text-black mb-2">
              💾 파일 저장 안내
            </p>
            <p className="text-xs text-gray-600">
              변환된 마크다운 파일은 브라우저의 기본 다운로드 폴더에 저장됩니다.
              파일명은 원본 파일명을 기반으로 자동 생성되며, 다운로드 후 원하는 위치로 이동할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-black">
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={!apiKey}
          >
            초기화
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleValidate}
              isLoading={isValidating}
              disabled={!apiKey.trim() || isValidating}
            >
              검증 및 모델 불러오기
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
