// src/types/index.ts

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  isFree?: boolean;
}

export interface AppSettings {
  apiKey: string;
  defaultModel: string;
  theme: 'dark' | 'light';
}

export interface VisionResult {
  description: string;
  loading: boolean;
  error?: string;
}

export interface CodeResult {
  code: string;
  language: string;
  explanation?: string;
  loading: boolean;
  error?: string;
}

export interface SummaryResult {
  summary: string;
  format: 'bullets' | 'paragraph' | 'takeaways';
  originalWordCount: number;
  summaryWordCount: number;
  loading: boolean;
  error?: string;
}

export interface TranslationResult {
  translatedText: string;
  loading: boolean;
  error?: string;
}
