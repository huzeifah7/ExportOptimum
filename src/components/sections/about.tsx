'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
          <div className="relative lg:col-span-7 h-[420px] rounded-3xl overflow-hidden group shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1543363136-7fbfcd3b240d?q=80&w=1200&auto=format&fit=crop"
              alt="Fresh avocados growing in nature"
              fill
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
          <div className="lg:col-span-5">
            <Badge className="mb-4 uppercase tracking-widest text-xs bg-primary/10 text-primary border-primary/20">
              Our Story
            </Badge>

            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
              From pit to plate,
              <br />
              <span className="text-primary">with purpose</span>
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
              We partner with growers who respect the land, nurture communities,
              and believe great taste starts with responsible farming.
            </p>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-8 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all group"
            >
              <Link href="/about">
                Discover our journey
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
