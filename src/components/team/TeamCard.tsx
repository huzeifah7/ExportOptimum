
'use client';

import React, { useState, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Linkedin, ArrowUpRight, Crown, Briefcase, ShieldCheck } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  whatsapp?: string;
  isCEO?: boolean;
  isDirector?: boolean;
  isManager?: boolean;
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.187-1.622c1.736.946 3.7 1.442 5.7 1.447h.005c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const TeamCard = memo(({ member, index, onClick }: { member: TeamMember; index: number; onClick: () => void }) => {
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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 group-hover:blur-md"></div>
      
      <div 
        ref={cardRef}
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(146, 224, 40, 0.08), transparent 40%)`,
          }}
        />

        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          {member.photoUrl ? (
            <>
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={75}
                data-ai-hint="person portrait"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] flex items-center justify-center">
              <span className="text-8xl font-black text-white/90">
                {member.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {member.isCEO && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg border border-white/20">
                    <Crown className="w-4 h-4 text-white" />
                </div>
            )}
            {member.isDirector && (
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg border border-white/20">
                    <Briefcase className="w-4 h-4 text-white" />
                </div>
            )}
          </div>

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
            {member.whatsapp && (
              <Link 
                href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-20">
            <span className="text-xs font-bold text-[hsl(88,92%,35%)] uppercase tracking-wider flex items-center gap-2">
              View Profile
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div className="relative p-5 bg-gradient-to-br from-white to-gray-50/30">
          <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[hsl(88,92%,35%)] transition-colors duration-300 truncate">
            {member.name}
          </h3>
          <p className="text-[hsl(88,92%,40%)] text-xs font-bold uppercase tracking-widest mb-3">
            {member.role}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {member.bio}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

TeamCard.displayName = 'TeamCard';

export default TeamCard;
