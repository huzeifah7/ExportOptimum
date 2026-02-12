
'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Linkedin, Twitter, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
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
  <div className="group perspective-1000" style={{ perspective: '1500px' }}>
    <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
      <div className="absolute inset-0 rounded-3xl opacity-20"
        style={{
          background: 'linear-gradient(135deg, hsl(88,92%,45%), hsl(88,92%,55%))',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />
      <div className="relative h-72">
        <Skeleton className="absolute inset-0 bg-gray-200 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>
      <div className="p-7 bg-gradient-to-br from-white/40 to-white/60">
        <Skeleton className="h-7 w-40 bg-gray-200 rounded-lg mb-3" />
        <Skeleton className="h-8 w-32 bg-gray-200 rounded-full mb-4" />
        <div className="flex gap-3 mb-6">
          <Skeleton className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full bg-gray-200 rounded" />
            <Skeleton className="h-3 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-px bg-gray-200 mb-6" />
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="flex-1 max-w-[140px] h-12 rounded-xl bg-gray-200" />
          <Skeleton className="flex-1 max-w-[140px] h-12 rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-200/0 via-gray-200/50 to-gray-200/0" />
    </div>
  </div>
);

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8, rotateZ: -5 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateZ: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: (index % 4) * 0.15, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className="group perspective-1000"
      style={{ perspective: '1500px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-700 hover:shadow-[0_25px_80px_rgba(136,204,34,0.25)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(135deg, hsl(88,92%,45%), hsl(88,92%,55%), hsl(88,92%,35%), hsl(88,92%,50%))',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 6s ease infinite',
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />

          {/* Holographic shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'linear-gradient(125deg, transparent 0%, rgba(255,255,255,0.8) 45%, rgba(136,204,34,0.3) 50%, rgba(255,255,255,0.8) 55%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: 'shine-sweep 3s ease-in-out infinite'
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[hsl(88,92%,45%)] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationName: 'float-particle',
                  animationDuration: `${3 + Math.random() * 4}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${Math.random() * 2}s`,
                  animationPlayState: isHovered ? 'running' : 'paused',
                }}
              />
            ))}
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-6 right-6 w-12 h-12 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:rotate-90"
            style={{ transform: 'translateZ(10px)' }}
          >
            <div className="absolute inset-0 border-t-2 border-r-2 border-[hsl(88,92%,45%)] rounded-tr-2xl" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[hsl(88,92%,45%)] rounded-full animate-pulse" />
          </div>

          <div className="absolute bottom-6 left-6 w-12 h-12 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:-rotate-90"
            style={{ transform: 'translateZ(10px)' }}
          >
            <div className="absolute inset-0 border-b-2 border-l-2 border-[hsl(88,92%,45%)] rounded-bl-2xl" />
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-[hsl(88,92%,45%)] rounded-full animate-pulse" />
          </div>

          {/* Image section */}
          <div 
            className="relative h-72 overflow-hidden"
            style={{ 
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  data-ai-hint="person portrait"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,45%)] via-[hsl(88,92%,55%)] to-[hsl(88,92%,35%)] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      animation: 'pattern-drift 20s linear infinite'
                    }}
                  />
                  <span className="text-7xl font-black text-white drop-shadow-2xl relative z-10">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(88,92%,45%)]/20 via-transparent to-[hsl(88,92%,35%)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Glowing corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(88,92%,45%)] opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[hsl(88,92%,55%)] opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[hsl(88,92%,45%)] to-transparent opacity-50" />
            <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-[hsl(88,92%,45%)] rounded-full animate-pulse" />
            <div className="absolute top-0 right-1/4 w-1.5 h-1.5 bg-[hsl(88,92%,45%)] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(88,92%,45%) 10px, hsl(88,92%,45%) 11px)',
              }}
            />

            {/* Scan line */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-20"
                style={{ animation: 'scan-line 3s ease-in-out infinite' }}
              />
            </div>
          </div>

          {/* Content section */}
          <div 
            className="relative p-7 bg-gradient-to-br from-white/40 to-white/60 backdrop-blur-md"
            style={{ 
              transform: 'translateZ(50px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Side accent bar */}
            <div className="absolute left-0 top-8 w-1 h-16 bg-gradient-to-b from-[hsl(88,92%,45%)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
              style={{ transform: 'translateZ(60px)' }}
            />

            {/* Name */}
            <div className="mb-2">
              <h3 className="text-2xl font-black text-gray-900 group-hover:text-[hsl(88,92%,35%)] transition-colors duration-500 relative inline-block">
                {member.name}
                <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[hsl(88,92%,45%)] to-[hsl(88,92%,60%)] w-0 group-hover:w-full transition-all duration-700" />
                <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[hsl(88,92%,45%)] to-[hsl(88,92%,60%)] w-0 group-hover:w-full transition-all duration-700 blur-sm" />
              </h3>
            </div>

            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[hsl(88,92%,45%)] to-[hsl(88,92%,35%)] mb-4 shadow-lg shadow-[hsl(88,92%,45%)]/30 group-hover:shadow-xl group-hover:shadow-[hsl(88,92%,45%)]/50 transition-all duration-500 relative overflow-hidden"
              style={{ transform: 'translateZ(70px)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse relative z-10" />
              <p className="text-xs font-bold uppercase tracking-widest text-white relative z-10">
                {member.role}
              </p>
            </div>

            {/* Bio with quotes */}
            <div className="relative mb-6">
              <div className="absolute -left-2 -top-1 text-4xl text-[hsl(88,92%,45%)]/20 font-serif leading-none">"</div>
              <div className="flex gap-3 pl-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(88,92%,45%)]/20 to-[hsl(88,92%,35%)]/20 flex items-center justify-center group-hover:from-[hsl(88,92%,45%)]/40 group-hover:to-[hsl(88,92%,35%)]/40 transition-all duration-500 group-hover:rotate-12"
                    style={{ transform: 'translateZ(80px)' }}
                  >
                    <Sparkles className="w-4 h-4 text-[hsl(88,92%,40%)]" />
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 flex-1 italic">
                  {member.bio}
                </p>
              </div>
              <div className="absolute -right-2 -bottom-1 text-4xl text-[hsl(88,92%,45%)]/20 font-serif leading-none rotate-180">"</div>
            </div>

            {/* Divider with dots */}
            <div className="relative h-px mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(88,92%,45%)] to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
              
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-[hsl(88,92%,45%)] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '100ms' }} />
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[hsl(88,92%,45%)] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '200ms' }} />
              <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-[hsl(88,92%,45%)] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '300ms' }} />
            </div>

            {/* Social links */}
            <div 
              className="flex items-center justify-center gap-3"
              style={{ transform: 'translateZ(90px)' }}
            >
              {member.linkedin && (
                <Link 
                  href={member.linkedin} 
                  target="_blank"
                  className="group/social relative flex-1 max-w-[140px] h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[hsl(88,92%,45%)] hover:to-[hsl(88,92%,35%)] flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-md hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity duration-500" />
                  <Linkedin className="w-5 h-5 text-gray-700 group-hover/social:text-white transition-colors duration-300 relative z-10" />
                  <span className="text-xs font-bold text-gray-700 group-hover/social:text-white transition-colors duration-300 relative z-10">LinkedIn</span>
                </Link>
              )}
              {member.twitter && (
                <Link 
                  href={member.twitter} 
                  target="_blank"
                  className="group/social relative flex-1 max-w-[140px] h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[hsl(88,92%,45%)] hover:to-[hsl(88,92%,35%)] flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-md hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity duration-500" />
                  <Twitter className="w-5 h-5 text-gray-700 group-hover/social:text-white transition-colors duration-300 relative z-10" />
                  <span className="text-xs font-bold text-gray-700 group-hover/social:text-white transition-colors duration-300 relative z-10">Twitter</span>
                </Link>
              )}
            </div>

            {/* Bottom dots */}
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(88,92%,45%)]/30 group-hover:bg-[hsl(88,92%,45%)] transition-colors duration-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(88,92%,45%)]/30 group-hover:bg-[hsl(88,92%,45%)] transition-colors duration-300" style={{ transitionDelay: '100ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(88,92%,45%)]/30 group-hover:bg-[hsl(88,92%,45%)] transition-colors duration-300" style={{ transitionDelay: '200ms' }} />
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[hsl(88,92%,45%)]/0 via-[hsl(88,92%,45%)]/50 to-[hsl(88,92%,45%)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
        </div>

        {/* Shadow layers */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(88,92%,45%)]/20 to-[hsl(88,92%,35%)]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
          style={{ transform: 'translateZ(-30px) scale(0.95)' }}
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-gray-400/30 to-gray-600/30 rounded-3xl blur-3xl"
          style={{ transform: 'translateZ(-60px) scale(0.9)' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default function TeamPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const teamMembersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);

  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white relative overflow-hidden">

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,50%) 0%, transparent 70%)',
              animation: 'float-slow 20s ease-in-out infinite'
            }} 
          />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,45%) 0%, transparent 70%)',
              animation: 'float-slow 15s ease-in-out infinite reverse'
            }} 
          />

          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(88,92%,40%) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {mounted && Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[hsl(88,92%,45%)]"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                opacity: 0.1,
                animation: `float-particle ${8 + i * 2}s ease-in-out infinite ${i * 1.2}s`
              }}
            />
          ))}
        </div>

        <Header />

        <main className="flex-grow relative z-10">
          {/* Hero */}
          <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isClient ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(88,92%,45%)]/30 bg-[hsl(88,92%,45%)]/5 text-[hsl(88,92%,35%)] text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  Our Leadership Team
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
                  Meet the People Behind
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(88,92%,45%)] via-[hsl(88,92%,35%)] to-[hsl(88,92%,50%)]">
                      Excellence
                    </span>
                    <svg className="absolute -bottom-2 left-0 right-0 h-3" viewBox="0 0 300 12" fill="none">
                      <path d="M2 10C80 2 220 2 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(88,92%,45%)" stopOpacity="0.3"/>
                          <stop offset="50%" stopColor="hsl(88,92%,45%)" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="hsl(88,92%,45%)" stopOpacity="0.3"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto">
                  The passionate leaders driving Morocco's finest avocados — committed to quality, sustainability, and innovation.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Team Grid */}
          <section className="pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!isLoading && teamMembers && teamMembers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <TeamCard key={member.id} member={member} index={index} />
                  ))}
                </div>
              )}

              {!isLoading && (!teamMembers || teamMembers.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(88,92%,45%)]/10 to-[hsl(88,92%,60%)]/10 border border-[hsl(88,92%,45%)]/20 flex items-center justify-center mb-6">
                    <Users className="w-12 h-12 text-[hsl(88,92%,45%)]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Team is Growing</h3>
                  <p className="text-gray-500 max-w-md leading-relaxed">
                    We're building something special. Team member profiles will appear here soon.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(88,92%,45%)] to-[hsl(88,92%,35%)] p-12 lg:p-16 shadow-2xl"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-headline font-bold text-white mb-3">
                      Want to Join Our Mission?
                    </h2>
                    <p className="text-white/90 text-lg max-w-xl">
                      We're always looking for passionate individuals who share our vision for excellence and sustainability.
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[hsl(88,92%,35%)] font-bold text-base hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  >
                    Get in Touch
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.1; 
          }
          33% { 
            transform: translateY(-25px) translateX(10px); 
            opacity: 0.2; 
          }
          66% { 
            transform: translateY(-10px) translateX(-8px); 
            opacity: 0.15; 
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shine-sweep {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }

        @keyframes pattern-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }

        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }

        .perspective-1000 {
          perspective: 1500px;
        }
      `}</style>
    </>
  );
}
