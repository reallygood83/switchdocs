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

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
