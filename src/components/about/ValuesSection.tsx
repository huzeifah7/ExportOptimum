
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const values = [
  { 
    title: 'Ownership Of Our Own brand :     Mavocado',
    pattern: 'dots',
    blobColor: 'from-[hsl(88,92%,55%)] to-[hsl(88,92%,35%)]'
  },
  { 
    title: 'Ownership of two avocado farms',
    pattern: 'grid',
    blobColor: 'from-[hsl(88,92%,55%)] to-[hsl(88,92%,35%)]'
  },
  { 
    title: 'Exclusive access and Management of over 500 hectares of avocado farms',
    pattern: 'lines',
    blobColor: 'from-[hsl(88,92%,55%)] to-[hsl(88,92%,35%)]'
  },
  { 
    title: 'Premium produce with international norms',
    pattern: 'circles',
    blobColor: 'from-[hsl(88,92%,55%)] to-[hsl(88,92%,35%)]'
  },
];

const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  // Pattern backgrounds
  const getPattern = (type: string) => {
    switch(type) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-[0.05]">
            <div style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} className="w-full h-full text-gray-900" />
          </div>
        );
      case 'grid':
        return (
          <div className="absolute inset-0 opacity-[0.05]">
            <div style={{
              backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} className="w-full h-full text-gray-900" />
          </div>
        );
      case 'lines':
        return (
          <div className="absolute inset-0 opacity-[0.05]">
            <div style={{
              backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 15px)',
            }} className="w-full h-full text-gray-900" />
          </div>
        );
      case 'circles':
        return (
          <div className="absolute inset-0 opacity-[0.05]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circles)" className="text-gray-900" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={ref} className="py-20 lg:py-28 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Eyebrow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-[hsl(88,92%,28%)]" />
          <span className="text-lg font-bold uppercase tracking-[0.25em] text-[hsl(88,92%,25%)]">
            Why Choose Us
          </span>
          <span className="w-8 h-px bg-[hsl(88,92%,28%)]" />
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900 max-w-4xl mx-auto text-center mb-16"
        >
          Why work with{' '}
          <span className="bg-gradient-to-r from-[hsl(88,92%,35%)] to-[hsl(88,92%,22%)] bg-clip-text text-transparent">
            Export Optimum
          </span>
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Colorful Blob Background - Increased opacity for more vibrant look */}
              <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full opacity-40 group-hover:opacity-60 blur-3xl transition-all duration-700 group-hover:scale-125">
                <div className={`w-full h-full bg-gradient-to-br ${value.blobColor} rounded-full`} />
              </div>
              
              {/* Second smaller blob */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-30 group-hover:opacity-50 blur-2xl transition-all duration-700 group-hover:scale-110">
                <div className={`w-full h-full bg-gradient-to-tl ${value.blobColor} rounded-full`} />
              </div>
              
              {/* Background Pattern */}
              {getPattern(value.pattern)}
              
              {/* Content */}
              <div className="relative p-8 min-h-[300px] flex flex-col justify-center text-center">
                <h3 className="text-xl font-black text-gray-900 leading-tight transition-colors duration-300">
                  {value.title}
                </h3>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className={`w-full h-full bg-gradient-to-r ${value.blobColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-20 flex justify-center">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[hsl(88,92%,28%)]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
