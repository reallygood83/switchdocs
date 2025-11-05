import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface CustomPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export function CustomPromptModal({ isOpen, onClose, onSubmit }: CustomPromptModalProps) {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt('');
      onClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <h2 className="text-2xl font-black text-black">직접 입력</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            AI가 어떻게 콘텐츠를 구조화할지 직접 지시하세요.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예시: 이 내용을 Q&A 형식으로 정리하고, 각 질문마다 간단한 설명을 추가해주세요."
            className="w-full h-48 p-4 border-4 border-black font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300">
            <p className="text-xs font-bold text-gray-700 mb-2">💡 팁:</p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>구체적으로 지시할수록 원하는 결과를 얻을 수 있습니다</li>
              <li>형식, 스타일, 구조 등을 명확히 설명하세요</li>
              <li>예시: "목차를 만들고 각 섹션을 3-5개 문단으로 정리"</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t-4 border-black">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="flex-1"
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}
