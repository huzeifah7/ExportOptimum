
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Leaf, Recycle, Sun, Droplets, Wind, Globe, Loader2 } from 'lucide-react';
import DomeGallery from '@/components/ui/dome-gallery';
import SplitText from '@/components/ui/split-text';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';


const keyInitiatives = [
  {
    icon: <Droplets className="w-10 h-10 text-primary" />,
    title: 'Water Conservation',
    description: 'Implementing state-of-the-art drip irrigation systems across all our groves to minimize water usage while maximizing crop health and yield. We recycle water wherever possible.',
  },
  {
    icon: <Sun className="w-10 h-10 text-primary" />,
    title: 'Renewable Energy',
    description: 'Our packing facilities and farm operations are increasingly powered by solar energy, drastically reducing our carbon footprint and our dependency on fossil fuels.',
  },
  {
    icon: <Recycle className="w-10 h-10 text-primary" />,
    title: 'Waste Reduction & Composting',
    description: 'We practice comprehensive composting of all organic waste, returning valuable nutrients to the soil. Our packaging is designed to be minimal and recyclable.',
  },
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: 'Soil Health & Biodiversity',
    description: 'Through crop rotation, cover crops, and avoiding chemical fertilizers, we enrich our soil naturally. This promotes a healthy microbiome and supports local biodiversity.',
  },
  {
    icon: <Wind className="w-10 h-10 text-primary" />,
    title: 'Carbon Sequestration',
    description: 'Our avocado groves act as significant carbon sinks. We are actively planting more trees and employing regenerative agriculture techniques to maximize CO2 capture.',
  },
  {
    icon: <Globe className="w-10 h-10 text-primary" />,
    title: 'Ethical Supply Chain',
    description: 'Sustainability extends to our people. We ensure fair labor practices, invest in our local communities, and maintain full transparency throughout our supply chain.',
  },
];

type SustainabilityImage = {
  id: string;
  src: string;
  alt: string;
};


export default function SustainabilityPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sustainabilityGallery'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: images, isLoading } = useCollection<SustainabilityImage>(galleryQuery);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] text-foreground flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
             <h1 className="text-4xl md:text-6xl lg:text-[86px] font-headline font-bold leading-tight flex flex-wrap justify-center gap-x-2 sm:gap-x-4">
              <SplitText
                tag="span"
                text="Cultivating"
                splitType="chars"
              />
              <SplitText
                tag="span"
                text="a"
                className="text-brand"
                splitType="chars"
              />
              <SplitText
                tag="span"
                text="Greener"
                splitType="chars"
              />
               <SplitText
                tag="span"
                text="Tomorrow"
                splitType="chars"
              />
            </h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">
              Our commitment to the planet is as deep as our roots in Moroccan soil.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Our Philosophy: Harmony with Nature</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        For us, sustainability isn't a department; it's our entire business model. We believe that the highest quality produce can only come from a healthy, thriving ecosystem. It is our fundamental responsibility to be stewards of the land we cultivate, ensuring it remains fertile and vibrant for generations of farmers to come. This philosophy guides every decision we make—from water management and energy use to community engagement and packaging choices.
                    </p>
                </div>
            </div>
        </section>

        {/* Key Initiatives Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Key Initiatives</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                We are actively implementing practices that nurture our planet and our communities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyInitiatives.map((initiative) => (
                <div key={initiative.title} className="bg-background p-8 rounded-lg shadow-lg text-center flex flex-col items-center border border-transparent hover:border-primary hover:-translate-y-2 transition-all duration-300">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mb-4">
                    {initiative.icon}
                  </div>
                  <h3 className="mt-2 text-xl font-bold font-headline">{initiative.title}</h3>
                  <p className="mt-2 text-muted-foreground flex-grow">{initiative.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold">A Glimpse Into Our World</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Explore scenes from our groves, our facilities, and our community.
                    </p>
                </div>
                {(isLoading || !isClient) && (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}
                {isClient && !isLoading && images && images.length > 0 && (
                    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
                        <DomeGallery images={images} overlayBlurColor="transparent" grayscale={false} />
                    </div>
                )}
                {isClient && !isLoading && (!images || images.length === 0) && (
                    <div className="text-center py-20 text-muted-foreground">
                        <h3 className="text-2xl font-headline">Gallery Coming Soon</h3>
                        <p>Check back to see glimpses of our sustainable practices in action.</p>
                    </div>
                )}
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
