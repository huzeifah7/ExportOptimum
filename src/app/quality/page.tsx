'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Linkedin, Twitter, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  twitter?: string;
};

const SkeletonCard = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
    <Skeleton className="h-5 w-2/3 rounded-lg" />
    <Skeleton className="h-4 w-1/2 rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
  </div>
);

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100 mb-5">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            data-ai-hint="person portrait"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,30%)]/10 to-[hsl(88,92%,30%)]/5 flex items-center justify-center">
            <Users className="w-16 h-16 text-[hsl(88,92%,30%)]/30" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Social Links — appear on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex gap-3">
            {member.linkedin && (
              <Link
                href={member.linkedin}
                target="_blank"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[hsl(88,92%,30%)] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            )}
            {member.twitter && (
              <Link
                href={member.twitter}
                target="_blank"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-[hsl(88,92%,30%)] transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Role badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[hsl(88,92%,30%)] text-xs font-bold rounded-lg tracking-wide uppercase">
            {member.role}
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-headline font-bold text-gray-900 leading-tight">
            {member.name}
          </h3>
          {(member.linkedin || member.twitter) && (
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[hsl(88,92%,30%)] transition-colors duration-300 flex-shrink-0 mt-0.5" />
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const teamMembersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);

  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  return (
    <>
      {isClient ? (
        <div className="flex min-h-screen flex-col bg-white">
          <Header />

          <main className="flex-grow">
            {/* Hero */}
            <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-b from-[hsl(88,92%,30%)]/5 to-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-3xl">
                  {/* Tag */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(88,92%,30%)]/10 text-[hsl(88,92%,30%)] rounded-full text-sm font-bold mb-6 border border-[hsl(88,92%,30%)]/20">
                    <Users className="w-4 h-4" />
                    The People Behind the Mission
                  </div>

                  {/* Headline */}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-gray-900 leading-tight mb-6">
                    Meet Our
                    <br />
                    <span className="text-[hsl(88,92%,30%)]">Leadership</span>
                  </h1>

                  {/* Subtext */}
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    The passionate individuals dedicated to bringing you the finest avocados from Morocco.
                  </p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Team Grid */}
            <section className="py-20 lg:py-28 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Loading State */}
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                )}

                {/* Members Grid */}
                {!isLoading && teamMembers && teamMembers.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                    {teamMembers.map((member, index) => (
                      <TeamCard key={member.id} member={member} index={index} />
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && (!teamMembers || teamMembers.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-24 h-24 rounded-full bg-[hsl(88,92%,30%)]/10 flex items-center justify-center mb-6">
                      <Users className="w-12 h-12 text-[hsl(88,92%,30%)]" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold text-gray-900 mb-3">
                      Our Team is Growing!
                    </h3>
                    <p className="text-gray-600 max-w-sm leading-relaxed">
                      Information about our dedicated team members will be available here soon.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Bottom CTA Strip */}
            <section className="py-16 bg-gradient-to-br from-[hsl(88,92%,30%)] to-[hsl(88,92%,22%)]">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-headline font-bold text-white mb-2">
                      Want to join our team?
                    </h2>
                    <p className="text-white/80 text-lg">
                      We're always looking for passionate people to grow with us.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-[hsl(88,92%,30%)] font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg shadow-xl"
                  >
                    Get in Touch
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      ) : (
        /* SSR Fallback */
        <div className="flex min-h-screen flex-col bg-white">
          <Header />
          <main className="flex-grow">
            <section className="pt-28 pb-16 bg-gradient-to-b from-[hsl(88,92%,30%)]/5 to-white">
              <div className="container mx-auto px-4 max-w-7xl">
                <Skeleton className="h-12 w-72 rounded-xl mb-4" />
                <Skeleton className="h-6 w-96 rounded-lg" />
              </div>
            </section>
            <section className="py-20">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}