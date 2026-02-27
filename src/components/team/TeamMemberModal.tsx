'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Mail, X, Users2, ChevronRight, ArrowLeft } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  whatsapp?: string;
  department: string;
  isManager?: boolean;
};

interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
  departmentStaff?: TeamMember[];
}

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

const TeamMemberModal = ({ member, onClose, departmentStaff = [] }: TeamMemberModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<TeamMember | null>(null);

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

  const handleStaffClick = (staff: TeamMember) => {
    setSelectedStaff(staff);
  };

  const handleBackToManager = () => {
    setSelectedStaff(null);
  };

  const currentMember = selectedStaff || member;
  const isViewingStaff = !!selectedStaff;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            key={currentMember.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full mb-12 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group"
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
            </button>

            {/* Back Button (when viewing staff) */}
            {isViewingStaff && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBackToManager}
                className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-semibold text-gray-700">Back to {member.name}</span>
              </motion.button>
            )}

            <div className="grid md:grid-cols-5 gap-0 h-full">
              {/* Photo Section */}
              <div className="relative md:col-span-2 aspect-square md:aspect-auto bg-gradient-to-br from-gray-100 to-gray-50 h-full min-h-[400px]">
                {currentMember.photoUrl ? (
                  <Image
                    src={currentMember.photoUrl}
                    alt={currentMember.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    data-ai-hint="person portrait"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(88,92%,50%)] via-[hsl(88,92%,40%)] to-[hsl(88,92%,30%)] flex items-center justify-center">
                    <span className="text-9xl font-black text-white/90">
                      {currentMember.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Manager Badge */}
                {currentMember.isManager && (
                  <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                    <span className="text-xs font-bold text-[hsl(88,92%,30%)] uppercase tracking-wider">
                      Department Manager
                    </span>
                  </div>
                )}
              </div>

              {/* Bio & Team Section */}
              <div className="md:col-span-3 p-6 md:p-10 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(88,92%,95%)] border border-[hsl(88,92%,40%)] text-[hsl(88,92%,30%)] text-xs font-bold uppercase tracking-wider mb-4 self-start"
                >
                  {currentMember.department} · {currentMember.role}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight"
                >
                  {currentMember.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm md:text-base leading-relaxed mb-10"
                >
                  {currentMember.bio}
                </motion.p>

                {/* Staff Cards Section - Only show for manager, not for staff */}
                {!isViewingStaff && departmentStaff.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-10"
                  >
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                      <Users2 className="w-4 h-4" />
                      {member.department} Team · {departmentStaff.length} {departmentStaff.length === 1 ? 'Member' : 'Members'}
                    </h3>
                    
                    {/* Modern Clickable Staff Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {departmentStaff.map((staff, index) => (
                        <motion.button
                          key={staff.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + (index * 0.05) }}
                          onClick={() => handleStaffClick(staff)}
                          className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-[hsl(88,92%,30%)]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
                        >
                          {/* Background Gradient Blob */}
                          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(88,92%,50%)]/10 to-[hsl(88,92%,30%)]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Photo */}
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {staff.photoUrl ? (
                              <Image
                                src={staff.photoUrl}
                                alt={staff.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-2xl font-black text-gray-400">
                                  {staff.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* View Details Icon */}
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <div className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                                <ChevronRight className="w-3.5 h-3.5 text-[hsl(88,92%,30%)]" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3 relative">
                            <h4 className="text-sm font-bold text-gray-900 mb-0.5 leading-tight group-hover:text-[hsl(88,92%,30%)] transition-colors duration-300 line-clamp-1">
                              {staff.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider line-clamp-1">
                              {staff.role}
                            </p>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(88,92%,30%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Contact Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-6 border-t border-gray-100 mt-auto"
                >
                  {currentMember.linkedin && (
                    <Link
                      href={currentMember.linkedin}
                      target="_blank"
                      className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] hover:from-[hsl(88,92%,55%)] hover:to-[hsl(88,92%,45%)] text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </Link>
                  )}
                  {currentMember.whatsapp && (
                    <Link
                      href={`https://wa.me/${currentMember.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#2ae06f] hover:to-[#149c8d] text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-sm"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </Link>
                  )}
                  {!currentMember.linkedin && !currentMember.whatsapp && (
                    <button className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[hsl(88,92%,50%)] to-[hsl(88,92%,40%)] text-white flex items-center justify-center gap-2 font-semibold shadow-lg text-sm">
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Contact Office</span>
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

export default TeamMemberModal;