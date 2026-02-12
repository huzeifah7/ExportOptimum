
'use client';

import { useEffect, useState, memo } from 'react';
import { collection } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

import { Linkedin, Twitter, Sparkles, ChevronRight } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  twitter?: string;
};

// ============================================================================
// MEMOIZED SKELETON COMPONENT
// ============================================================================
const TeamMemberSkeleton = memo(() => (
  <div className="relative overflow-hidden rounded-3xl bg-muted/50 backdrop-blur-sm border border-border/10 animate-pulse">
    <div className="aspect-[4/5] w-full bg-gradient-to-br from-muted/60 to-muted/70" />
    <div className="p-6 space-y-3">
      <div className="h-7 w-3/4 rounded-full bg-muted/80 mx-auto" />
      <div className="h-5 w-1/2 rounded-full bg-muted/80 mx-auto" />
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full rounded-full bg-muted/80" />
        <div className="h-4 w-2/3 rounded-full bg-muted/80 mx-auto" />
      </div>
      <div className="flex justify-center gap-4 pt-2">
        <div className="h-5 w-5 rounded-full bg-muted/80" />
        <div className="h-5 w-5 rounded-full bg-muted/80" />
      </div>
    </div>
  </div>
));

TeamMemberSkeleton.displayName = 'TeamMemberSkeleton';

// ============================================================================
// TEAM CARD COMPONENT - OPTIMIZED WITH NEXT/IMAGE PRIORITY
// ============================================================================
const TeamCard = memo(({ member, index }: { member: TeamMember; index: number }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-background/50 backdrop-blur-md border border-border/20 shadow-xl transition-all duration-500 hover:shadow-2xl">
        {/* Image & Loader */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary/60 animate-spin" />
            </div>
          )}
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={`${member.name} - ${member.role}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} group-hover:scale-105`}
              onLoad={() => setIsImageLoaded(true)}
              priority={index < 3}
              loading={index < 3 ? 'eager' : 'lazy'}
              quality={85}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-foreground/30" />
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
          <h3 className="text-2xl font-headline font-bold text-white">
            {member.name}
          </h3>
          <p className="text-sm font-semibold text-primary mb-4">{member.role}</p>

          <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <p className="text-sm text-white/80 line-clamp-3 leading-relaxed">
              {member.bio}
            </p>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.linkedin && (
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#0077b5] transition-all duration-300 hover:scale-110"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          )}
          {member.twitter && (
            <Link
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#1DA1F2] transition-all duration-300 hover:scale-110"
              aria-label={`${member.name}'s Twitter profile`}
            >
              <Twitter className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
});

TeamCard.displayName = 'TeamCard';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function TeamPage() {
  const [mounted, setMounted] = useState(false);
  const firestore = useFirestore();

  // Memoize collection reference
  const teamMembersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'teamMembers') : null),
    [firestore]
  );

  const { data: teamMembers, isLoading: loading, error } = useCollection<TeamMember>(teamMembersCollection);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <TeamMemberSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AnimatedGradientBackground>
      <div className="flex flex-col min-h-screen bg-transparent">
        <Header />
        
        <main className="flex-grow">
          {/* Modern Hero Section */}
          <section className="relative py-20 lg:py-32 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto"
              >
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    The Team
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold bg-gradient-to-r from-foreground via-foreground/80 to-primary bg-clip-text text-transparent mb-6">
                  Meet the minds
                  <br />
                  <span className="text-primary">shaping the future</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Passionate experts dedicated to bringing you the finest avocados from Morocco, 
                  combining tradition with innovation.
                </p>

                {/* Stats - Optional decorative element */}
                <div className="flex justify-center gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">Years Combined</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Continents</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">Commitment</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Team Grid Section */}
          <section className="py-16 lg:py-24 relative">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TeamMemberSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-foreground mb-3">
                    Unable to load team
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Please refresh the page or try again later.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
                  >
                    Refresh Page
                  </button>
                </motion.div>
              )}

              {/* Success State */}
              {!loading && !error && teamMembers && teamMembers.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {teamMembers.map((member, index) => (
                      <TeamCard key={member.id} member={member} index={index} />
                    ))}
                  </div>

                  {/* Decorative connection lines (optional) */}
                  <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
                </>
              )}

              {/* Empty State */}
              {!loading && !error && (!teamMembers || teamMembers.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 max-w-md mx-auto"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-foreground mb-3">
                    Our Team is Growing!
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    We're currently introducing new members to our family. Check back soon to meet the full team.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
                  >
                    Get notified
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>
          </section>

          {/* Modern CTA Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="relative rounded-2xl overflow-hidden p-12 text-center text-primary-foreground bg-gradient-to-r from-primary via-primary/90 to-accent/90">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-6">
                    Ready to make an impact?
                  </h2>
                  <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                    Join our team of innovators and help us revolutionize the avocado industry.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/careers"
                      className="px-8 py-4 bg-background text-primary font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      View Open Positions
                    </Link>
                    <Link
                      href="/contact"
                      className="px-8 py-4 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground font-semibold rounded-full hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}
