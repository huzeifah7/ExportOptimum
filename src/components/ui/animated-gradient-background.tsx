
'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export const AnimatedGradientBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'absolute inset-0 z-0 overflow-hidden bg-background transition-opacity duration-1000',
          { 'opacity-100': isMounted, 'opacity-0': !isMounted }
        )}
      >
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_40%)]" />
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[radial-gradient(circle_at_100%_100%,hsl(var(--accent)/0.15),transparent_50%)] animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--brand)/0.1),transparent_60%)] animate-[pulse_12s_cubic-bezier(0.4,0,0.6,1)_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--secondary)/0.2),transparent_70%)] animate-[pulse_15s_cubic-bezier(0.4,0,0.6,1)_infinite_4s]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
