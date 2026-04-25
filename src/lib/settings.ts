// src/lib/settings.ts

import { AppSettings } from '@/types';
import { DEFAULT_MODEL } from './constants';

const SETTINGS_KEY = 'wir-ai-settings';

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return { apiKey: '', defaultModel: DEFAULT_MODEL, theme: 'dark' };
  }
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { apiKey: '', defaultModel: DEFAULT_MODEL, theme: 'dark' };
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getApiKey(): string {
  return getSettings().apiKey;
}

export function getDefaultModel(): string {
  return getSettings().defaultModel;
}
