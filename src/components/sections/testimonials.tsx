
'use client';

import React from 'react';
import { cn } from "@/lib/utils"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

type ClientTestimonial = {
    id: string;
    author: string;
    company: string;
    reviewText: string;
    status: 'active' | 'not active';
};

const TestimonialSkeleton = () => (
    <div className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "max-w-[320px] sm:max-w-[320px]",
    )}>
        <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
        <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    </div>
);


export default function Testimonials() {
  const firestore = useFirestore();

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'clientTestimonials'), where('status', '==', 'active'));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<ClientTestimonial>(testimonialsQuery);

  const mappedTestimonials = testimonials?.map(t => ({
      author: {
          name: t.author,
          handle: `@${t.company.replace(/\s+/g, '')}`,
          avatar: `https://avatar.vercel.sh/${t.author.replace(/\s+/g, '')}.png`
      },
      text: t.reviewText,
  })) || [];

  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0"
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-headline font-bold leading-tight sm:text-5xl sm:leading-tight">
            Trusted By Partners Worldwide
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Our commitment to quality and reliability has earned us the trust of businesses across the globe.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:60s]">
            {isLoading ? (
                <div className="flex shrink-0 justify-around [gap:var(--gap)] flex-row">
                    {Array.from({ length: 4 }).map((_, i) => <TestimonialSkeleton key={i} />)}
                </div>
            ) : mappedTestimonials.length > 0 ? (
                <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
                    {[...Array(4)].map((_, setIndex) => (
                        mappedTestimonials.map((testimonial, i) => (
                        <TestimonialCard 
                            key={`${setIndex}-${i}`}
                            {...testimonial}
                        />
                        ))
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Client testimonials will be featured here soon.</p>
                </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}
