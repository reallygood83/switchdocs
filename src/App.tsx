import { useState } from 'react';
import { FileText } from 'lucide-react';
import { ConverterForm } from './components/ConverterForm';
import { MarkdownPreview } from './components/MarkdownPreview';
import { ActionButtons } from './components/ActionButtons';
import { Card } from './components/Card';
import { Toast } from './components/Toast';
import { AIOrganizationPanel } from './components/AIOrganizationPanel';
import { SettingsModal } from './components/SettingsModal';
import { ComparisonView } from './components/ComparisonView';
import { useMarkdownConverter } from './hooks/useMarkdownConverter';
import { useContentOrganizer } from './hooks/useContentOrganizer';
import { FileType } from './types/index';
import { OrganizationMode } from './types/organization';
import {
  getStoredProvider,
  getStoredProviderApiKey,
  getProviderMetadata,
} from './lib/ai-config';

function App() {
  const converter = useMarkdownConverter();
  const organizer = useContentOrganizer();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [provider, setProvider] = useState(getStoredProvider());
  const [hasApiKey, setHasApiKey] = useState(() => !!getStoredProviderApiKey(provider));
  const [providerLabel, setProviderLabel] = useState(() => getProviderMetadata(provider).label);

  const handleConvert = async (input: string | File, sourceType: FileType) => {
    try {
      await converter.convert(input, sourceType);
      setToast({ message: 'Successfully converted to Markdown!', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Conversion failed',
        type: 'error',
      });
    }
  };

  const handleReset = () => {
    // Reset the state
    window.location.reload();
  };

  const handleOrganize = async (mode: OrganizationMode) => {
    if (!converter.result) return;

    try {
      await organizer.organize(converter.result.markdown, {
        mode,
        targetLanguage: 'en',
        temperature: 0.3,
      });
      setToast({ message: 'Successfully organized with AI!', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'AI organization failed',
        type: 'error',
      });
    }
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
    const nextProvider = getStoredProvider();
    setProvider(nextProvider);
    setProviderLabel(getProviderMetadata(nextProvider).label);
    setHasApiKey(!!getStoredProviderApiKey(nextProvider));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-black" />
              <div>
                <h1 className="text-4xl font-black text-black tracking-tight">
                  TeacherDoc AI
                </h1>
                <p className="text-black mt-1 font-medium">
                  교사를 위한 문서 마크다운 변환 도구
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn btn-ghost"
            >
              ⚙️ 설정
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {toast && (
          <div className="mb-6">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              autoClose={true}
              duration={3000}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <Card
              title="입력"
              description="웹사이트 주소 또는 문서 파일을 선택하세요"
              className="h-full"
            >
              <ConverterForm
                onConvert={handleConvert}
                isLoading={converter.isLoading}
              />
            </Card>
          </div>

          {/* Right Column - Preview/Results */}
          <div>
            {converter.result ? (
              <div className="space-y-6">
                <Card title="출력" description="변환된 마크다운 문서">
                  <div className="space-y-4">
                    <div className="mb-4 pb-4 border-b-2 border-black">
                      <p className="text-sm text-black">
                        <span className="font-bold">파일명:</span> {converter.result.filename}
                      </p>
                      <p className="text-sm text-black">
                        <span className="font-bold">종류:</span> {converter.result.sourceType}
                      </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <MarkdownPreview markdown={converter.result.markdown} />
                    </div>

                    <div className="pt-4 border-t-2 border-black">
                      <ActionButtons
                        markdown={converter.result.markdown}
                        filename={converter.result.filename}
                        onReset={handleReset}
                      />
                    </div>
                  </div>
                </Card>

                {/* AI Organization Panel */}
                {!organizer.result && (
                  <AIOrganizationPanel
                    markdown={converter.result.markdown}
                    onOrganize={handleOrganize}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    isProcessing={organizer.isProcessing}
                    hasApiKey={hasApiKey}
                    providerLabel={providerLabel}
                  />
                )}

                {/* AI Organization Result */}
                {organizer.result && (
                  <Card title="AI 정리 결과">
                    <ComparisonView
                      result={organizer.result}
                      onReset={organizer.reset}
                      streamedContent={organizer.streamedContent}
                      isStreaming={organizer.isProcessing}
                    />
                  </Card>
                )}

                {/* AI Organization Error */}
                {organizer.error && (
                  <Card title="AI 오류" className="bg-red-50 border-red-600">
                    <p className="text-red-800">{organizer.error}</p>
                  </Card>
                )}
              </div>
            ) : converter.error ? (
              <Card title="오류" className="h-full bg-red-50 border-red-600">
                <p className="text-red-800">{converter.error}</p>
                <button
                  onClick={handleReset}
                  className="mt-4 btn btn-secondary"
                >
                  다시 시도
                </button>
              </Card>
            ) : (
              <Card
                title="미리보기"
                description="변환된 마크다운 문서가 여기에 표시됩니다"
                className="h-full flex items-center justify-center min-h-96"
              >
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">
                    웹사이트 주소를 입력하거나 파일을 업로드하세요
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card title="지원 형식" description="다양한 문서 형식 변환 가능">
            <ul className="space-y-2 text-sm text-black font-medium">
              <li>✓ 웹사이트 (URL)</li>
              <li>✓ HTML 파일</li>
              <li>✓ PDF 문서</li>
              <li>✓ 워드 & 파워포인트</li>
              <li>✓ 엑셀 스프레드시트</li>
              <li>✓ JSON, CSV, XML</li>
              <li>✓ HWP (변환 가이드 제공)</li>
            </ul>
          </Card>

          <Card title="주요 기능" description="TeacherDoc AI로 할 수 있는 일">
            <ul className="space-y-2 text-sm text-black font-medium">
              <li>✓ 클립보드 복사</li>
              <li>✓ .md 파일 다운로드</li>
              <li>✓ 미리보기 제공</li>
              <li>✓ 원본 마크다운 확인</li>
              <li>✓ 드래그 & 드롭 지원</li>
              <li>✓ 실시간 변환</li>
              <li>✓ AI 문서 정리 (Gemini)</li>
            </ul>
          </Card>

          <Card title="교사를 위한 도구" description="왜 마크다운인가요?">
            <ul className="space-y-2 text-sm text-black font-medium">
              <li>✓ AI 친화적 형식</li>
              <li>✓ 문서 구조 보존</li>
              <li>✓ 텍스트 호환</li>
              <li>✓ 버전 관리 용이</li>
              <li>✓ 간결한 마크업</li>
              <li>✓ 범용 문서 형식</li>
              <li>✓ 교육 자료 제작에 최적</li>
            </ul>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-black font-medium">
            Built with React, TypeScript, Tailwind CSS, and Google Gemini 2.5-flash
          </p>
          <p className="text-center text-xs text-gray-600 mt-2">
            교사를 위한 문서 변환 도구 | BYOK (Bring Your Own Key) 지원
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />
    </div>
  );
}

export default App;
