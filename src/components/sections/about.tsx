'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function About() {
  return (
    <motion.section
      id="about"
      className="py-20 lg:py-32 bg-gray-50/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl shadow-xl overflow-hidden group">
          <div className="absolute inset-0 w-full h-full z-20 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/40 lg:to-transparent/20"></div>
          <motion.div 
              className="absolute inset-0 w-full h-full z-10"
              variants={itemVariants}
          >
            <Image
                src="https://images.unsplash.com/photo-1543363136-7fbfcd3b240d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Fresh avocados on a wooden surface"
                fill
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="avocados wood"
            />
          </motion.div>
          
          <div className="relative z-30 grid lg:grid-cols-5 items-center min-h-[350px]">
            <motion.div 
                className="lg:col-span-3 p-8 md:p-12 lg:p-16 text-primary-foreground"
                variants={itemVariants}
            >
                <Badge variant="secondary" className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">Our Story</Badge>
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                    Discover our fruits journey from pit to plate
                </h2>
                <p className="mt-4 text-base text-primary-foreground/80 max-w-lg">
                    Explore our commitment to sustainability and discover how we are making a positive impact on the environment and communities.
                </p>
                <Button asChild variant="link" className="mt-6 p-0 text-primary-foreground font-semibold text-lg hover:text-primary-foreground/80 transition-colors group/link">
                    <Link href="/about">
                        Learn more <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
