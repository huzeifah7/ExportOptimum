
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Quote } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


type ClientTestimonial = {
  id: string;
  author: string;
  company: string;
  role: string;
  reviewText: string;
  status: 'active' | 'not active';
};

const TestimonialCardSkeleton = () => (
  <div className="bg-card border border-border/20 rounded-2xl p-8 space-y-4 h-full">
    <Skeleton className="h-10 w-10" />
    <div className="space-y-3 flex-grow">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="border-t border-border/20 pt-6 space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-36" />
    </div>
  </div>
);

const TestimonialCard = ({ review }: { review: ClientTestimonial }) => {
  return (
    <div className="bg-background rounded-2xl p-8 shadow-lg border border-border/10 flex flex-col h-full">
      <Quote className="w-10 h-10 text-primary/80 mb-6" />
      <blockquote className="text-foreground/80 text-base leading-relaxed flex-grow">
        {review.reviewText}
      </blockquote>
      <figcaption className="mt-8 pt-6 border-t border-border/20">
        <div className="text-lg font-bold text-foreground">{review.author}</div>
        <div className="text-sm text-primary font-semibold">
          {review.role}{review.role && review.company ? ', ' : ''}{review.company}
        </div>
      </figcaption>
    </div>
  );
};


export default function Testimonials() {
  const firestore = useFirestore();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'clientTestimonials'),
      where('status', '==', 'active')
    );
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<ClientTestimonial>(testimonialsQuery);

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Trusted by Teams Worldwide
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Hear what our partners have to say about the quality, reliability, and service that defines Export Optimum.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <TestimonialCardSkeleton />
            <TestimonialCardSkeleton />
            <TestimonialCardSkeleton />
            <TestimonialCardSkeleton />
          </div>
        )}

        {!isLoading && testimonials && testimonials.length > 0 && (
           <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-7xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                    <div className="p-1 h-full">
                        <TestimonialCard review={testimonial} />
                    </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        )}
        
        {!isLoading && (!testimonials || testimonials.length === 0) && (
            <div className="text-center text-muted-foreground py-12">
                <p>Client testimonials will be shared here soon.</p>
            </div>
        )}
      </div>
    </section>
  );
}
