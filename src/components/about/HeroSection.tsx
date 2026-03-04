'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ElegantShape } from '@/components/ui/shape-landing-hero';

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
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center pt-32 pb-24 overflow-hidden bg-white">
      {/* Geometric Background shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] blur-3xl pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/[0.08]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-accent/[0.08]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.08]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.08]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      <motion.div style={{ y }} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center">
        <div className="overflow-hidden mb-4 ">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-headline font-black leading-[0.9] tracking-[-0.04em] text-foreground"
          >
            Built by Family.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-headline font-black leading-[0.9] tracking-[-0.04em]"
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
          className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10 mx-auto font-prose font-light"
        >
          Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-24 justify-center"
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
            <div key={i} className="relative group p-5 rounded-2xl bg-white/50 backdrop-blur-sm border border-border transition-colors duration-300 hover:border-primary/40 text-center overflow-hidden shadow-sm">
              <div className="text-3xl font-headline font-black text-primary mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/80 pointer-events-none" />
    </section>
  );
};

export default HeroSection;