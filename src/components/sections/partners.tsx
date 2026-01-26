'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Marquee from '@/components/ui/marquee';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const PartnerSkeleton = () => (
  <div className="mx-10 flex h-28 w-52 items-center justify-center">
    <Skeleton className="h-14 w-32" />
  </div>
);

export default function PartnersRedesign() {
  const firestore = useFirestore();

  const partnersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'partners');
  }, [firestore]);

  const { data: partners, isLoading } =
    useCollection<Partner>(partnersQuery);

  const PartnerLogo = ({ partner }: { partner: Partner }) => {
    const logo = (
      <div className="group mx-10 flex h-28 w-52 items-center justify-center">
        <Image
          src={partner.logoUrl}
          alt={partner.name}
          width={140}
          height={60}
          className="object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    );

    if (partner.websiteUrl) {
      return (
        <Link
          href={partner.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {logo}
        </Link>
      );
    }

    return logo;
  };

  return (
    <motion.section
      id="partners"
      className="py-24 lg:py-32 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-4 uppercase tracking-widest text-xs bg-primary/10 text-primary border-primary/20">
            Trusted Worldwide
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold">
            Partners & Certifications
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            We collaborate with international partners, exporters,
            and certification bodies that share our standards of
            quality, transparency, and reliability.
          </p>
        </motion.div>

        {/* MARQUEE CONTAINER */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl border border-border bg-background py-10 overflow-hidden"
        >
          {/* Gradient edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {isLoading && (
            <div className="flex justify-center">
              <div className="flex flex-nowrap">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PartnerSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && partners && partners.length > 0 && (
            <Marquee pauseOnHover className="[--duration:55s]">
              {partners.map(partner => (
                <PartnerLogo key={partner.id} partner={partner} />
              ))}
            </Marquee>
          )}

          {!isLoading && (!partners || partners.length === 0) && (
            <div className="text-center text-muted-foreground py-10">
              Trusted partners and certifications will appear here soon.
            </div>
          )}
        </motion.div>

      </div>
    </motion.section>
  );
}
