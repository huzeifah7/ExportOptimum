
'use client';

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Users, Sparkles, Crown, Briefcase, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { motion } from 'framer-motion';
import TeamCard from '@/components/team/TeamCard';
import Image from 'next/image';

// Lazy load the heavy modal component
const TeamMemberModal = dynamic(() => import('@/components/team/TeamMemberModal'), {
  ssr: false,
});

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  whatsapp?: string;
  isManager?: boolean;
  isCEO?: boolean;
  isDirector?: boolean;
  department: string;
};

const LeaderSpotlight = ({ member, index }: { member: TeamMember, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 cursor-default"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Large Image */}
        <div className="lg:col-span-4 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-50">
          {member.photoUrl ? (
            <Image 
              src={member.photoUrl} 
              alt={member.name} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-9xl font-black text-white/20">{member.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
             <div className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {member.isCEO ? <Crown className="w-6 h-6 text-primary" /> : <Briefcase className="w-6 h-6 text-amber-500" />}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              {member.isCEO ? 'Executive Leadership' : 'Board of Directors'}
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              {member.name}
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-400">
              {member.role}
            </p>
          </div>
          
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="leading-relaxed whitespace-pre-wrap">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const teamMembersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);

  const { data: allTeamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  // Leadership tiers
  const ceos = useMemo(() => allTeamMembers?.filter(m => m.isCEO) || [], [allTeamMembers]);
  const directors = useMemo(() => allTeamMembers?.filter(m => m.isDirector) || [], [allTeamMembers]);
  const otherManagers = useMemo(() => 
    allTeamMembers?.filter(m => m.isManager && !m.isCEO && !m.isDirector) || [], 
    [allTeamMembers]
  );
  const professionalStaff = useMemo(() => 
    allTeamMembers?.filter(m => !m.isManager && !m.isCEO && !m.isDirector) || [], 
    [allTeamMembers]
  );

  // When a leader is selected, find all their department staff
  const departmentStaff = useMemo(() => {
    if (!selectedMember || !allTeamMembers) return [];
    return allTeamMembers.filter(m => 
      m.department === selectedMember.department && 
      m.id !== selectedMember.id &&
      !m.isManager && !m.isCEO && !m.isDirector
    );
  }, [selectedMember, allTeamMembers]);

  const handleCardClick = useCallback((member: TeamMember) => {
    setSelectedMember(member);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  const TeamSection = ({ title, icon: Icon, members, colorClass, isSpotlight = false }: { title: string, icon: any, members: TeamMember[], colorClass: string, isSpotlight?: boolean }) => {
    if (members.length === 0) return null;
    return (
        <div className="mb-24">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-12 pb-4 border-b border-gray-100"
            >
                <div className={`p-2 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    {title}
                </h2>
            </motion.div>
            
            {isSpotlight ? (
                <div className="space-y-8">
                    {members.map((member, index) => (
                        <LeaderSpotlight key={member.id} member={member} index={index} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {members.map((member, index) => (
                        <TeamCard 
                            key={member.id} 
                            member={member} 
                            index={index}
                            onClick={() => handleCardClick(member)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white relative overflow-hidden">
        {/* Optimized Animated Background */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          <div 
            className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.08] will-change-transform"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,50%) 0%, transparent 70%)',
              animation: 'float-orb-dynamic 15s ease-in-out infinite'
            }} 
          />
          <div 
            className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] will-change-transform"
            style={{ 
              background: 'radial-gradient(circle, hsl(88,92%,45%) 0%, transparent 70%)',
              animation: 'float-orb-dynamic 20s ease-in-out infinite 5s'
            }} 
          />
        </div>

        <Header />

        <main className="flex-grow relative z-10">
          <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isClient ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center relative"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] text-white text-sm font-bold mb-6 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Our Team
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
                  Cultivating<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)]">
                    Excellence
                  </span>
                </h1>

                <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mt-8">
                  Built on a foundation of family values and decades of agricultural expertise. Meet the leaders and professionals dedicated to delivering the world's finest produce.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="space-y-24">
                    <div className="h-[400px] w-full bg-gray-50 rounded-[2.5rem] animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
                            <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
              ) : allTeamMembers && allTeamMembers.length > 0 ? (
                <>
                    <TeamSection 
                        title="Executive Leadership" 
                        icon={Crown} 
                        members={ceos} 
                        colorClass="bg-primary shadow-[0_0_20px_rgba(113,149,7,0.3)]" 
                        isSpotlight={true}
                    />
                    <TeamSection 
                        title="Board of Directors" 
                        icon={Briefcase} 
                        members={directors} 
                        colorClass="bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                        isSpotlight={true}
                    />
                    <TeamSection 
                        title="Management Team" 
                        icon={Users} 
                        members={otherManagers} 
                        colorClass="bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                    />
                    <TeamSection 
                        title="Our Professional Staff" 
                        icon={Users} 
                        members={professionalStaff} 
                        colorClass="bg-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.1)]" 
                    />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <Users className="w-14 h-14 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold">Building Our Team</h3>
                  <p className="text-gray-500">Check back soon to meet our experts.</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(88,92%,45%)] to-[hsl(88,92%,35%)] px-10 py-16 md:py-20 shadow-2xl">
                <div className="relative z-10 text-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                    Grow Your Career<br />With Purpose
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join a team that's revolutionizing sustainable agriculture and global fresh produce supply.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-[hsl(88,92%,35%)] font-black text-lg transition-all duration-300 hover:scale-105"
                  >
                    Start Your Journey
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {selectedMember && (
        <Suspense fallback={null}>
          <TeamMemberModal
            member={selectedMember}
            onClose={handleCloseModal}
            departmentStaff={departmentStaff}
          />
        </Suspense>
      )}

      <style jsx global>{`
        @keyframes float-orb-dynamic {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(40px, -50px) scale(1.15) rotate(90deg); }
          50% { transform: translate(-30px, -30px) scale(0.95) rotate(180deg); }
          75% { transform: translate(20px, 40px) scale(1.1) rotate(270deg); }
        }
        .dg-scroll-lock { overflow: hidden !important; }
      `}</style>
    </>
  );
}
