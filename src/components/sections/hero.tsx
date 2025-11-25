'use client';
import { Award, Ship, Users, Globe } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import React from 'react';

const heroSlides: (ImagePlaceholder & { type?: 'image' | 'video' })[] = [
  { id: 'hero-slide-1', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1762904495307-e5e6afe29cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YXZvY2FkbyUyMGZhcm18ZW58MHx8fHwxNzYzNzI0OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Lush avocado farm with sun shining through the leaves', imageHint: 'avocado farm' },
  { id: 'hero-slide-2', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1519996529648-28948d353f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwZ3JvdmV8ZW58MHx8fHwxNzYzOTk3MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Close-up of ripe avocados hanging from a tree', imageHint: 'avocado tree' },
  { id: 'hero-video-1', type: 'video', videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4', imageUrl: 'https://images.unsplash.com/photo-1554139681-ae4844fd51b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzbG93JTIwbW90aW9uJTIwYXZvY2Fkb3xlbnwwfHx8fDE3NjM5OTcwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'A slow motion video of avocados being washed', imageHint: 'avocado video' }
];

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative w-full h-[85vh] text-white overflow-hidden">
      <Carousel
        className="absolute inset-0 w-full h-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              {slide.type === 'video' ? (
                <video
                  src={slide.videoUrl}
                  poster={slide.imageUrl}
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
                  src={slide.imageUrl}
                  alt={slide.description}
                  fill
                  className="object-cover"
                  priority={slide.id === 'hero-slide-1'}
                  data-ai-hint={slide.imageHint}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:border-white" />
      </Carousel>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className=" flex-grow flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl lg:text-[86px] font-headline font-bold leading-tight">
            Premium Moroccan Avocados
            </h1>
            <p className="mt-4 max-w-4xl text-lg md:text-xl lg:text-2xl font-subtitle tracking-wide text-2xl md:text-3xl lg:text-4xl">
            From our sun-kissed groves to your table, experience the rich taste and superior quality of our hand-picked avocados.
            </p>
            <div className="mt-8">
                <Link href="/contact">
                    <Button size="lg">Request a Quote</Button>
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
