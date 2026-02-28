'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import TextAnimation from '@/components/ui/scroll-text';

export default function AboutRedesign() {
  return (
    <section id="about" className="relative py-24 lg:py-36 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* IMAGE SIDE */}
          <div className="relative lg:col-span-6 h-[420px] rounded-3xl overflow-hidden group shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1543363136-7fbfcd3b240d?q=80&w=1200&auto=format&fit=crop"
              alt="Fresh avocados growing in nature"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-6 left-6 text-white text-sm tracking-wide">
              Naturally grown • Responsibly sourced
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div className="lg:col-span-6">
            <Badge className="mb-4 uppercase tracking-widest text-xs bg-primary/10 text-primary border-primary/20">
              Our Story
            </Badge>

            <TextAnimation
              as="h2"
              text="From Our Family, to Yours"
              classname="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight !justify-start"
            />
            
            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
              We are a family-owned business, working hand in hand with growers who honor the land and invest in their communities. Because we believe exceptional produce begins with responsible farming, we have adopted a long-term vision rooted in sustainability, trust, and shared growth to ensure quality that can be felt from the field to the table.
            </p>

            <button
              className="mt-8 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all group px-8 py-3 font-semibold flex items-center gap-2"
              onClick={() => window.location.href = '/about'}
            >
              Discover our journey
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
