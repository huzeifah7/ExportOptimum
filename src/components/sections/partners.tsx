
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Marquee from '@/components/ui/marquee';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const partnerIds = [
  'cert-smeta', 
  'cert-grasp', 
  'cert-bio', 
  'cert-spring', 
  'cert-global-gap',
  'cert-brc-food',
];

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

export default function Partners() {
  const partners = partnerIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <motion.section
      id="partners"
      className="py-20 lg:py-32 bg-gray-50/50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Our Trusted Partners
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We proudly collaborate with leading organizations and certification bodies worldwide.
          </p>
        </motion.div>

        <div className="relative">
          {/* Fading edges for a seamless look */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none" />

          <Marquee pauseOnHover className="[--duration:60s]">
            {partners.map((partner) => (
              partner && (
                <div
                  key={partner.id}
                  className="mx-8 flex h-24 w-48 items-center justify-center transition-opacity"
                >
                  <Image
                    src={partner.imageUrl}
                    alt={partner.description}
                    width={150}
                    height={60}
                    className="object-contain opacity-30 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    data-ai-hint={partner.imageHint}
                  />
                </div>
              )
            ))}
          </Marquee>
        </div>
      </div>
    </motion.section>
  );
}
