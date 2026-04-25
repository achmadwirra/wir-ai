// src/components/ui/MarkdownRenderer.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-white/10">
      <div className="flex items-center justify-between bg-white/5 px-4 py-1.5">
        <span className="text-xs text-white/40">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'rgba(0,0,0,0.3)',
          fontSize: '0.85rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const value = String(children).replace(/\n$/, '');
          
          if (match) {
            return <CodeBlock language={match[1]} value={value} />;
          }

          return (
            <code
              className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-purple-300"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 leading-relaxed last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>;
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="mb-3 mt-4 text-xl font-bold">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="mb-2 mt-3 text-lg font-bold">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="mb-2 mt-3 text-base font-semibold">{children}</h3>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="my-3 border-l-2 border-purple-500 pl-4 italic text-white/70">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="border border-white/10 px-3 py-2">{children}</td>;
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
