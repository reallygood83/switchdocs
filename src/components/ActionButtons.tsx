import { Copy, Download, RotateCcw } from 'lucide-react';
import { Button } from './Button';
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
    <div className="flex flex-wrap gap-2">
      <Button
        variant="primary"
        size="md"
        onClick={handleCopy}
        icon={<Copy className="h-4 w-4" />}
      >
        {copied ? '복사 완료!' : '복사'}
      </Button>

      <Button
        variant="secondary"
        size="md"
        onClick={handleDownload}
        icon={<Download className="h-4 w-4" />}
      >
        다운로드
      </Button>

      <Button
        variant="ghost"
        size="md"
        onClick={onReset}
        icon={<RotateCcw className="h-4 w-4" />}
      >
        초기화
      </Button>
    </div>
  );
}
