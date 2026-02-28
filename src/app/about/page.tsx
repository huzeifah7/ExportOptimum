import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FullPageLoading } from '@/components/ui/loading';

// Use dynamic imports for client-heavy components to improve TTI and bundle size
const HeroSection = dynamic(() => import('@/components/about/HeroSection'), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-white" />
});

const WhoWeAreSection = dynamic(() => import('@/components/about/WhoWeAreSection'), {
  ssr: true,
  loading: () => <div className="py-28" />
});

const MissionSection = dynamic(() => import('@/components/about/MissionSection'), {
  ssr: true,
  loading: () => <div className="py-28" />
});

const VisionSection = dynamic(() => import('@/components/about/VisionSection'), {
  ssr: true,
  loading: () => <div className="py-28" />
});

const ValuesSection = dynamic(() => import('@/components/about/ValuesSection'), {
  ssr: true,
  loading: () => <div className="py-28" />
});

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <Header />
      <main className="flex-grow relative z-10">
        <Suspense fallback={<FullPageLoading />}>
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
