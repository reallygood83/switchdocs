// TeacherDoc AI only supports Gemini
export type AIProvider = 'gemini';

export interface ProviderConfig {
  provider: AIProvider;
  model: string;
}

export interface ProviderMetadata {
  id: AIProvider;
  label: string;
  description: string;
  defaultModel: string;
  placeholderKey?: string;
  docsUrl?: string;
}
