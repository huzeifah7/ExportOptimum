'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LeafStyle {
  left: string;
  delay: string;
  duration: string;
}

export function ExportOptimumLoading({ variant = 'pulse' }: { variant?: 'pulse' | 'spin' | 'breathe' | 'minimal' }) {
  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="relative">
          <div className="animate-pulse">
            <Image 
              src="/EOLogo.png" 
              alt="Export Optimum" 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(88,92%,40%)]" />
          </div>
        </div>
        <p className="mt-8 text-sm font-semibold text-gray-600 animate-pulse">
          Loading the finest produce...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={200} 
          height={200}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function FullPageLoading() {
  const [leafStyles, setLeafStyles] = useState<LeafStyle[]>([]);

  useEffect(() => {
    const styles = [...Array(8)].map((_, i) => ({
      left: `${(i * 15) + (Math.random() * 5)}%`,
      delay: `${i * 0.4}s`,
      duration: `${4 + Math.random() * 3}s`,
    }));
    setLeafStyles(styles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {leafStyles.map((style, i) => (
          <div
            key={i}
            className="absolute animate-leaf-fall opacity-20"
            style={{
              left: style.left,
              animationDelay: style.delay,
              animationDuration: style.duration,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[hsl(88,92%,50%)]/20 blur-sm" />
          </div>
        ))}
      </div>

      <div className="relative z-10 mb-8 transition-transform duration-500 scale-100">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={250} 
          height={250}
          className="object-contain"
          priority
        />
      </div>

      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,45%)] to-[hsl(88,92%,40%)] animate-progress" />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function SkeletonLoading() {
  return (
    <div className="flex items-center justify-center gap-4 p-8">
      <div className="relative w-12 h-12 flex-shrink-0 animate-pulse">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={48} 
          height={48}
          className="object-contain"
        />
      </div>
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,40%)] animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,45%)] animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,50%)] animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}