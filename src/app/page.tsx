
'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import ModernHero from '@/components/sections/ModernHero';
import KeyFigures from '@/components/sections/key-figures';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for components below the fold to improve TTI and TBT
const About = dynamic(() => import('@/components/sections/about'), { ssr: true });
const Quality = dynamic(() => import('@/components/sections/quality'), { ssr: true });
const Products = dynamic(() => import('@/components/sections/products'), { ssr: true });
const Ceo = dynamic(() => import('@/components/sections/ceo'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), { ssr: false });
const Blog = dynamic(() => import('@/components/sections/blog'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/footer'), { ssr: true });

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {isClient ? <Header /> : <div className="h-[60px] bg-background border-b border-border/10" />}
      <main className="flex-grow">
        <ModernHero />
        <KeyFigures />
        
        <Suspense fallback={<div className="py-20 container mx-auto px-4"><Skeleton className="h-96 w-full rounded-3xl" /></div>}>
          <About />
          <Quality />
          <Products />
          <Ceo />
          <Testimonials />
          <Blog />
        </Suspense>
      </main>
      {isClient && <Footer />}
    </div>
  );
}
