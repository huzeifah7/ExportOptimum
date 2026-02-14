'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Linkedin, Twitter, Users, ArrowUpRight, Mail, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

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
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(88,92%,50%)] to-[hsl(88,92%,30%)] rounded-3xl opacity-20 blur"></div>
    <div className="relative bg-white rounded-3xl p-6 space-y-4">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const TeamMemberModal = ({ member, onClose }: { member: TeamMember; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group"
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left - Image */}
              <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-50">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    data-ai-hint="person portrait"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] flex items-center justify-center">
                    <span className="text-9xl font-black text-white/90">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Right - Content */}
              <div className="p-8 md:p-10 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(88,92%,95%)] border border-[hsl(88,92%,40%)] text-[hsl(88,92%,30%)] text-xs font-bold uppercase tracking-wider mb-4 self-start"
                >
                  {member.role}
                </motion.div>

                {/* Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight"
                >
                  {member.name}
                </motion.h2>

                {/* Bio */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 flex-grow"
                >
                  {member.bio}
                </motion.p>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 pt-6 border-t border-gray-100"
                >
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      className="flex-1 h-14 rounded-xl bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] hover:from-[hsl(88,92%,55%)] hover:to-[hsl(88,92%,45%)] text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </Link>
                  )}
                  {member.twitter && (
                    <Link
                      href={member.twitter}
                      target="_blank"
                      className="flex-1 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="hidden sm:inline">Twitter</span>
                    </Link>
                  )}
                  {!member.linkedin && !member.twitter && (
                    <button className="flex-1 h-14 rounded-xl bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] text-white flex items-center justify-center gap-2 font-semibold shadow-lg">
                      <Mail className="w-5 h-5" />
                      <span className="hidden sm:inline">Contact</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TeamCard = ({ member, index, onClick }: { member: TeamMember; index: number; onClick: () => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 group-hover:blur-md"></div>
      
      {/* Card */}
      <div 
        ref={cardRef}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {/* Spotlight effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(146, 224, 40, 0.08), transparent 40%)`,
          }}
        />

        {/* Photo section - larger now */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          {member.photoUrl ? (
            <>
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                data-ai-hint="person portrait"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] flex items-center justify-center">
              <span className="text-8xl font-black text-white/90">
                {member.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Floating particles on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -60],
                  x: [0, (i % 2 ? 1 : -1) * 20]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  bottom: '10%'
                }}
              />
            ))}
          </div>

          {/* Minimized social icons - top right corner */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-20">
            {member.linkedin && (
              <Link 
                href={member.linkedin} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
              >
                <Linkedin className="w-4 h-4 text-[hsl(88,92%,35%)]" />
              </Link>
            )}
            {member.twitter && (
              <Link 
                href={member.twitter} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
              >
                <Twitter className="w-4 h-4 text-[hsl(88,92%,35%)]" />
              </Link>
            )}
          </div>

          {/* View profile indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-20">
            <span className="text-xs font-bold text-[hsl(88,92%,35%)] uppercase tracking-wider flex items-center gap-2">
              View Profile
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div 
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
            />
          </div>
        </div>

        {/* Content section - compact */}
        <div className="relative p-5 bg-gradient-to-br from-white to-gray-50/30">
          {/* Name */}
          <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[hsl(88,92%,35%)] transition-colors duration-300 truncate">
            {member.name}
          </h3>
          
          {/* Role */}
          <p className="text-[hsl(88,92%,40%)] text-xs font-bold uppercase tracking-widest mb-3">
            {member.role}
          </p>
          
          {/* Bio preview */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {member.bio}
          </p>

          {/* Decorative corner accent */}
          <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-full h-full border-r-2 border-b-2 border-[hsl(88,92%,40%)] rounded-br-lg" />
          </div>
        </div>

        {/* Pulse animation border */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl animate-pulse-ring" />
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

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

        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          {/* Gradient orbs with more dynamic movement */}
          <div 
            className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.08]"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,50%) 0%, transparent 70%)',
              animation: 'float-orb-dynamic 15s ease-in-out infinite'
            }} 
          />
          <div 
            className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,45%) 0%, transparent 70%)',
              animation: 'float-orb-dynamic 20s ease-in-out infinite 5s'
            }} 
          />
          <div 
            className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.06]"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,40%) 0%, transparent 70%)',
              animation: 'float-orb-dynamic 25s ease-in-out infinite 10s'
            }} 
          />

          {/* Animated gradient waves */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, hsl(88,92%,50%) 0%, transparent 50%, hsl(88,92%,40%) 100%)',
                animation: 'wave-move 20s linear infinite'
              }}
            />
          </div>

          {/* Floating particles with varied animations */}
          {mounted && Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[hsl(88,92%,50%)]"
              style={{
                width: `${3 + (i % 4) * 2}px`,
                height: `${3 + (i % 4) * 2}px`,
                left: `${(i * 6.5) % 100}%`,
                top: `${(i * 11) % 100}%`,
                opacity: 0.12,
                animation: `float-particle-varied ${12 + i * 1.5}s ease-in-out infinite ${i * 1.2}s`,
              }}
            />
          ))}

          {/* Grid lines that fade in/out */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(0deg, hsl(88,92%,50%) 1px, transparent 1px),
                linear-gradient(90deg, hsl(88,92%,50%) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              animation: 'grid-pulse 8s ease-in-out infinite'
            }}
          />
        </div>

        <Header />

        <main className="flex-grow relative z-10">
          {/* Hero Section */}
          <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isClient ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center relative"
              >
                {/* Decorative elements */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-[hsl(88,92%,50%)] opacity-5 rounded-full blur-3xl animate-pulse-slow" />

                {/* Badge with animation */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isClient ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] text-white text-sm font-bold mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Meet Our Team
                </motion.div>

                {/* Headline with character animation */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
                  The Minds Behind
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)]">
                      Innovation
                    </span>
                    {/* Animated underline */}
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                      <motion.path
                        d="M2 10C50 5 100 2 150 5C200 8 250 10 298 7"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isClient ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(88,92%,50%)" />
                          <stop offset="100%" stopColor="hsl(88,92%,30%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={isClient ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mt-8"
                >
                  A dedicated team of visionaries cultivating excellence in every order.  
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Team Grid Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Team Members */}
              {!isLoading && teamMembers && teamMembers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <TeamCard 
                      key={member.id} 
                      member={member} 
                      index={index}
                      onClick={() => setSelectedMember(member)}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (!teamMembers || teamMembers.length === 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(88,92%,50%)] to-[hsl(88,92%,30%)] opacity-20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,30%)] flex items-center justify-center shadow-2xl">
                      <Users className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-4">Building Our Dream Team</h3>
                  <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                    We're assembling exceptional talent. Check back soon to meet the people shaping the future.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                {/* Animated gradient background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition-all duration-500 group-hover:blur-xl animate-gradient-shift" />
                
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(88,92%,45%)] to-[hsl(88,92%,35%)] px-10 py-16 md:py-20 shadow-2xl">
                  {/* Decorative circles with animation */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold mb-6">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Join Us
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                      Grow Your Career
                      <span className="text-white/90">With Purpose</span>
                    </h2>
                    
                    <p className="text-white/90 text-lg md:text-xl mb-10 max-w-5xl mx-auto leading-relaxed">
                      Join a team that's revolutionizing sustainable agriculture. We're looking for passionate innovators.
                    </p>
                    
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[hsl(88,92%,35%)] font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group/btn"
                    >
                      Start Your Journey
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Modal */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      <style jsx global>{`
        @keyframes float-orb-dynamic {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% { 
            transform: translate(40px, -50px) scale(1.15) rotate(90deg);
          }
          50% { 
            transform: translate(-30px, -30px) scale(0.95) rotate(180deg);
          }
          75% { 
            transform: translate(20px, 40px) scale(1.1) rotate(270deg);
          }
        }

        @keyframes float-particle-varied {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.12;
          }
          25% { 
            transform: translate(30px, -60px) scale(1.3);
            opacity: 0.25;
          }
          50% { 
            transform: translate(-20px, -120px) scale(0.8);
            opacity: 0.15;
          }
          75% { 
            transform: translate(40px, -180px) scale(1.2);
            opacity: 0.08;
          }
        }

        @keyframes wave-move {
          0% {
            transform: translateX(-50%) translateY(0) rotate(0deg);
            opacity: 0.03;
          }
          50% {
            opacity: 0.05;
          }
          100% {
            transform: translateX(50%) translateY(-20px) rotate(360deg);
            opacity: 0.03;
          }
        }

        @keyframes grid-pulse {
          0%, 100% {
            opacity: 0.02;
          }
          50% {
            opacity: 0.04;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(146, 224, 40, 0.4);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(146, 224, 40, 0);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
    </>
  );
}