
'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Testimonials from '@/components/sections/testimonials';
import Blog from '@/components/sections/blog';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';
import About from '@/components/sections/about';
import Products from '@/components/sections/products';
import Ceo from '@/components/sections/ceo';
import KeyFigures from '@/components/sections/key-figures';
import ModernHero from '@/components/sections/ModernHero';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {isClient ? <Header /> : <div className="h-[60px]"><Skeleton className="h-full w-full" /></div>}
      <main className="flex-grow">
        {isClient ? (
          <>
            <ModernHero />
            <KeyFigures />
            <About />
            <Quality />
            <Products />
            <Ceo />
            <Testimonials />
            <Blog />
          </>
        ) : (
          <div className="space-y-8">
            <Skeleton className="h-screen w-full" />
            <div className="container mx-auto px-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full mt-8" />
            </div>
          </div>
        )}
      </main>
      {isClient && <Footer />}
    </div>
  );
}
