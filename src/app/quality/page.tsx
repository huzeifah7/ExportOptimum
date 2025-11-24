'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';
import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const certifications = [
  { id: 'cert-smeta', name: 'SMETA' },
  { id: 'cert-grasp', name: 'GRASP' },
  { id: 'cert-bio', name: 'Bio' },
  { id: 'cert-spring', name: 'Spring' },
  { id: 'cert-brc-food', name: 'BRC Food' },
  { id: 'cert-global-gap', name: 'Global G.A.P.' },
];

export default function QualityPage() {
  const certImages = certifications.map(cert => {
    const image = PlaceHolderImages.find(p => p.id === cert.id);
    return { ...cert, image };
  });
  
  const allCerts = [...certImages, ...certImages];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Quality />
        <section id="certifications" className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Certifications</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-[36px] tracking-wide">
                Our commitment to excellence is certified and guaranteed, from farm to port.
              </p>
            </div>
            <div className="relative w-full overflow-hidden group">
              <div className="flex w-fit animate-marquee group-hover:[animation-play-state:paused]">
                {allCerts.map((cert, index) => (
                  <div key={index} className="flex-shrink-0 w-64 px-4">
                    <div className="p-1 h-full">
                      <div className="flex flex-col items-center text-center p-6 rounded-lg h-full">
                        {cert.image && (
                           <Image
                            src={cert.image.imageUrl}
                            alt={cert.image.description}
                            width={128}
                            height={128}
                            className="object-contain"
                            data-ai-hint={cert.image.imageHint}
                          />
                        )}
                        <h3 className="mt-4 text-xl font-bold font-headline">{cert.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
