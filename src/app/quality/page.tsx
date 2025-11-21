'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Quality from '@/components/sections/quality';
import { BadgeCheck, Leaf, ShieldCheck } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

const certifications = [
  { name: 'GlobalG.A.P. Certified', icon: <BadgeCheck className="w-12 h-12 text-accent" />, description: 'Ensuring safe and sustainable farming practices.' },
  { name: 'Organic Farming', icon: <Leaf className="w-12 h-12 text-accent" />, description: 'Grown naturally without synthetic pesticides or fertilizers.' },
  { name: 'Quality Assured', icon: <ShieldCheck className="w-12 h-12 text-accent" />, description: 'Each avocado is hand-inspected for perfection.' },
];

export default function QualityPage() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Quality />
        <section id="certifications" className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Certifications</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Our commitment to excellence is certified and guaranteed, from farm to port.
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto"
            >
              <CarouselContent>
                {certifications.map((cert, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-background transition-colors duration-300 h-full">
                        {cert.icon}
                        <h3 className="mt-4 text-xl font-bold font-headline">{cert.name}</h3>
                        <p className="mt-2 text-muted-foreground flex-grow">{cert.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
