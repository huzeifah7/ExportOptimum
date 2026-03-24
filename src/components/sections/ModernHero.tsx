'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModernHeroButton } from '../ui/ModernHeroButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import './ModernHero.css';

const slides = [
  {
    type: 'image',
    src: '/BG.png',
    alt: 'Lush avocado orchard background',
    headline: ['Your trusted', 'partner', 'in fresh produce.'],
    tagline: 'Backed by more than a decade of expertise, we deliver the worlds finest fresh produce. carefully sourced, expertly handled, and globally supplied.',
    taglineHighlight: 'Avocados · Berries · Melons',
    ctaLabel: 'Request a Quote',
    ctaHref: '/contact',
  },
  {
    type: 'image',
    src: '/sust.avif',
    alt: 'Sustainability background representing Export Optimum excellence',
    headline: ['Rooted in', 'Sustainability,', 'Grown for Excellence.'],
    tagline: 'With exclusive access to major Moroccan farms, including two company-owned avocado farms, we oversee more than 500 hectares of avocado cultivation, delivering consistent quality at scale and ensuring full control over quality, sustainability, and season-round supply.',
    ctaLabel: 'Learn About Our Process',
    ctaHref: '/quality',
  },
  
];

const ModernHero = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="modern-hero__section">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="modern-hero__slide-container h-full">
                <Image 
                  src={slide.src} 
                  alt={slide.alt} 
                  fill 
                  className="modern-hero__media opacity-50"
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  {...(index === 0 ? { fetchPriority: "high" } : {})}
                  sizes="100vw"
                  quality={85}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="modern-hero__overlay" />

        <div className="modern-hero__content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="modern-hero__text-content"
            >
              <h1 className="modern-hero__headline">
                {slides[current].headline[0]}{' '}
                <span className={slides[current].headline[1] === 'partner' ? "text-primary" : "modern-hero__headline--accent"}>
                  {slides[current].headline[1]}
                </span>{' '}
                {slides[current].headline[2]}
              </h1>
              <p className="modern-hero__tagline">
                {slides[current].tagline}
                {(slides[current] as any).taglineHighlight && (
                  <span className="block mt-2 font-bold text-primary">
                    {(slides[current] as any).taglineHighlight}
                  </span>
                )}
              </p>
              <ModernHeroButton href={slides[current].ctaHref} label={slides[current].ctaLabel} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={() => api?.scrollPrev()} className="modern-hero__nav-arrow modern-hero__nav-arrow--left">
          <ChevronLeft />
        </button>
        <button onClick={() => api?.scrollNext()} className="modern-hero__nav-arrow modern-hero__nav-arrow--right">
          <ChevronRight />
        </button>
      </Carousel>
    </section>
  );
};

export default ModernHero;