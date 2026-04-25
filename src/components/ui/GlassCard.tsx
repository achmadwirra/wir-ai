// src/components/ui/GlassCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function GlassCard({ children, className = '', animate = true }: GlassCardProps) {
  const Wrapper = animate ? motion.div : 'div';
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }
    : {};

  return (
    <Wrapper
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl ${className}`}
      {...animateProps}
    >
      {children}
    </Wrapper>
  );
}
