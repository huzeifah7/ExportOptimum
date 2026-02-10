
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Quote } from 'lucide-react';

type ClientTestimonial = {
  id: string;
  author: string;
  company: string;
  role: string;
  reviewText: string;
  status: 'active' | 'not active';
};

const placeholderAvatars = PlaceHolderImages.filter(p => p.id.startsWith('client-')).map(p => p.imageUrl);

const TestimonialCardSkeleton = () => (
  <div className="bg-background/50 border border-border/20 rounded-2xl p-8 space-y-4">
    <Skeleton className="h-6 w-12" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="flex items-center gap-4 pt-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ review, avatarUrl }: { review: ClientTestimonial; avatarUrl: string }) => {
  return (
    <motion.div
      className="bg-background/50 border border-border/20 rounded-2xl p-8 flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      <Quote className="w-8 h-8 text-primary/50 mb-4" />
      <blockquote className="text-foreground/80 italic flex-grow">
        “{review.reviewText}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-primary/20">
          <AvatarImage src={avatarUrl} alt={review.author} />
          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-base font-bold text-foreground">{review.author}</div>
          <div className="text-sm text-muted-foreground">{review.role}, {review.company}</div>
        </div>
      </figcaption>
    </motion.div>
  );
};

export default function Testimonials() {
  const firestore = useFirestore();

  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'clientTestimonials'),
      where('status', '==', 'active')
    );
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<ClientTestimonial>(testimonialsQuery);

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {isLoading && (
            <>
              <TestimonialCardSkeleton />
              <TestimonialCardSkeleton />
            </>
          )}
          {!isLoading && testimonials?.length ? (
            testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.id}
                review={testimonial}
                avatarUrl={placeholderAvatars[i % placeholderAvatars.length]}
              />
            ))
          ) : null}
        </motion.div>
        
        {!isLoading && !testimonials?.length && (
            <div className="text-center text-muted-foreground py-12">
                <p>Client testimonials will be shared here soon.</p>
            </div>
        )}
      </div>
    </section>
  );
}
