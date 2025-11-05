import { X, FileText, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface HWPGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HWPGuideModal({ isOpen, onClose }: HWPGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border-4 border-black rounded-none shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-black" />
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">
              HWP 파일 변환 가이드
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
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm text-black">
              <strong>📚 안내:</strong>
              HWP 파일은 브라우저에서 직접 변환할 수 없습니다.
              아래 방법 중 하나를 선택하여 PDF로 변환한 후 업로드해주세요.
            </p>
          </div>

          {/* Method 1: Using Hancom Office */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-none text-sm">1</span>
              한컴오피스 사용 (권장)
            </h3>
            <div className="ml-8 space-y-2">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>한컴오피스에서 HWP 파일 열기</li>
                <li>상단 메뉴에서 <strong className="text-black">파일 → 다른 이름으로 저장</strong> 선택</li>
                <li>파일 형식에서 <strong className="text-black">PDF (*.pdf)</strong> 선택</li>
                <li>저장 후 변환된 PDF 파일을 업로드</li>
              </ol>
            </div>
          </div>

          {/* Method 2: Online Converter */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-none text-sm">2</span>
              온라인 변환 서비스 이용
            </h3>
            <div className="ml-8 space-y-3">
              <p className="text-sm text-gray-600">
                다음 온라인 서비스들을 이용할 수 있습니다:
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.ilovepdf.com/ko/hwp_to_pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-white rounded-none border-2 border-black hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-black">
                    iLovePDF - HWP to PDF
                  </span>
                  <ArrowRight className="h-4 w-4 text-black" />
                </a>
                <a
                  href="https://convertio.co/kr/hwp-pdf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-white rounded-none border-2 border-black hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-black">
                    Convertio - HWP to PDF
                  </span>
                  <ArrowRight className="h-4 w-4 text-black" />
                </a>
              </div>
            </div>
          </div>

          {/* Method 3: Free Hancom Viewer */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-none text-sm">3</span>
              무료 한글 뷰어 사용
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-600">
                한컴오피스가 없는 경우:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="https://www.hancom.com/etc/viewerDownload.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline font-medium"
                  >
                    한컴오피스 뷰어
                  </a>
                  {' '}다운로드 (무료)
                </li>
                <li>뷰어에서 HWP 파일 열기</li>
                <li>
                  <strong className="text-black">파일 → PDF로 저장</strong> 선택
                </li>
                <li>변환된 PDF 파일을 업로드</li>
              </ol>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-gray-50 p-4 rounded-none border-2 border-black">
            <p className="text-sm text-black">
              <strong>🔒 보안 안내:</strong>{' '}
              개인정보나 민감한 내용이 포함된 문서는 온라인 변환 서비스보다
              한컴오피스를 직접 사용하는 것을 권장합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-black">
          <Button variant="primary" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
