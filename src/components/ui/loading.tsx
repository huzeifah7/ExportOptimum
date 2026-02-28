'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════
   OPTION 1: Pulsing Logo with Rotating Leaves
   Best for: Elegant, organic feel
═══════════════════════════════════════════════════════════════ */

export function ExportOptimumLoading({ variant = 'pulse' }: { variant?: 'pulse' | 'spin' | 'breathe' | 'minimal' }) {
  
  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        {/* Logo with pulse */}
        <div className="relative">
          <div className="animate-pulse-slow">
            <Image 
              src="/EOLogo.png" 
              alt="Export Optimum" 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
          
          {/* Orbiting leaf indicators */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(88,92%,40%)]" />
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(88,92%,50%)]" />
          </div>
        </div>
        
        {/* Loading text */}
        <p className="mt-8 text-sm font-semibold text-gray-600 animate-pulse">
          Loading the finest produce...
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        {/* Spinning logo */}
        <div className="relative">
          <div className="animate-spin-gentle">
            <Image 
              src="/EOLogo.png" 
              alt="Export Optimum" 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[hsl(88,92%,50%)]/5 animate-breathe" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[hsl(88,92%,50%)]/5 animate-breathe" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 animate-float">
          <Image 
            src="/EOLogo.png" 
            alt="Export Optimum" 
            width={200} 
            height={200}
            className="object-contain"
          />
        </div>

        {/* Three dot loader */}
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(88,92%,40%)] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 rounded-full bg-[hsl(88,92%,45%)] animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 rounded-full bg-[hsl(88,92%,50%)] animate-bounce" style={{ animationDelay: '0.4s' }} />
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Minimal spinner ring around logo */}
      <div className="relative">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={200} 
          height={200}
          className="object-contain"
        />
        
        {/* Spinner ring */}
        <svg className="absolute inset-0 -m-4 w-[232px] h-[232px] animate-spin-slow" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="180 100"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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

interface LeafStyle {
  left: string;
  delay: string;
  duration: string;
}

export function FullPageLoading() {
  const [leafStyles, setLeafStyles] = useState<LeafStyle[]>([]);

  useEffect(() => {
    // Generate random styles only on the client to avoid hydration mismatch
    const styles = [...Array(6)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${i * 0.5}s`,
      duration: `${3 + Math.random() * 2}s`,
    }));
    setLeafStyles(styles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Animated leaves background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {leafStyles.map((style, i) => (
          <div
            key={i}
            className="absolute animate-leaf-fall"
            style={{
              left: style.left,
              animationDelay: style.delay,
              animationDuration: style.duration,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[hsl(88,92%,50%)]/10 blur-sm" />
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8 animate-scale-in">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={250} 
          height={250}
          className="object-contain"
        />
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,45%)] to-[hsl(88,92%,40%)] animate-progress-bar" />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-sm font-semibold text-gray-600 animate-pulse">
        Preparing your fresh experience...
      </p>

      <style jsx>{`
        @keyframes leaf-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-leaf-fall {
          animation: leaf-fall 4s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-progress-bar {
          animation: progress-bar 1.5s ease-in-out infinite;
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
    <div className="flex items-center justify-center gap-4 p-8">
      {/* Small logo */}
      <div className="relative w-12 h-12 flex-shrink-0 animate-pulse">
        <Image 
          src="/EOLogo.png" 
          alt="Export Optimum" 
          width={48} 
          height={48}
          className="object-contain"
        />
      </div>
      
      {/* Loading dots */}
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,40%)] animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,45%)] animate-bounce" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 rounded-full bg-[hsl(88,92%,50%)] animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}
