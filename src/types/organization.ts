export type OrganizationMode =
  | 'restructure'
  | 'summarize'
  | 'extract-key-points'
  | 'translate-organize'
  | 'clean-format'
  // Teacher-specific modes
  | 'lesson-plan'
  | 'observation-record'
  | 'meeting-minutes'
  | 'official-document'
  // Custom mode
  | 'custom';

export interface OrganizationOptions {
  mode: OrganizationMode;
  targetLanguage?: 'ko' | 'en';
  preserveFormatting?: boolean;
  temperature?: number;
  customPrompt?: string; // For custom mode
}

export interface OrganizationResult {
  originalContent: string;
  organizedContent: string;
  mode: OrganizationMode;
  timestamp: Date;
  tokensUsed?: number;
  provider?: import('./ai').AIProvider;
  model?: string;
}

export interface OrganizationState {
  isProcessing: boolean;
  error: string | null;
  result: OrganizationResult | null;
}
