// src/components/ui/ApiKeyWarning.tsx
'use client';

import { AlertTriangle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function ApiKeyWarning() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-200">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <p className="text-sm">
        No API key configured.{' '}
        <Link href="/app/settings" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-yellow-100">
          <Settings className="h-3.5 w-3.5" />
          Add your OpenRouter API key in Settings
        </Link>
      </p>
    </div>
  );
}
