'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Award, Home, Layers, BadgeCheck, ArrowRight, Sparkles, TrendingUp, Users, Leaf, Heart, Globe } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { value: '15+', label: 'Countries' },
    { value: '10+', label: 'Years Experience' },
    { value: '100%', label: 'Family Owned' },
    { value: '4', label: 'Continents' },
    { value: '50+', label: 'Global Partners' },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center pt-32 pb-24 overflow-hidden bg-white">
      <motion.div style={{ y, opacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-primary/30 bg-primary/10 text-primary mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            About Export Optimum
          </span>
        </motion.div>

        {/* Headline — editorial scale */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-[-0.04em] text-foreground"
          >
            Built by Family.
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-[-0.04em]"
            style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%) 0%, hsl(88,92%,35%) 60%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
          >
            Trusted Globally.
          </motion.h1>
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-10"
        >
          Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="flex flex-wrap gap-4 mb-24"
        >
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all duration-300 hover:shadow-[0_0_40px_hsl(88,92%,30%,0.45)] group">
            Get in Touch
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/quality"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground font-semibold text-base transition-all duration-300 backdrop-blur-sm">
            Our Quality Standards
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {stats.map((s, i) => (
            <div key={i} className="relative group p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-400 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at 50% 0%, hsl(88,92%,30%,0.12), transparent 70%)' }} />
              <div className="text-3xl font-black text-primary mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   WHO WE ARE (Redesigned)
───────────────────────────────────────────────────────────── */
const WhoWeAreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 lg:py-36 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Section label */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16">
          <span className="w-8 h-px bg-primary" />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Users className="w-3.5 h-3.5" /> Who We Are
          </span>
        </motion.div>

        {/* Large pull quote */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-foreground mb-12 max-w-5xl"
        >
          Built by the ElYamlahi Family.{' '}
          <span className="text-muted-foreground">Empowered by growers.</span>{' '}
          <span className="text-muted-foreground">Trusted by global buyers.</span>
        </motion.h2>

        {/* Single column text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl text-lg leading-relaxed text-muted-foreground space-y-6 mb-12"
        >
          <p>
            Founded in <strong className="text-foreground">2019</strong> as a family-owned company, Export Optimum is the natural evolution of over <strong className="text-foreground">10 years</strong> of hands-on experience in farm management and international fresh produce supply. Powered by a loyal global customer base, we operate with <strong className="text-foreground">precision planning</strong>, <strong className="text-foreground">strict quality standards</strong>, and <strong className="text-foreground">responsible sourcing</strong> at the core of everything we do.
          </p>
          <p>
            We own two dedicated avocado farms and manage more than <strong className="text-foreground">500 hectares</strong> of production, with exclusive access to major Moroccan farms, giving us direct control over quality, volumes, and long-term supply planning. Today, Export Optimum stands as a <strong className="text-foreground">leading exporter of Moroccan avocados</strong>, serving consumers worldwide, while also supplying fresh berries and premium melons to international markets.
          </p>
        </motion.div>

        {/* Signature quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative border-l-2 border-primary pl-8 py-2 max-w-2xl"
        >
          <p className="text-2xl font-semibold text-foreground leading-snug">
            Export Optimum; fresh produce from our family to yours.
          </p>
        </motion.div>
      </div>
    </section>
  );
};


/* ─────────────────────────────────────────────────────────────
   MISSION (Redesigned)
───────────────────────────────────────────────────────────── */
const MissionSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section ref={ref} className="py-28 lg:py-36 relative bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

                <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 mb-12">
                    <span className="w-8 h-px bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary inline-flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Our Mission</span>
                </motion.div>

                {/* Split layout: title left, statement right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}>
                        <h2 className="text-5xl md:text-6xl font-black leading-[1] tracking-tight text-foreground mb-4">
                            We Grow with
                            <br />
                            <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Purpose</span>
                        </h2>
                         <p className="text-xl text-muted-foreground leading-relaxed">And we bring our partners with us</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.25 }}>
                        <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                            <p>As Export Optimum continues to expand, our mission is clear: to create lasting value across the agribusiness chain while strengthening Morocco's position as a global benchmark for quality fresh produce.</p>
                            <p>We believe responsibility isn't a limitation; it's a <span className="text-primary font-semibold">competitive advantage</span>. We feel and we are responsible for supporting Moroccan growers, social standards, and long-term farming sustainability so that their growth is ethical, resilient, and future-proof.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


/* ─────────────────────────────────────────────────────────────
   VISION (Redesigned)
───────────────────────────────────────────────────────────── */
const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 lg:py-36 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-border">
              <Image
                src="https://images.unsplash.com/photo-1531307983284-88e547343469?q=80&w=2070&auto=format&fit=crop"
                alt="Our Vision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(88,92%,30%,0.3), transparent 70%)' }} />
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Vision</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-foreground mb-5">
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
              <p>We aim to lead the future of fresh produce exports by combining <span className="text-foreground">family-driven values</span>, <span className="text-foreground">sustainable growth</span>, and <span className="text-foreground">operational excellence</span>.</p>
              <p>Creating opportunities for growers, confidence for partners, and trust for consumers worldwide.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


/* ─────────────────────────────────────────────────────────────
   VALUES / ADVANTAGE
───────────────────────────────────────────────────────────── */
const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const values = [
    { icon: Award, number: '01', title: 'Our Own brand : Mavocado', description: "Our exclusive brand, Mavocado, represents the pinnacle of quality, delivering a premium avocado experience to consumers worldwide." },
    { icon: Home, number: '02', title: 'Ownership of two avocado farms', description: 'Direct control over our farms ensures meticulous care, sustainable practices, and consistent quality from the moment the seed is planted.' },
    { icon: Layers, number: '03', title: 'Exclusive Access and management of over 500 hectares', description: 'We manage a vast expanse of avocado groves, guaranteeing a reliable and scalable supply to meet the demands of our global partners.' },
    { icon: BadgeCheck, number: '04', title: 'Premium produce with international norms', description: 'Adhering to the highest global standards, our produce is certified for safety, quality, and traceability, giving you complete peace of mind.' },
  ];

  return (
    <section ref={ref} className="py-28 lg:py-36 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Why Choose Us
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-foreground max-w-xl"
          >
            The Export Optimum{' '}
            <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(135deg, hsl(88,92%,55%), hsl(88,92%,30%))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              Advantage
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 p-8 flex gap-6 items-start"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, hsl(88,92%,30%,0.08), transparent 60%)' }} />

              {/* Number */}
              <div className="flex-shrink-0 text-5xl font-black leading-none text-foreground/5 group-hover:text-foreground/10 transition-colors duration-500 select-none">
                {value.number}
              </div>

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-400">
                  <value.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function AboutUsPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white relative">
        <Header />
        <main className="flex-grow relative z-10">
          {isClient ? (
            <>
              <HeroSection />
              <WhoWeAreSection />
              <MissionSection />
              <VisionSection />
              <ValuesSection />
            </>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <span className="text-muted-foreground text-xl font-light tracking-widest uppercase animate-pulse">Loading</span>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

