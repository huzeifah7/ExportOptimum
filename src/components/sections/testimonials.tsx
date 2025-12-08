
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, MessageSquareQuote } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";

// --- Types & Interfaces ---

type Review = {
  id: string;
  author: string;
  company?: string;
  role?: string;
  reviewText: string;
  photoUrl?: string;
  rating?: number;
};

// --- Static Data ---
const staticReviews: Review[] = [
  {
    id: 'review-1',
    author: 'John Doe',
    company: 'Global Imports',
    role: 'CEO',
    reviewText: 'Export Optimum has consistently delivered exceptional quality. Their avocados are the best on the market, and their logistics are seamless.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjM2OTE5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
  },
  {
    id: 'review-2',
    author: 'Jane Smith',
    company: 'Fresh Produce B.V.',
    role: 'Head of Procurement, Netherlands',
    reviewText: 'Working with Export Optimum has been a game-changer. Their commitment to quality and traceability is unmatched. Highly recommended.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjM2OTE5NzZ8MA&ixlib.rb-4.1.0&q=80&w=1080',
    rating: 5,
  },
  {
    id: 'review-3',
    author: 'Samuel Lee',
    company: 'Grocer Fresh UK',
    role: 'Category Manager',
    reviewText: 'The reliability of their cold chain is impressive. Our customers have noticed the difference in freshness and quality. A truly professional partner.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjM2OTE5NzZ8MA&ixlib.rb-4.1.0&q=80&w=1080',
    rating: 4,
  },
    {
    id: 'review-4',
    author: 'Maria Garcia',
    company: 'Mercado Fresco',
    role: 'Owner, Spain',
    reviewText: 'Our customers love the creamy texture and rich flavor of the Hass avocados from Export Optimum. They are our go-to supplier for premium produce.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjM2OTE5NzZ8MA&ixlib.rb-4.1.0&q=80&w=1080',
    rating: 5,
  },
];


// --- Animation Variants ---

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};


// --- Helper Components ---

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 text-yellow-400">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${index < rating ? 'fill-current' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/50 bg-background/50 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg">
      <CardContent className="flex flex-1 flex-col p-8">
        <MessageSquareQuote className="mb-4 h-8 w-8 text-primary/50" />
        <p className="flex-grow text-base text-muted-foreground">
          "{review.reviewText}"
        </p>
        <div className="mt-6 flex items-center gap-4 border-t border-border/50 pt-6">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            {review.photoUrl && <AvatarImage src={review.photoUrl} alt={review.author} />}
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {review.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-bold text-foreground">{review.author}</h4>
            <p className="text-sm text-muted-foreground">{review.company || review.role}</p>
          </div>
          {review.rating && <StarRating rating={review.rating} />}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);


// --- Main Testimonials Component ---

export default function Testimonials() {
  const carouselPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  return (
    <motion.section
      id="testimonials"
      className="py-20 lg:py-32 bg-gray-50/50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Trusted By Partners Worldwide
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our commitment to quality and reliability has earned us the trust of businesses across the globe.
          </p>
        </motion.div>

        <Carousel
          opts={{ loop: true, align: 'start' }}
          plugins={[carouselPlugin.current]}
          onMouseEnter={carouselPlugin.current.stop}
          onMouseLeave={carouselPlugin.current.reset}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {staticReviews.map((review) => (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex -left-12" />
          <CarouselNext className="hidden sm:inline-flex -right-12" />
        </Carousel>

        {staticReviews.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16 text-muted-foreground">
                <h3 className="text-2xl font-headline">Building a Legacy of Trust</h3>
                <p>We are grateful for our partners and will feature their feedback here soon.</p>
            </motion.div>
        )}
      </div>
    </motion.section>
  );
}
