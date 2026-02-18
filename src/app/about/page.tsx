
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';

// Use dynamic imports for client-heavy components to improve TTI and bundle size
const HeroSection = dynamic(() => import('@/components/about/HeroSection'), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-white pt-32 px-4"><Skeleton className="h-96 w-full rounded-3xl" /></div>
});

const WhoWeAreSection = dynamic(() => import('@/components/about/WhoWeAreSection'), {
  ssr: true,
  loading: () => <div className="py-28 px-4"><Skeleton className="h-screen w-full rounded-3xl" /></div>
});

const MissionSection = dynamic(() => import('@/components/about/MissionSection'), {
  ssr: true,
  loading: () => <div className="py-28 px-4"><Skeleton className="h-96 w-full rounded-3xl" /></div>
});

const VisionSection = dynamic(() => import('@/components/about/VisionSection'), {
  ssr: true,
  loading: () => <div className="py-28 px-4"><Skeleton className="h-screen w-full rounded-3xl" /></div>
});

const ValuesSection = dynamic(() => import('@/components/about/ValuesSection'), {
  ssr: true,
  loading: () => <div className="py-28 px-4"><Skeleton className="h-96 w-full rounded-3xl" /></div>
});

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <Header />
      <main className="flex-grow relative z-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <HeroSection />
          <WhoWeAreSection />
          <MissionSection />
          <VisionSection />
          <ValuesSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
