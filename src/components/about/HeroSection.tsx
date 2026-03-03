'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '15+', label: 'Countries' },
  { value: '10+', label: 'Years Experience' },
  { value: '100%', label: 'Family Owned' },
  { value: '4', label: 'Continents' },
  { value: '50+', label: 'Global Partners' },
];

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-24 overflow-hidden bg-white">
      <motion.div style={{ y }} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-primary/30 bg-primary/10 text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            About Export Optimum
          </span>
        </motion.div>

        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.04em] text-foreground"
          >
            Built by Family.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.04em]"
            style={{ 
              color: 'transparent', 
              backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%) 0%, hsl(88,92%,35%) 60%)', 
              WebkitBackgroundClip: 'text', 
              backgroundClip: 'text' 
            }}
          >
            Trusted Globally.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10"
        >
          Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-24"
        >
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all duration-300 shadow-md group">
            Get in Touch
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/quality"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground font-semibold text-base transition-all duration-300">
            Our Quality Standards
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {stats.map((s, i) => (
            <div key={i} className="relative group p-5 rounded-2xl bg-card border border-border transition-colors duration-300 hover:border-primary/40 text-center overflow-hidden">
              <div className="text-3xl font-black text-primary mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
