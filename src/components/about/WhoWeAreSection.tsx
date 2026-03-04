'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users } from 'lucide-react';
import Image from 'next/image';

const WhoWeAreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 lg:py-36 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={isInView ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-[0.2em] text-primary">
                <Users className="w-4.5 h-4.5" /> Who We Are
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight text-foreground mb-8">
              Built by the El Yamlahi Family. <span className="text-primary" style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Empowered by growers. Trusted by global buyers.</span>
            </h2>

            <div className="text-lg leading-relaxed text-muted-foreground space-y-6 mb-10">
              <p>
                Founded in 2019 as a family-owned company, Export Optimum is the natural evolution of over 10 years of hands-on experience in farm management and international fresh produce supply.
              </p>
              <p>
                Powered by a loyal global customer base, we operate with precision planning, strict quality standards, and responsible sourcing at the core of everything we do.
              </p>
              <p>
                Today, Export Optimum stands as a leading exporter of Moroccan avocados, consumers worldwide and supplying fresh berries and premium melons to international markets ; and to further strengthen our global presence and streamline regional operations, we proudly operate a fully established subsidiary in Lebanon: <b>Export Optimum Lebanon</b>. This strategic branch allows us to facilitate supply across the Middle East and enhance distribution efficiency to key markets worldwide.
              </p>
            </div>

            <div className="relative border-l-2 border-primary pl-8 py-2">
              <p className="text-xl font-semibold text-foreground leading-snug">
                Export Optimum; fresh produce from our family to yours.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={isInView ? { opacity: 1, scale: 1 } : {}} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-gray-100"
          >
            <Image
              src="https://images.unsplash.com/photo-1687531419936-c53671275e35?q=80&w=800&auto=format&fit=crop"
              alt="Hands holding fresh avocados"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              data-ai-hint="avocado hands"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;