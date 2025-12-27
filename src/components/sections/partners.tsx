
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Marquee from '@/components/ui/marquee';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
};

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

const PartnerSkeleton = () => (
    <div className="mx-8 flex h-24 w-48 items-center justify-center">
        <Skeleton className="h-16 w-32" />
    </div>
);

export default function Partners() {
  const firestore = useFirestore();

  const partnersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'partners');
  }, [firestore]);

  const { data: partners, isLoading } = useCollection<Partner>(partnersQuery);

  const PartnerLogo = ({ partner }: { partner: Partner }) => {
    const content = (
        <div
          key={partner.id}
          className="group mx-8 flex h-24 w-48 items-center justify-center transition-opacity"
        >
          <Image
            src={partner.logoUrl}
            alt={partner.name}
            width={120}
            height={50}
            className="object-contain transition-all duration-300 opacity-60 group-hover:opacity-100"
          />
        </div>
    );

    if (partner.websiteUrl) {
        return (
            <Link href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                {content}
            </Link>
        )
    }
    return content;
  }

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

          {isLoading && (
              <div className="flex justify-center">
                  <div className="flex flex-nowrap">
                      {Array.from({ length: 6 }).map((_, i) => <PartnerSkeleton key={i} />)}
                  </div>
              </div>
          )}

          {!isLoading && partners && partners.length > 0 && (
            <Marquee pauseOnHover className="[--duration:40s]">
                {partners.map((partner) => (
                    <PartnerLogo key={partner.id} partner={partner} />
                ))}
            </Marquee>
          )}

          {!isLoading && (!partners || partners.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
                <p>Our partners will be showcased here soon.</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
