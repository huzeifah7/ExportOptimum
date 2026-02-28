'use client';

import React from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════
   OPTION 1: Pulsing Logo with Rotating Leaves
   Best for: Elegant, organic feel
═══════════════════════════════════════════════════════════════ */

export function ExportOptimumLoading({ variant = 'pulse' }: { variant?: 'pulse' | 'spin' | 'breathe' | 'minimal' }) {
  
  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent">
        {/* Logo with pulse */}
        <div className="relative">
          <div className="animate-pulse-slow">
            <Image 
              src="/EOLogo.png" 
              alt="Export Optimum" 
              width={160} 
              height={160}
              className="object-contain"
            />
          </div>
          
          {/* Orbiting leaf indicators */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(88,92%,40%)] shadow-[0_0_10px_hsl(88,92%,40%)]" />
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(88,92%,50%)] shadow-[0_0_10px_hsl(88,92%,50%)]" />
          </div>
        </div>
        
        {/* Loading text */}
        <p className="mt-8 text-sm font-bold tracking-widest uppercase text-primary/60 animate-pulse">
          Loading Quality...
        </p>

        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.98); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'spin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent">
        {/* Spinning logo */}
        <div className="relative mb-8">
          <div className="animate-spin-gentle">
            <Image 
              src="/EOLogo.png" 
              alt="Export Optimum" 
              width={140} 
              height={140}
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] animate-progress" />
        </div>

        <style jsx>{`
          @keyframes spin-gentle {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-spin-gentle {
            animation: spin-gentle 4s linear infinite;
          }
          .animate-progress {
            animation: progress 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'breathe') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[hsl(88,92%,50%)]/5 animate-breathe" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[hsl(88,92%,50%)]/5 animate-breathe" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 animate-float">
          <Image 
            src="/EOLogo.png" 
            alt="Export Optimum" 
            width={150} 
            height={150}
            className="object-contain"
          />
        </div>

        {/* Three dot loader */}
        <div className="mt-8 flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,40%)] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,45%)] animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,50%)] animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        <style jsx>{`
          @keyframes breathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-breathe {
            animation: breathe 3s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Minimal variant (default)
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent">
      {/* Minimal spinner ring around logo */}
      <div className="relative">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={120} 
          height={120}
          className="object-contain"
        />
        
        {/* Spinner ring */}
        <svg className="absolute inset-0 -m-3 w-[144px] h-[144px] animate-spin-slow" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient-minimal)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="160 100"
          />
          <defs>
            <linearGradient id="gradient-minimal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(88,92%,50%)" />
              <stop offset="100%" stopColor="hsl(88,92%,30%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OPTION 2: Full Page Loading with Leaf Animation
   Best for: Page transitions, initial load
═══════════════════════════════════════════════════════════════ */

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Animated leaves background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-leaf-fall opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[hsl(88,92%,50%)]/20 blur-md" />
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-10 animate-scale-in">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={220} 
          height={220}
          className="object-contain"
          priority
        />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,45%)] to-[hsl(88,92%,40%)] animate-progress-bar" />
      </div>

      {/* Loading text */}
      <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-[hsl(88,92%,25%)]/60 animate-pulse text-center">
        Preparing Freshness
      </p>

      <style jsx>{`
        @keyframes leaf-fall {
          0% { transform: translateY(-100px) rotate(0deg) scale(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(360deg) scale(1); opacity: 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-leaf-fall {
          animation: leaf-fall 5s linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .animate-progress-bar {
          animation: progress-bar 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OPTION 3: Skeleton Loading with Logo
   Best for: Content loading states
═══════════════════════════════════════════════════════════════ */

export function SkeletonLoading() {
  return (
    <div className="flex items-center justify-center gap-5 p-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
      {/* Small logo */}
      <div className="relative w-14 h-14 flex-shrink-0 animate-pulse">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={56} 
          height={56}
          className="object-contain opacity-40 grayscale"
        />
      </div>
      
      {/* Loading dots */}
      <div className="flex gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,40%)] animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,45%)] animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(88,92%,50%)] animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}
