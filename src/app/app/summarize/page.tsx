// src/app/app/summarize/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { getApiKey, getDefaultModel } from '@/lib/settings';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ModelSelector from '@/components/ui/ModelSelector';
import ApiKeyWarning from '@/components/ui/ApiKeyWarning';
import GlassCard from '@/components/ui/GlassCard';

type SummaryFormat = 'bullets' | 'paragraph' | 'takeaways';

export default function SummarizePage() {
  const [text, setText] = useState('');
  const [format, setFormat] = useState<SummaryFormat>('bullets');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    setModel(getDefaultModel());
    setHasApiKey(!!getApiKey());
  }, []);

  const wordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  const summarize = async () => {
    if (!text.trim()) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, format, model, apiKey }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Summarization failed');
      setResult(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formats: { value: SummaryFormat; label: string; desc: string }[] = [
    { value: 'bullets', label: 'Bullet Points', desc: 'Concise list' },
    { value: 'paragraph', label: 'Paragraph', desc: 'Flowing summary' },
    { value: 'takeaways', label: 'Key Takeaways', desc: 'Main insights' },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-400" />
          <h1 className="text-lg font-semibold text-white">Summarizer</h1>
        </div>
        <ModelSelector value={model} onChange={setModel} className="w-56" />
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {!hasApiKey && <ApiKeyWarning />}

          {/* Input */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-white/60">Paste your text</label>
              <span className="text-xs text-white/30">{wordCount(text)} words</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text you want to summarize here..."
              rows={8}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
            />

            {/* Format selector */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    format === f.value
                      ? 'border-purple-500/50 bg-purple-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                  }`}
                >
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs opacity-60">{f.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={summarize}
              disabled={!text.trim() || loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Summarize
                </>
              )}
            </button>
          </GlassCard>

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

          {/* Result */}
          {result && (
            <GlassCard>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white/60">
                  <FileText className="h-4 w-4" />
                  Summary
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>Original: {wordCount(text)} words</span>
                  <span>→</span>
                  <span>Summary: {wordCount(result)} words</span>
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-green-400">
                    {Math.round((1 - wordCount(result) / wordCount(text)) * 100)}% shorter
                  </span>
                </div>
              </div>
              <div className="text-white/90">
                <MarkdownRenderer content={result} />
              </div>
            </GlassCard>
          )}

          {/* Empty state */}
          {!result && !loading && (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-white/10" />
              <p className="text-white/30">Paste any text and get a concise AI summary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
