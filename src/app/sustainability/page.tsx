
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Users, Globe, Shield, Handshake, Heart, Droplets, Leaf, Sun, BookOpen, Home, Award, CheckCircle, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import DomeGallery from '@/components/ui/dome-gallery';
import { Skeleton } from '@/components/ui/skeleton';

const pillars = [
  {
    number: '01',
    icon: Users,
    title: 'People',
    subtitle: 'Empowering Individuals, Strengthening Communities',
    description: 'Our responsibility begins with our people. All our policies are fully aligned with human rights principles and Moroccan labor laws, ensuring fair wages, safe working conditions, and comprehensive health and safety measures. We maintain a zero-tolerance policy toward child labor, harassment, and all forms of modern slavery.',
    secondParagraph: 'Beyond our teams, we actively support local communities by creating sustainable employment opportunities and investing in social initiatives. We have proudly founded and we regularly donate to a national NGO and association: Al Wed wa Rahma dedicated to education, providing academic support, parallel classes, and essential learning resources—particularly for orphaned children and teenagers.',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1200&auto=format&fit=crop',
    imageAlt: 'Community members working together',
    ngoHighlight: true
  },
  {
    number: '02',
    icon: Globe,
    title: 'Planet',
    subtitle: 'Farming in Sync with Nature',
    description: 'At Export Optimum, environmental stewardship is central to how we operate. The raw materials we source are cultivated in alignment with natural cycles, with a strong focus on soil health, biodiversity, renewable energy and sustainable agricultural practices.',
    secondParagraph: 'Water conservation is also one of our critical priorities. We are fully aware of the growing pressures of climate change, we ensure that our suppliers apply rigorous standards of water stewardship, using clean water resources responsibly and we use water sustainably throughout the production process.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop',
    imageAlt: 'Sustainable farming landscape'
  },
  {
    number: '03',
    icon: Shield,
    title: 'Ethics',
    subtitle: 'Transparency, Integrity, Respect and Accountability',
    description: 'The sustainability policy Export Optimum adopts reflects a clear commitment to ethical conduct across our entire value chain. We strive to align fully with the United Nations Sustainable Development Goals (SDGs), promoting a production model that is both sustainable and ethically grounded.',
    secondParagraph: 'To reinforce this commitment, we have established a robust Ethical Charter and Code of Business Conduct, a framework that defines the ethical standards that guide our teams, govern our supplier relationships, and shape every business interaction, strengthening further our values of transparency, accountability, respect and integrity.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop',
    imageAlt: 'Business ethics and transparency'
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Suppliers',
    subtitle: 'Responsible Partnerships Built to Last',
    description: 'At Export Optimum we establish partnerships with our suppliers based not only on quality and price, but also on their environmental, social, and ethical performance. Clear criteria guide our partnerships, particularly regarding labor practices, environmental stewardship, and compliance.',
    secondParagraph: 'For every supplier, we maintain detailed documentation covering product origin, cultivation methods, laboratory analyses, audits, and certifications. Beyond compliance, we believe in empowering our partners through collaboration, knowledge sharing, and open communication ensuring that we grow together within a responsible and sustainable ecosystem.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&auto=format&fit=crop',
    imageAlt: 'Partnership and collaboration'
  },
];

const impactStats = [
  { icon: Users, value: '100%', label: 'Fair Wages' },
  { icon: Home, value: 'Zero', label: 'Child Labor' },
  { icon: Droplets, value: '100%', label: 'Water Stewardship' },
  { icon: Sun, value: 'Renewable', label: 'Energy Focus' },
  { icon: BookOpen, value: 'Al Wed wa Rahma', label: 'NGO Partner' },
  { icon: Award, value: 'UN SDGs', label: 'Aligned' },
];

type SustainabilityImage = {
  src: string;
  alt: string;
};

export default function SustainabilityPage() {
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  
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
        {/* Hero Section */}
        <section ref={heroRef} className="relative bg-gradient-to-b from-green-50 to-white pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[hsl(88,92%,30%)]/30 text-[hsl(88,92%,30%)] rounded-full text-sm font-bold mb-8 shadow-sm">
                <Leaf className="w-5 h-5" />
                Our Sustainability Commitment
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold mb-8 text-gray-900 leading-tight">
                Growing Together,
                <br />
                <span className="text-[hsl(88,92%,30%)]">Thriving Together</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-4xl mx-auto">
                At Export Optimum, sustainability is not a statement; it is a <strong className="text-gray-900">framework</strong> that guides how we produce, partner, and operate every day.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a 
                  href="#pillars" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-[hsl(88,92%,30%)] text-white font-bold rounded-xl hover:bg-[hsl(88,92%,25%)] transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                >
                  Explore Our Approach
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-3 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 text-lg shadow-lg"
                >
                  Partner With Us
                </a>
              </div>

              {/* Stats Grid - Modern Design */}
              <div className="w-full max-w-[1400px] mx-auto mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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
                      <div className="text-3xl font-bold text-[hsl(88,92%,30%)] mb-2 relative">
                        {stat.value}
                      </div>
                      
                      {/* Label */}
                      <div className="text-sm font-semibold text-gray-700 leading-tight">
                        {stat.label}
                      </div>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(88,92%,30%)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
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
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
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
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Side */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        className="object-cover"
                        data-ai-hint={pillar.imageAlt}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      
                      {/* Floating Number Badge */}
                      <div className="absolute top-6 left-6 w-16 h-16 bg-[hsl(88,92%,30%)] rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-bold text-white">{pillar.number}</span>
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
                        <p className="text-lg text-[hsl(88,92%,30%)] font-semibold">
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* First Paragraph */}
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    {/* Second Paragraph */}
                    {pillar.secondParagraph && (
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {pillar.secondParagraph}
                      </p>
                    )}

                    {/* NGO Highlight Card (Only for People pillar) */}
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Dome Gallery Section */}
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
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        A visual tour of our commitment to people, the planet, and ethical partnerships.
                    </p>
                </motion.div>

                <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
                    {isLoadingGallery ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Skeleton className="w-4/4 h-3/4 rounded-full" />
                        </div>
                    ) : (
                        <DomeGallery images={galleryImages || []} grayscale={false} />
                    )}
                </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
