import { Copy, Download, RotateCcw } from 'lucide-react';
import { Button as ShadcnButton } from './ui/button';
import { useClipboard } from '../hooks/useClipboard';

interface ActionButtonsProps {
  markdown: string;
  filename: string;
  onReset: () => void;
}

export function ActionButtons({ markdown, filename, onReset }: ActionButtonsProps) {
  const { copied, copy } = useClipboard();

  const handleCopy = async () => {
    await copy(markdown);
  };

  const handleDownload = async () => {
    try {
      // File System Access API 지원 확인
      if ('showSaveFilePicker' in window) {
        // 최신 브라우저: 저장 위치 선택 대화상자 표시
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'Markdown 파일',
              accept: { 'text/markdown': ['.md'] },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(markdown);
        await writable.close();
      } else {
        // 구형 브라우저: 기본 다운로드 방식 사용
        const element = document.createElement('a');
        const file = new Blob([markdown], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      // 사용자가 취소했거나 오류 발생 시
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('파일 저장 실패:', error);
        // 폴백: 기본 다운로드 방식
        const element = document.createElement('a');
        const file = new Blob([markdown], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <ShadcnButton
        onClick={handleCopy}
        className="bg-black text-white border-4 border-black hover:bg-gray-800 font-bold text-base px-6 py-6"
      >
        <Copy className="h-5 w-5 mr-2" />
        {copied ? '복사 완료!' : '복사'}
      </ShadcnButton>

      <ShadcnButton
        onClick={handleDownload}
        variant="outline"
        className="bg-white text-black border-4 border-black hover:bg-gray-100 font-bold text-base px-6 py-6"
      >
        <Download className="h-5 w-5 mr-2" />
        다운로드
      </ShadcnButton>

      <ShadcnButton
        onClick={onReset}
        variant="ghost"
        className="text-black border-2 border-transparent hover:border-black hover:bg-gray-50 font-medium text-base px-6 py-6"
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        초기화
      </ShadcnButton>
    </div>
  );
}
