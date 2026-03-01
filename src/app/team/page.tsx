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
      className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[hsl(88,92%,30%)]/20 mb-8"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div style={{
          backgroundImage: 'radial-gradient(circle, hsl(88,92%,30%) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} className="w-full h-full" />
      </div>

      {/* Gradient Accent Blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[hsl(88,92%,50%)]/10 to-[hsl(88,92%,30%)]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Image Section */}
        <div className="lg:col-span-2 relative">
          <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {member.photoUrl ? (
              <Image 
                src={member.photoUrl} 
                alt={member.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,30%)] flex items-center justify-center">
                <span className="text-9xl font-black text-white/20">{member.name.charAt(0)}</span>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Role Badge */}
            <div className="absolute top-6 left-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/50">
                {member.isCEO ? (
                  <>
                    <Crown className="w-4 h-4 text-[hsl(88,92%,30%)]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[hsl(88,92%,25%)]">CEO</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600">Director</span>
                  </>
                )}
              </div>
            </div>

            {/* Department Badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg text-center">
                <span className="text-xs font-bold text-gray-700">{member.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[hsl(88,92%,30%)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[hsl(88,92%,25%)]">
              {member.isCEO ? 'Executive Leadership' : 'Board of Directors'}
            </span>
          </div>

          {/* Name & Role */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-3">
            {member.name}
          </h3>
          <p className="text-lg md:text-xl font-semibold text-[hsl(88,92%,30%)] mb-6">
            {member.role}
          </p>
          
          {/* Bio */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(88,92%,30%)] to-transparent rounded-full" />
            <p className="text-gray-600 leading-relaxed pl-6 text-base md:text-lg">
              {member.bio}
            </p>
          </div>

          {/* Social Links */}
          {(member.linkedin || member.whatsapp) && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect
                </a>
              )}
              {member.whatsapp && (
                <a
                  href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.187-1.622c1.736.946 3.7 1.442 5.7 1.447h.005c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Message
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(88,92%,30%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <div className="h-[400px] w-full bg-gray-50 rounded-3xl animate-pulse" />
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
                        colorClass="bg-[hsl(88,92%,35%)] shadow-[0_0_20px_rgba(113,149,7,0.3)]" 
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