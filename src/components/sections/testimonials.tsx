
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ClientTestimonial = {
  id: string;
  author: string;
  company: string;
  role: string;
  reviewText: string;
  photoUrl?: string;
  status: 'active' | 'not active';
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const TestimonialCardSkeleton = () => (
  <div className="rounded-2xl border border-border/20 bg-card p-5 space-y-3">
    <Skeleton className="h-2.5 w-3/4 rounded-full" />
    <Skeleton className="h-2.5 w-full rounded-full" />
    <Skeleton className="h-2.5 w-4/5 rounded-full" />
    <div className="flex items-center gap-2 pt-3 border-t border-border/20">
      <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-2.5 w-20 rounded-full" />
        <Skeleton className="h-2 w-28 rounded-full" />
      </div>
    </div>
  </div>
);

// ─── Small Card (list) ────────────────────────────────────────────────────────
const TestimonialCard = ({
  review,
  isActive,
  onClick,
  index,
}: {
  review: ClientTestimonial;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
  const initials = review.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200
        ${isActive
          ? 'border-primary/30 bg-primary/5 shadow-sm'
          : 'border-border/20 bg-card hover:border-primary/20 hover:bg-primary/[0.03]'
        }`}
    >
      {/* Active left bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary transition-opacity duration-200
          ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />

      <blockquote className="text-xs leading-relaxed text-foreground/60 line-clamp-3 mb-4 pl-2 font-light">
        {review.reviewText}
      </blockquote>

      <figcaption className="flex items-center gap-2 pl-2">
        <Avatar className="h-7 w-7 ring-1 ring-border/10">
          <AvatarImage src={review.photoUrl} className="object-cover" />
          <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-foreground truncate">{review.author}</div>
          <div className="text-[10px] text-primary font-bold uppercase tracking-wider truncate">
            {review.company}
          </div>
        </div>
      </figcaption>
    </motion.article>
  );
};

// ─── Detail Panel ─────────────────────────────────────────────────────────────
const DetailPanel = ({ review }: { review: ClientTestimonial }) => {
  const initials = review.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col justify-between h-full rounded-2xl border border-primary/20 bg-primary/5 p-8 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Decorative quote */}
      <span
        className="absolute top-4 right-6 text-8xl font-serif leading-none text-primary/10 select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <blockquote className="relative text-lg md:text-xl font-light leading-relaxed text-foreground/80 italic">
        {review.reviewText}
      </blockquote>

      <figcaption className="relative flex items-center gap-4 mt-8 pt-6 border-t border-primary/15">
        <Avatar className="h-14 w-14 border-2 border-white shadow-lg ring-1 ring-primary/10">
          <AvatarImage src={review.photoUrl} className="object-cover" />
          <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground shadow-md">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-base font-bold text-foreground">{review.author}</div>
          <div className="text-xs text-primary font-black uppercase tracking-widest">
            {review.role}{review.role && review.company ? ', ' : ''}{review.company}
          </div>
        </div>
      </figcaption>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Testimonials() {
  const firestore = useFirestore();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'clientTestimonials'),
      where('status', '==', 'active')
    );
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<ClientTestimonial>(testimonialsQuery);

  const startAutoplay = (length: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % length);
    }, 5000);
  };

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    startAutoplay(testimonials.length);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [testimonials]);

  const handleCardClick = (idx: number) => {
    setActiveIndex(idx);
    if (testimonials) startAutoplay(testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">Client Voices</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-black text-foreground leading-tight tracking-tight">
              Trusted by Industry Leaders
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed sm:text-right font-light">
            Insights from our global partners on the quality and dedication that defines Export Optimum.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2 space-y-3">
              {[...Array(4)].map((_, i) => <TestimonialCardSkeleton key={i} />)}
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && testimonials && testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start"
          >
            {/* Left: scrollable card list */}
            <div className="lg:col-span-2 space-y-3">
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  review={t}
                  index={i}
                  isActive={activeIndex === i}
                  onClick={() => handleCardClick(i)}
                />
              ))}
            </div>

            {/* Right: expanded detail */}
            <div className="lg:col-span-3 lg:sticky lg:top-8 flex flex-col gap-4">
              <AnimatePresence mode="wait">
                <DetailPanel
                  key={testimonials[activeIndex]?.id}
                  review={testimonials[activeIndex]}
                />
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 justify-end px-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleCardClick(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="h-1 rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      width: activeIndex === i ? '20px' : '5px',
                      backgroundColor:
                        activeIndex === i
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--primary) / 0.2)',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && (!testimonials || testimonials.length === 0) && (
          <div className="text-center py-16 opacity-50 italic">
            <p className="text-sm text-muted-foreground">Quality insights from our partners are arriving soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
