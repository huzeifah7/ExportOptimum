
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * SmoothScroll component initializes Lenis for momentum-based scrolling.
 * This provides a more fluid, high-end feel to the website navigation.
 * It is disabled for admin routes to prevent conflicts with internal dashboard scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth scroll on admin panel to avoid conflicts with 
    // fixed-height dashboard layouts and internal scrolling containers.
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // Cleanup on unmount or route change
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
