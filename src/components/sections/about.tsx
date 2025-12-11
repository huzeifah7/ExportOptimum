'use client';

import { ArrowRight, CheckCircle, Leaf, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const highlightPoints = [
  { icon: CheckCircle, text: 'Certified Quality' },
  { icon: Leaf, text: 'Sustainable Practices' },
  { icon: Globe, text: 'Global Export Expertise' },
];

export default function About() {
  return (
    <motion.section
      id="about"
      className="py-20 lg:py-32 bg-gray-50/50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Collage Section */}
          <motion.div
            className="relative h-96 lg:h-[500px]"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -10 }}
              whileInView={{ opacity: 1, y: 0, rotate: -4 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-0 left-0 w-3/5 h-auto rounded-xl overflow-hidden shadow-2xl group"
            >
              <Image
                src="/avocad3.avif"
                alt="Lush avocado orchard"
                width={400}
                height={300}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint="avocado orchard"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute bottom-0 right-0 w-2/3 h-auto rounded-xl overflow-hidden shadow-2xl group"
            >
              <Image
                src="/Avocadooo.jpg"
                alt="A close up of a ripe avocado"
                width={400}
                height={400}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint="ripe avocado"
              />
            </motion.div>
          </motion.div>

          {/* Text Content Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
              Rooted in Excellence, Grown for the World.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Export Optimum is a cornerstone of Morocco's fresh produce industry, specializing in the cultivation and global export of premium avocados. Our vertically integrated operation, from meticulous orchard management to our state-of-the-art packing facility, ensures unparalleled quality and traceability.
            </p>
            
            <div className="mt-8 space-y-4">
              {highlightPoints.map((point, index) => (
                <motion.div 
                    key={point.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                    className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                    <point.icon className="h-5 w-5" />
                  </div>
                  <span className="text-md font-semibold text-foreground">{point.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/about">
                <AnimatedButton label="Discover Our Story" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
