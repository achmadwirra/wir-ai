// src/app/app/translate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Languages, Loader2, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { getApiKey, getDefaultModel } from '@/lib/settings';
import { LANGUAGES } from '@/lib/constants';
import ModelSelector from '@/components/ui/ModelSelector';
import ApiKeyWarning from '@/components/ui/ApiKeyWarning';
import GlassCard from '@/components/ui/GlassCard';

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('id');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setModel(getDefaultModel());
    setHasApiKey(!!getApiKey());
  }, []);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(result);
    setResult(text);
  };

  const translate = async () => {
    if (!text.trim()) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    const sourceLabel = LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang;
    const targetLabel = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: sourceLabel,
          targetLang: targetLabel,
          model,
          apiKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Translation failed');
      setResult(data.translatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-pink-400" />
          <h1 className="text-lg font-semibold text-white">Translator</h1>
        </div>
        <ModelSelector value={model} onChange={setModel} className="w-56" />
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {!hasApiKey && <ApiKeyWarning />}

          {/* Language selectors */}
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-white/40">From</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-purple-500/50 focus:outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-900">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapLanguages}
                className="mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-white/40">To</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:border-purple-500/50 focus:outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-900">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Input / Output */}
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <label className="mb-2 block text-sm font-medium text-white/60">Source Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={8}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              />
              <div className="mt-2 text-right text-xs text-white/20">
                {text.length} characters
              </div>
            </GlassCard>

            <GlassCard>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-white/60">Translation</label>
                {result && (
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="min-h-[200px] rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Translating...
                  </div>
                ) : result ? (
                  <p className="whitespace-pre-wrap text-white/90">{result}</p>
                ) : (
                  <p className="text-white/20">Translation will appear here...</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Translate button */}
          <button
            onClick={translate}
            disabled={!text.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="h-5 w-5" />
                Translate
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
