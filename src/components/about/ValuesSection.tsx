
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Home, Layers, BadgeCheck, Sparkles } from 'lucide-react';

const values = [
  { icon: Award, title: 'Our Own brand : Mavocado', description: "Our exclusive brand represents the pinnacle of quality, delivering a premium avocado experience." },
  { icon: Home, title: 'Ownership of two avocado farms', description: 'Direct control over our farms ensures meticulous care and sustainable practices.' },
  { icon: Layers, title: 'Management of over 500 hectares', description: 'We manage a vast expanse of avocado groves, guaranteeing a reliable and scalable supply.' },
  { icon: BadgeCheck, title: 'Premium produce with international norms', description: 'Adhering to the highest global standards, our produce is certified for safety and quality.' },
];

const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 lg:py-36 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Why Choose Us
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight text-foreground max-w-xl text-center"
          >
            Why work with {' '}
            <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              Export Optimum
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 flex flex-col items-start transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <value.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
