// src/app/app/code/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Loader2, Copy, Check, Wand2 } from 'lucide-react';
import { getApiKey, getDefaultModel } from '@/lib/settings';
import { chatCompletionJSON } from '@/lib/openrouter';
import { CODE_LANGUAGES } from '@/lib/constants';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ModelSelector from '@/components/ui/ModelSelector';
import ApiKeyWarning from '@/components/ui/ApiKeyWarning';
import GlassCard from '@/components/ui/GlassCard';

export default function CodePage() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    setModel(getDefaultModel());
    setHasApiKey(!!getApiKey());
  }, []);

  const generate = async () => {
    if (!prompt.trim()) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    setExplanation('');
    setShowExplanation(false);

    try {
      const systemPrompt = `You are an expert programmer. Generate clean, well-commented, production-quality code.
When the user describes what they want, generate the code in ${language}.
Return ONLY the code wrapped in a single markdown code block with the appropriate language tag.
Do not include any explanation outside the code block unless specifically asked.`;

      const data = await chatCompletionJSON(apiKey, model, [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ]);

      const content = data.choices?.[0]?.message?.content || '';
      setResult(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const explainCode = async () => {
    if (!result) return;
    const apiKey = getApiKey();
    if (!apiKey) return;

    setShowExplanation(true);
    setLoadingExplanation(true);

    try {
      const data = await chatCompletionJSON(apiKey, model, [
        {
          role: 'system',
          content: 'You are an expert programmer. Explain code clearly and thoroughly.',
        },
        {
          role: 'user',
          content: `Explain the following code in detail. Break down what each part does:\n\n${result}`,
        },
      ]);

      const content = data.choices?.[0]?.message?.content || '';
      setExplanation(content);
    } catch (err) {
      setExplanation(`Error: ${err instanceof Error ? err.message : 'Failed to explain'}`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const copyCode = () => {
    // Extract code from markdown code block
    const codeMatch = result.match(/```[\w]*\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : result;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-green-400" />
          <h1 className="text-lg font-semibold text-white">Code Generator</h1>
        </div>
        <ModelSelector value={model} onChange={setModel} className="w-56" />
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {!hasApiKey && <ApiKeyWarning />}

          {/* Input */}
          <GlassCard>
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm font-medium text-white/60">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 focus:border-purple-500/50 focus:outline-none"
              >
                {CODE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-gray-900">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what code you want to generate... e.g., 'A React hook for debouncing input values'"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
            />

            <button
              onClick={generate}
              disabled={!prompt.trim() || loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Code
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
                  <Code2 className="h-4 w-4" />
                  Generated Code
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={explainCode}
                    disabled={loadingExplanation}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
                  >
                    {loadingExplanation ? 'Explaining...' : 'Explain Code'}
                  </button>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="text-white/90">
                <MarkdownRenderer content={result} />
              </div>
            </GlassCard>
          )}

          {/* Explanation */}
          {showExplanation && (
            <GlassCard>
              <h3 className="mb-3 text-sm font-semibold text-white/60">Code Explanation</h3>
              {loadingExplanation ? (
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating explanation...
                </div>
              ) : (
                <div className="text-white/90">
                  <MarkdownRenderer content={explanation} />
                </div>
              )}
            </GlassCard>
          )}

          {/* Empty state */}
          {!result && !loading && (
            <div className="py-12 text-center">
              <Code2 className="mx-auto mb-4 h-16 w-16 text-white/10" />
              <p className="text-white/30">Describe what you want and let AI generate the code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
