
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';
import SplitText from '@/components/ui/split-text';
import { NewHeroButton } from '@/components/ui/NewHeroButton';

// Define a type for our hero media. This makes it flexible.
type HeroMedia = {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  imageHint: string;
  // Optional poster for videos for faster initial load
  poster?: string;
};

// This data would typically come from a CMS or a database.
// For this example, we'll define it here.
const heroSlides: HeroMedia[] = [
  {
    id: 'slide-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1704960961278-a0376a031054?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Lush avocado farm with sun shining through the leaves',
    imageHint: 'avocado farm'
  },
  {
    id: 'slide-2',
    type: 'image',
    url: 'https://thinkavocado.com/wp-content/uploads/2021/03/checking-avocado-by-hand-ss220621-1080x630.jpg',
    alt: 'Close-up of ripe avocados being inspected by hand',
    imageHint: 'avocado inspection'
  },
  {
    id: 'slide-3',
    type: 'image',
    url: 'https://www.capitalfm.co.ke/news/files/2022/03/Kakuzi-avocado-packhouse-683x1024.jpg',
    alt: 'Farmers sorting avocados at a facility',
    imageHint: 'avocado sorting'
  }
];

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <Carousel
        className="absolute inset-0 w-full h-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="w-full h-full relative">
                {slide.type === 'video' ? (
                  <video
                    src={slide.url}
                    poster={slide.poster}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={slide.url}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0} // Prioritize loading the first image
                    data-ai-hint={slide.imageHint}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
      </Carousel>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-4xl md:text-6xl lg:text-[86px] font-headline font-bold leading-tight flex flex-wrap justify-center gap-x-2 sm:gap-x-4">
              <SplitText
                tag="span"
                text="Pure"
                splitType="chars"
              />
              <SplitText
                tag="span"
                text="Avocado"
                className="text-brand"
                splitType="chars"
              />
              <SplitText
                tag="span"
                text="Experience"
                splitType="chars"
              />
            </h1>
            <SplitText
              tag="p"
              text="From our sun-kissed groves to your table, experience the rich taste and superior quality of our hand-picked avocados."
              className="mt-4 max-w-4xl font-prose text-lg md:text-xl lg:text-2xl tracking-wide"
               splitType="words"
               delay={20}
            />
            <div className="mt-8">
                <NewHeroButton href="/contact" label="Request a Quote" />
            </div>
        </div>
      </div>
    </section>
  );
}
