import { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { HWPGuideModal } from './HWPGuideModal';
import { isValidUrl } from '../lib/markitdown';
import { FileType } from '../types/index';

interface ConverterFormProps {
  onConvert: (input: string | File, sourceType: FileType) => Promise<void>;
  isLoading: boolean;
}

const fileTypeOptions: { value: FileType; label: string; accept?: string }[] = [
  { value: 'url', label: 'Website URL', accept: undefined },
  { value: 'html', label: 'HTML File', accept: '.html,.htm' },
  { value: 'pdf', label: 'PDF File', accept: '.pdf' },
  { value: 'docx', label: 'Word Document', accept: '.docx' },
  { value: 'pptx', label: 'PowerPoint', accept: '.pptx' },
  { value: 'xlsx', label: 'Excel File', accept: '.xlsx' },
  { value: 'csv', label: 'CSV File', accept: '.csv' },
  { value: 'json', label: 'JSON File', accept: '.json' },
  { value: 'xml', label: 'XML File', accept: '.xml' },
];

export function ConverterForm({ onConvert, isLoading }: ConverterFormProps) {
  const [url, setUrl] = useState('');
  const [sourceType, setSourceType] = useState<FileType>('url');
  const [file, setFile] = useState<File | null>(null);
  const [urlError, setUrlError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isHWPGuideOpen, setIsHWPGuideOpen] = useState(false);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setUrlError('');
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FileType;
    setSourceType(newType);
    setUrl('');
    setFile(null);
    setUrlError('');
  };

  const handleFileSelect = (selectedFile: File) => {
    // Check if file is HWP
    if (selectedFile.name.toLowerCase().endsWith('.hwp')) {
      setIsHWPGuideOpen(true);
      return;
    }
    setFile(selectedFile);
    setUrl('');
    setUrlError('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (sourceType === 'url') {
      if (!url.trim()) {
        setUrlError('Please enter a URL');
        return;
      }
      if (!isValidUrl(url)) {
        setUrlError('Please enter a valid URL');
        return;
      }
      await onConvert(url, sourceType);
    } else if (file) {
      await onConvert(file, sourceType);
    } else {
      setUrlError('Please select a file');
    }
  };

  const currentTypeOption = fileTypeOptions.find((opt) => opt.value === sourceType);
  const acceptFiles = currentTypeOption?.accept || '';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-black">
          입력 형식
        </label>
        <select
          value={sourceType}
          onChange={handleTypeChange}
          className="input-field"
        >
          {fileTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {sourceType === 'url' ? (
        <Input
          label="웹사이트 주소"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          error={urlError}
          disabled={isLoading}
        />
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            파일 선택
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-black bg-gray-100 scale-[1.02]'
                : 'border-gray-400 hover:border-black hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptFiles}
              onChange={handleInputChange}
              disabled={isLoading}
              className="hidden"
            />
            <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${
              dragActive ? 'text-black' : 'text-gray-400'
            }`} />
            {file ? (
              <div className="py-4">
                <p className="font-black text-xl text-black mb-2">✅ {file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-lg text-black mb-4">
                  {dragActive ? '📥 여기에 파일을 놓으세요!' : '📂 파일을 드래그하거나 버튼을 클릭하세요'}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="px-8 py-4 bg-black text-white border-4 border-black font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📂 파일 선택
                </button>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  지원 형식: {acceptFiles ? acceptFiles : '모든 파일 형식'}
                </p>
              </div>
            )}
          </div>
          {urlError && (
            <p className="mt-2 text-sm text-red-600">{urlError}</p>
          )}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={handleConvert}
        isLoading={isLoading}
        className="w-full"
      >
        마크다운으로 변환
      </Button>

      <HWPGuideModal
        isOpen={isHWPGuideOpen}
        onClose={() => setIsHWPGuideOpen(false)}
      />
    </div>
  );
}
