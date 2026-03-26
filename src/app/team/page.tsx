
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Crown, Briefcase, Users, Mail } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { motion } from 'framer-motion';
import TeamCard from '@/components/team/TeamCard';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const HeroGeometric = dynamic(() => import('@/components/ui/shape-landing-hero').then(mod => mod.HeroGeometric), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-white" />
});

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  email?: string;
  whatsapp?: string;
  isManager?: boolean;
  isCEO?: boolean;
  isDirector?: boolean;
  department: string;
};

const LeaderSpotlight = ({ member, index }: { member: TeamMember, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full mb-32 overflow-hidden"
    >
      {/* Background Decorative Label */}
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] z-0">
        <span className="text-[12rem] font-black tracking-tighter uppercase whitespace-nowrap leading-none">
          {member.isCEO ? 'Leadership' : 'Managing Director'}
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 items-center">
        
        {/* Photo Column */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-gray-100 ring-1 ring-black/5">
            {member.photoUrl ? (
              <Image 
                src={member.photoUrl} 
                alt={member.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-9xl font-black text-white/20">{member.name.charAt(0)}</span>
              </div>
            )}
            
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            
            {/* Float Badges - Centered horizontally */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-20">
              <div className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/50 flex items-center gap-3 whitespace-nowrap">
                {member.isCEO ? (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">CEO & Founder</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Managing Director</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-colors duration-700" />
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7 mt-12 lg:mt-0 lg:pl-8">
          <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-4">
                {member.name}
              </h2>
              
              <p className="text-2xl font-bold text-gray-400 leading-tight mb-6">
                {member.role}
              </p>
            </div>

            {/* Description (Bio) - Visible for CEO and Managing Director */}
            {member.bio && (
              <div className="mb-10 text-lg leading-relaxed text-gray-600 font-prose font-light italic border-l-2 border-primary/20 pl-6">
                "{member.bio}"
              </div>
            )}

            {/* Social & Connect */}
            {(member.email || member.whatsapp) && (
              <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-50 hover:bg-primary/5 text-gray-600 hover:text-primary transition-all duration-300 font-bold text-sm border border-transparent hover:border-primary/10"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    Email
                  </a>
                )}
                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 transition-all duration-300 font-bold text-sm border border-transparent hover:border-green-100"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.187-1.622c1.736.946 3.7 1.442 5.7 1.447h.005c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
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

  const { data: allTeamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  const ceos = useMemo(() => allTeamMembers?.filter(m => m.isCEO) || [], [allTeamMembers]);
  const managingDirectors = useMemo(() => allTeamMembers?.filter(m => m.isDirector) || [], [allTeamMembers]);
  const otherManagers = useMemo(() => 
    allTeamMembers?.filter(m => m.isManager && !m.isCEO && !m.isDirector) || [], 
    [allTeamMembers]
  );

  const TeamSection = ({ title, icon: Icon, members, colorClass, isSpotlight = false }: { title: string, icon: any, members: TeamMember[], colorClass: string, isSpotlight?: boolean }) => {
    if (members.length === 0) return null;
    return (
        <div className="mb-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mb-12 pb-4 border-b border-gray-100"
            >
                <div className={`p-2 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight text-center">
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white relative">
        <Header />

        <main className="flex-grow relative z-10">
          <HeroGeometric 
            title1="The Architects of"
            title2="Quality"
            subtitle="Meet the leadership team driving Moroccan agricultural excellence with family values and global expertise."
          />

          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="space-y-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <Skeleton className="lg:col-span-5 aspect-[4/5] rounded-[2.5rem]" />
                        <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-16 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
              ) : allTeamMembers && allTeamMembers.length > 0 ? (
                <>
                    <TeamSection 
                        title="CEO & Founder" 
                        icon={Crown} 
                        members={ceos} 
                        colorClass="bg-primary shadow-[0_10px_30px_-10px_rgba(113,149,7,0.5)]" 
                        isSpotlight={true}
                    />
                    <TeamSection 
                        title="Managing Director" 
                        icon={Briefcase} 
                        members={managingDirectors} 
                        colorClass="bg-amber-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)]" 
                        isSpotlight={true}
                    />
                    
                    <div className="pt-12 mt-12 border-t border-gray-100">
                        <TeamSection 
                            title="Management Team" 
                            icon={Users} 
                            members={otherManagers} 
                            colorClass="bg-gray-900 shadow-xl" 
                        />
                    </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <Users className="w-14 h-14 text-gray-200 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-400">Leadership profiles are being prepared</h3>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
