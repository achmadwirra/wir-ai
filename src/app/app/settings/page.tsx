// src/app/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Cpu, Palette, Info, Check, Eye, EyeOff, Sparkles } from 'lucide-react';
import { getSettings, saveSettings } from '@/lib/settings';
import { AI_MODELS } from '@/lib/constants';
import { AppSettings } from '@/types';
import GlassCard from '@/components/ui/GlassCard';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    theme: 'dark',
  });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3">
        <Settings className="h-5 w-5 text-white/60" />
        <h1 className="text-lg font-semibold text-white">Settings</h1>
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* API Key */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-400" />
              <h2 className="text-base font-semibold text-white">API Key</h2>
            </div>
            <p className="mb-4 text-sm text-white/40">
              Enter your OpenRouter API key. Get one free at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                openrouter.ai/keys
              </a>
            </p>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => updateSetting('apiKey', e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {settings.apiKey && (
              <p className="mt-2 flex items-center gap-1 text-xs text-green-400">
                <Check className="h-3 w-3" />
                API key configured
              </p>
            )}
          </GlassCard>

          {/* Default Model */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Default Model</h2>
            </div>
            <p className="mb-4 text-sm text-white/40">
              Choose the default AI model for all tools. You can override per-tool.
            </p>
            <div className="space-y-2">
              {AI_MODELS.map((model) => (
                <label
                  key={model.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                    settings.defaultModel === model.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={settings.defaultModel === model.id}
                    onChange={(e) => updateSetting('defaultModel', e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      settings.defaultModel === model.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/20'
                    }`}
                  >
                    {settings.defaultModel === model.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      {model.isFree && (
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400">
                          FREE
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/40">{model.provider}</span>
                  </div>
                </label>
              ))}
            </div>
          </GlassCard>

          {/* Theme */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-400" />
              <h2 className="text-base font-semibold text-white">Theme</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSetting('theme', 'dark')}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  settings.theme === 'dark'
                    ? 'border-purple-500/50 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                🌙 Dark Mode
              </button>
              <button
                onClick={() => updateSetting('theme', 'light')}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  settings.theme === 'light'
                    ? 'border-purple-500/50 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                ☀️ Light Mode
              </button>
            </div>
            <p className="mt-2 text-xs text-white/30">
              Light mode coming soon. Dark mode is the default.
            </p>
          </GlassCard>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            {saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </motion.button>

          {/* About */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-white/40" />
              <h2 className="text-base font-semibold text-white">About</h2>
            </div>
            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-white">Wir AI</span>
                <span>v1.0.0</span>
              </div>
              <p>
                AI Multi-Tool Hub — Your Swiss Army Knife for AI. Built with Next.js, TypeScript,
                and Tailwind CSS. Powered by OpenRouter.
              </p>
              <p className="text-white/30">
                Built with ❤️ by Wir
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
