// src/components/ui/ModelSelector.tsx
'use client';

import { AI_MODELS } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  className?: string;
}

export default function ModelSelector({ value, onChange, className = '' }: ModelSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-8 text-sm text-white/80 backdrop-blur-sm transition-colors hover:border-purple-500/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
      >
        {AI_MODELS.map((model) => (
          <option key={model.id} value={model.id} className="bg-gray-900">
            {model.name} ({model.provider}){model.isFree ? ' — Free' : ''}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
    </div>
  );
}
