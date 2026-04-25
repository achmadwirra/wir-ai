// src/app/app/vision/page.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Upload, Link as LinkIcon, X, Loader2, ImageIcon } from 'lucide-react';
import { getApiKey, getDefaultModel } from '@/lib/settings';
import { chatCompletionJSON } from '@/lib/openrouter';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ModelSelector from '@/components/ui/ModelSelector';
import ApiKeyWarning from '@/components/ui/ApiKeyWarning';
import GlassCard from '@/components/ui/GlassCard';

export default function VisionPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setModel(getDefaultModel());
    setHasApiKey(!!getApiKey());
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(',')[1]);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;
    setImagePreview(imageUrl);
    setImageBase64(null);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageUrl('');
    setResult('');
    setError('');
  };

  const analyze = async () => {
    if (!imagePreview) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const imageContent = imageBase64
        ? { type: 'image_url' as const, image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        : { type: 'image_url' as const, image_url: { url: imagePreview! } };

      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt || 'Analyze this image in detail. Describe what you see, including objects, colors, composition, text, and any notable features.',
            },
            imageContent,
          ],
        },
      ];

      const data = await chatCompletionJSON(apiKey, model, messages);
      const content = data.choices?.[0]?.message?.content || 'No analysis available.';
      setResult(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-cyan-400" />
          <h1 className="text-lg font-semibold text-white">Vision Analyzer</h1>
        </div>
        <ModelSelector value={model} onChange={setModel} className="w-56" />
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {!hasApiKey && <ApiKeyWarning />}

          {/* Upload area */}
          {!imagePreview ? (
            <GlassCard>
              <div
                className={`drop-zone flex flex-col items-center justify-center rounded-xl p-12 text-center ${
                  isDragging ? 'active' : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mb-4 h-12 w-12 text-purple-400/60" />
                <p className="mb-2 text-lg font-medium text-white/80">
                  Drop an image here or click to upload
                </p>
                <p className="text-sm text-white/40">Supports JPG, PNG, GIF, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/30">or paste URL</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mt-4 flex gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                  <LinkIcon className="h-4 w-4 text-white/30" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-transparent py-2.5 text-sm text-white placeholder-white/30 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                </div>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim()}
                  className="rounded-xl bg-purple-600/30 px-4 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-600/50 disabled:opacity-40"
                >
                  Load
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="relative">
                <button
                  onClick={clearImage}
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-80 w-full rounded-xl object-contain"
                />
              </div>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Custom prompt (optional) — e.g., 'What text is in this image?'"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
                />
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          )}

          {/* Result */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <GlassCard>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/60">
                <ImageIcon className="h-4 w-4" />
                Analysis Result
              </h3>
              <div className="text-white/90">
                <MarkdownRenderer content={result} />
              </div>
            </GlassCard>
          )}

          {/* Empty state */}
          {!imagePreview && !result && (
            <div className="py-12 text-center">
              <Eye className="mx-auto mb-4 h-16 w-16 text-white/10" />
              <p className="text-white/30">Upload an image to get AI-powered analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
