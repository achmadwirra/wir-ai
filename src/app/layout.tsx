// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wir AI — AI Multi-Tool Hub',
  description: 'Your AI Swiss Army Knife. Chat, analyze images, generate code, summarize text, and translate — all powered by cutting-edge AI models.',
  keywords: ['AI', 'ChatGPT', 'AI Tools', 'Code Generator', 'Translator', 'Summarizer'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
