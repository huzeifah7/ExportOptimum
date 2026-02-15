
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModernHeroButton } from '../ui/ModernHeroButton';
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
    type: 'video',
    src: 'https://cdn.pixabay.com/video/2023/06/04/165313-833630654_large.mp4',
    poster: 'https://images.unsplash.com/photo-1520923642038-b42e5f14b772?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Drone footage flying over vast avocado orchards',
    headline: ['Rooted in', 'Sustainability,', 'Grown for Excellence.'],
    tagline: 'With exclusive access to major Moroccan farms, including two company-owned avocado farms, we oversee more than 500 hectares of avocado cultivation, delivering consistent quality at scale and ensuring full control over quality, sustainability, and season-round supply.',
    ctaLabel: 'Learn About Our Process',
    ctaHref: '/quality',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1611262529845-8c7f21207137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXB8ZW58MHx8fHwxNzY0MDk0ODU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'A large container ship on the ocean, representing global export',
    headline: ['Smart Logistics,', 'Total', 'Control'],
    tagline: 'From origin to destination. From harvesting to final delivery, our supply chain is designed to protect quality; and combined with advanced logistics, we ensure compliance, and deliver fresh produce on time, every time!',
    ctaLabel: 'Become a Partner',
    ctaHref: '/contact',
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
              <div className="modern-hero__slide-container">
                {slide.type === 'video' ? (
                  <video src={slide.src} poster={slide.poster} className="modern-hero__media" autoPlay loop muted playsInline />
                ) : (
                  <img src={slide.src} alt={slide.alt} className="modern-hero__media" />
                )}
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
                <span className={current === 0 ? "text-primary" : "modern-hero__headline--accent"}>
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
