
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 lg:py-36 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-border bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1651844101377-13fcd9082f1c?q=80&w=800&auto=format&fit=crop"
                alt="Our Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={75}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(88,92%,30%,0.1), transparent 70%)' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Vision</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight text-foreground mb-5">
              Becoming a
              <br />
              <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Global Reference
              </span>
            </h2>

            <p className="text-2xl font-semibold text-muted-foreground mb-8 leading-tight">
              For Moroccan premium fresh produce
            </p>

            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>We aim to lead the future of fresh produce exports by combining family-driven values sustainable growth, and operational excellence.</p>
              <p>Creating opportunities for growers and trust for consumers worldwide.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
