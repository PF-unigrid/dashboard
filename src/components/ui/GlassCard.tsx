// src/components/ui/GlassCard.tsx

import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'blur';
  padding?: 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = 'default',
  padding = 'md'
}) => {
  const variants = {
    default: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl',
    gradient: 'bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-white/30 shadow-2xl',
    blur: 'bg-white/60 backdrop-blur-xl border border-white/10 shadow-lg'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]',
      variants[variant],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};