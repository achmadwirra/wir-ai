// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  Eye,
  Code2,
  FileText,
  Languages,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Conversational AI with streaming responses. Multiple models, markdown rendering, code highlighting.',
    color: 'from-purple-500 to-purple-700',
    href: '/app/chat',
  },
  {
    icon: Eye,
    title: 'Vision Analyzer',
    description: 'Upload images and get AI-powered analysis. Object detection, scene description, text extraction.',
    color: 'from-cyan-500 to-cyan-700',
    href: '/app/vision',
  },
  {
    icon: Code2,
    title: 'Code Generator',
    description: 'Describe what you need, get production-ready code. Supports 15+ programming languages.',
    color: 'from-green-500 to-green-700',
    href: '/app/code',
  },
  {
    icon: FileText,
    title: 'Summarizer',
    description: 'Paste any text and get concise summaries. Bullet points, paragraphs, or key takeaways.',
    color: 'from-orange-500 to-orange-700',
    href: '/app/summarize',
  },
  {
    icon: Languages,
    title: 'Translator',
    description: 'Translate between 20+ languages instantly. Preserves tone, context, and formatting.',
    color: 'from-pink-500 to-pink-700',
    href: '/app/translate',
  },
];

const stats = [
  { icon: Zap, label: 'AI Models', value: '5+' },
  { icon: Shield, label: 'Tools', value: '5' },
  { icon: Globe, label: 'Languages', value: '22+' },
];

function Particles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['rgba(139,92,246,0.3)', 'rgba(6,182,212,0.2)', 'rgba(168,85,247,0.2)'];
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="gradient-bg relative min-h-screen overflow-hidden">
      <Particles />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Wir AI</span>
        </div>
        <Link
          href="/app/chat"
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          Launch App
        </Link>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
            <Sparkles className="h-4 w-4" />
            AI-Powered Multi-Tool Hub
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
            Your AI{' '}
            <span className="text-gradient">Swiss Army Knife</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
            Chat, analyze images, generate code, summarize text, and translate — all in one
            beautiful interface. Powered by the world&apos;s best AI models.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/app/chat"
              className="glow-purple group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
            >
              Try it free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-8 py-3.5 text-lg font-medium text-white/80 transition-all hover:bg-white/5"
            >
              View Source
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mt-16 flex max-w-md justify-center gap-8 md:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-purple-400" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-white md:text-4xl"
        >
          Everything you need, <span className="text-gradient">one platform</span>
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={feature.href} className="group block">
                <div className="glass h-full rounded-2xl p-6 transition-all hover:border-purple-500/30 hover:bg-white/[0.07]">
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-purple-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-white/30">
        <p>Built with ❤️ by Wir · Powered by OpenRouter & Next.js</p>
      </footer>
    </div>
  );
}
