// src/lib/constants.ts

import { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    isFree: true,
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    isFree: true,
  },
  {
    id: 'meta-llama/llama-4-maverick:free',
    name: 'Llama 4 Maverick',
    provider: 'Meta',
    isFree: true,
  },
  {
    id: 'qwen/qwen3-235b-a22b:free',
    name: 'Qwen 3 235B',
    provider: 'Qwen',
    isFree: true,
  },
  {
    id: 'minimax/minimax-m2.5:free',
    name: 'MiniMax M2.5',
    provider: 'MiniMax',
    isFree: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
  },
];

export const DEFAULT_MODEL = 'google/gemini-2.5-flash';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesian' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ms', name: 'Malay' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'uk', name: 'Ukrainian' },
];

export const CODE_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'SQL',
  'HTML/CSS',
  'Bash',
];

export const NAV_ITEMS = [
  { href: '/app/chat', label: 'Chat', icon: 'MessageSquare' as const },
  { href: '/app/vision', label: 'Vision', icon: 'Eye' as const },
  { href: '/app/code', label: 'Code', icon: 'Code2' as const },
  { href: '/app/summarize', label: 'Summarize', icon: 'FileText' as const },
  { href: '/app/translate', label: 'Translate', icon: 'Languages' as const },
  { href: '/app/settings', label: 'Settings', icon: 'Settings' as const },
];
