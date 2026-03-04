
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Users, Globe, Shield, Handshake, Droplets, Leaf, 
  Home, Target, MessageSquare, CheckCircle, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic imports for high-impact components
const DomeGallery = dynamic(() => import('@/components/ui/dome-gallery'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-3xl" />
});

const HeroGeometric = dynamic(() => import('@/components/ui/shape-landing-hero').then(mod => mod.HeroGeometric), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-white" />
});

const pillars = [
  {
    number: '01',
    icon: Users,
    title: 'People',
    subtitle: 'Empowering Individuals, Strengthening Communities',
    description: 'Our responsibility begins with our people. All our policies are fully aligned with human rights principles and Moroccan labor laws, ensuring fair wages, safe working conditions, and comprehensive health and safety measures. We maintain a zero-tolerance policy toward child labor, harassment, and all forms of modern slavery.',
    secondParagraph: 'Beyond our teams, we actively support local communities by creating sustainable employment opportunities and investing in social initiatives. We have proudly founded and we regularly donate to a national NGO and association: Al Wed wa Rahma dedicated to education, providing academic support, parallel classes, and essential learning resources—particularly for orphaned children and teenagers.',
    image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Community and people working together',
    imageHint: 'community people'
  },
  {
    number: '02',
    icon: Globe,
    title: 'Planet',
    subtitle: 'Farming in Sync with Nature',
    description: 'At Export Optimum, environmental stewardship is central to how we operate. The raw materials we source are cultivated in alignment with natural cycles, with a strong focus on soil health, biodiversity, renewable energy and sustainable agricultural practices.',
    secondParagraph: 'Water conservation is also one of our critical priorities. We are fully aware of the growing pressures of climate change, we ensure that our suppliers apply rigorous standards of water stewardship, using clean water resources responsibly and we use water sustainably throughout the production process.',
    image: 'https://images.unsplash.com/photo-1720855544264-5a639a985096?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Sustainable agriculture and environment',
    imageHint: 'sustainable planet'
  },
  {
    number: '03',
    icon: Shield,
    title: 'Ethics',
    subtitle: 'Transparency, Integrity, Respect and Accountability',
    description: 'The sustainability policy Export Optimum adopts reflects a clear commitment to ethical conduct across our entire value chain. We strive to align fully with the United Nations Sustainable Development Goals (SDGs), promoting a production model that is both sustainable and ethically grounded.',
    secondParagraph: 'To reinforce this commitment, we have established a robust Ethical Charter and Code of Business Conduct, a framework that defines the ethical standards that guide our teams, govern our supplier relationships, and shape every business interaction, strengthening further our values of transparency, accountability, respect and integrity.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Ethical business meeting and transparency',
    imageHint: 'business ethics'
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Suppliers',
    subtitle: 'Responsible Partnerships Built to Last',
    description: 'At Export Optimum we establish partnerships with our suppliers based not only on quality and price, but also on their environmental, social, and ethical performance. Clear criteria guide our partnerships, particularly regarding labor practices, environmental stewardship, and compliance.',
    secondParagraph: 'For every supplier, we maintain detailed documentation covering product origin, cultivation methods, laboratory analyses, audits, and certifications. Beyond compliance, we believe in empowering our partners through collaboration, knowledge sharing, and open communication ensuring that we grow together within a responsible and sustainable ecosystem.',
    image: 'https://images.unsplash.com/photo-1634638022229-5a52221886dc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Fresh produce and sourcing quality',
    imageHint: 'fresh produce'
  },
];

const impactStats = [
  { icon: Users, value: '100%', label: 'Fair Wages' },
  { icon: Home, value: 'Zero', label: 'Child Labor' },
  { icon: Droplets, value: '100%', label: 'Water Stewardship' },
  { icon: Shield, value: '100%', label: 'Traceability' },
  { icon: Leaf, value: 'Focus', label: 'Soil Health' },
  { icon: Handshake, value: 'Active', label: 'Ethical Standards' },
];

type SustainabilityImage = {
  id: string;
  src: string;
  alt: string;
};

export default function SustainabilityPage() {
  const [isClient, setIsClient] = useState(false);
  const firestore = useFirestore();

  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'sustainabilityGallery');
  }, [firestore]);

  const { data: galleryImages, isLoading: isLoadingGallery } = useCollection<SustainabilityImage>(galleryQuery);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="h-screen overflow-hidden relative">
          <HeroGeometric 
            badge="Our Sustainability Commitment"
            title1="Growing Together,"
            title2="Thriving Together"
            subtitle="At Export Optimum, sustainability is not a statement; it is a framework that guides how we produce, partner, and operate every day."
          />
        </section>

        {/* Impact Stats Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold font-headline uppercase tracking-widest mb-12 border border-primary/20"
            >
              <MessageSquare className="w-4 h-4" />
              Measurable Impact
            </motion.div>

            {/* Stats Grid - Modern Design */}
            <div className="w-full max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {impactStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-[hsl(88,92%,30%)] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[hsl(88,92%,30%)]/10 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon */}
                    <div className="relative w-14 h-14 bg-[hsl(88,92%,30%)]/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[hsl(88,92%,30%)] transition-all duration-500 group-hover:scale-110">
                      <stat.icon className="w-7 h-7 text-[hsl(88,92%,30%)] group-hover:text-white transition-colors duration-500" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-3xl font-bold text-[hsl(88,92%,30%)] mb-2 relative font-headline">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm font-semibold text-gray-700 leading-tight font-prose">
                      {stat.label}
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(88,92%,30%)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Four Pillars Section */}
        <section id="pillars" className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-gray-900">
                Our Four Pillars of{' '}
                <span className="text-[hsl(88,92%,30%)]">Sustainability</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-prose">
                A comprehensive framework that guides every decision we make
              </p>
            </motion.div>

            {/* Pillars */}
            <div className="space-y-32">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
                >
                  {/* Image Side */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        data-ai-hint={pillar.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      
                      {/* Floating Number Badge */}
                      <div className="absolute top-6 left-6 w-16 h-16 bg-[hsl(88,92%,30%)] rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-bold text-white font-headline">{pillar.number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[hsl(88,92%,30%)]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <pillar.icon className="w-8 h-8 text-[hsl(88,92%,30%)]" />
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-headline font-bold text-gray-900">
                          {pillar.title}
                        </h3>
                        <p className="text-lg text-[hsl(88,92%,30%)] font-semibold font-headline">
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description Paragraphs */}
                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-prose">
                      <p>{pillar.description}</p>
                      {pillar.secondParagraph && <p>{pillar.secondParagraph}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Gallery Section */}
        <section className="py-20 lg:py-28 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-gray-900">
                        Our Journey in Pictures
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-prose">
                        A visual tour of our commitment to people, the planet, and ethical partnerships.
                    </p>
                </motion.div>

                {/* Immensive 100vh Gallery */}
                <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
                    {isLoadingGallery ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Skeleton className="w-3/4 h-3/4 rounded-full" />
                        </div>
                    ) : (
                        <DomeGallery images={galleryImages || []} grayscale={false} />
                    )}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                
                {/* Left Side - Content */}
                <div className="relative bg-gradient-to-br from-[hsl(88,92%,35%)] to-[hsl(88,92%,25%)] p-12 lg:p-16 flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
                      <Leaf className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Let's Grow Together
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-headline font-black text-white mb-6 leading-tight tracking-tight">
                      Cultivate a Sustainable Partnership
                    </h2>
                    
                    <p className="text-lg text-white/90 font-light leading-relaxed mb-8 font-prose">
                      Join a supply chain that values the planet and its people as much as the produce it delivers.
                    </p>

                    <div className="space-y-3 mb-8">
                      {[
                        'Direct farm partnerships',
                        'Full traceability systems',
                        'Sustainable practices',
                        'Global reach & reliability'
                      ].map((feature, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-white/90 font-medium text-sm font-prose">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Link 
                      href="/contact" 
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[hsl(88,92%,30%)] font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Partner with Us
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-12 lg:p-16 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div style={{
                      backgroundImage: 'radial-gradient(circle, hsl(88,92%,30%) 1.5px, transparent 1.5px)',
                      backgroundSize: '30px 30px'
                    }} className="w-full h-full" />
                  </div>

                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="relative w-64 h-64 md:w-80 md:h-80"
                    >
                      <div className="absolute inset-0 rounded-full border-4 border-[hsl(88,92%,30%)]/20" />
                      <div className="absolute inset-8 rounded-full border-2 border-[hsl(88,92%,30%)]/30" />
                      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[hsl(88,92%,35%)] to-[hsl(88,92%,25%)] flex items-center justify-center shadow-2xl">
                        <Leaf className="w-20 h-20 md:w-24 md:h-24 text-white" />
                      </div>

                      <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 right-8 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100"
                      >
                        <Globe className="w-8 h-8 text-[hsl(88,92%,30%)]" />
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute -bottom-4 left-8 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100"
                      >
                        <Users className="w-8 h-8 text-blue-500" />
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/2 -left-4 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100"
                      >
                        <Shield className="w-8 h-8 text-amber-500" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-[hsl(88,92%,40%)] rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
