export type FileType = 'url' | 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'html' | 'csv' | 'json' | 'xml';

export interface ConversionResult {
  markdown: string;
  filename: string;
  timestamp: Date;
  sourceType: FileType;
}

export interface ConversionState {
  isLoading: boolean;
  error: string | null;
  result: ConversionResult | null;
}
