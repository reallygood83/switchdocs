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
          <div className="flex flex-col items-center gap-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white border-2 border-red-600 rounded-none font-medium hover:bg-red-700 hover:border-red-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                배움의 달인 유튜브
              </a>
              <a
                href="https://open.kakao.com/o/gubGYQ7g"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black border-2 border-yellow-400 rounded-none font-medium hover:bg-yellow-500 hover:border-yellow-500 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857 0h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-2.32-4.159a.472.472 0 0 0-.471-.472h-1.93a.472.472 0 0 0-.472.472v4.157c0 .26.211.472.472.472h1.93a.472.472 0 1 0 0-.943h-1.459v-1.24h.99a.472.472 0 1 0 0-.944h-.99v-1.03h1.459a.472.472 0 0 0 .471-.472z"/>
                </svg>
                개발자 연락하기
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center pt-2 border-t-2 border-black w-full">
              <p className="text-xs text-gray-600">
                © 2025 Moon-Jung Kim. All rights reserved.
              </p>
            </div>
          </div>
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
