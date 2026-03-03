
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Users, Globe, Shield, Handshake, Heart, Droplets, Leaf, Sun, BookOpen, Home, Award, CheckCircle, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DomeGallery = dynamic(() => import('@/components/ui/dome-gallery'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-full" />
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
    image: 'https://images.unsplash.com/photo-1634638022229-5a52221886dc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    image: 'https://images.unsplash.com/photo-1634638022229-5a52221886dc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 });
  
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
        {/* Hero Section - Exactly 100vh */}
        <div className="h-screen overflow-hidden">
          <HeroGeometric 
            badge="Our Sustainability Commitment"
            title1="Growing Together,"
            title2="Thriving Together"
            subtitle="At Export Optimum, sustainability is not a statement; it is a framework that guides how we produce, partner, and operate every day."
          />
        </div>

        {/* Impact Stats Section - Minimized spacing */}
        <section ref={statsRef} className="py-8 bg-white relative z-10 -mt-8 sm:-mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md border border-gray-100 hover:border-[hsl(88,92%,30%)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative w-10 h-10 bg-[hsl(88,92%,30%)]/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-[hsl(88,92%,30%)] transition-all duration-500">
                    <stat.icon className="w-5 h-5 text-[hsl(88,92%,30%)] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="text-xl font-bold text-[hsl(88,92%,30%)] mb-0.5 text-center">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Pillars Section - Tighter layouts */}
        <section id="pillars" className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-3 text-gray-900">
                Our Four Pillars of <span className="text-[hsl(88,92%,30%)]">Sustainability</span>
              </h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                A framework guiding every decision we make.
              </p>
            </motion.div>

            <div className="space-y-16">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        data-ai-hint={pillar.imageHint}
                      />
                      <div className="absolute top-3 left-3 w-10 h-10 bg-[hsl(88,92%,30%)] rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">{pillar.number}</span>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[hsl(88,92%,30%)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <pillar.icon className="w-5 h-5 text-[hsl(88,92%,30%)]" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-headline font-bold text-gray-900">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-[hsl(88,92%,30%)] font-semibold">
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {pillar.description}
                      </p>
                      {pillar.secondParagraph && (
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                          {pillar.secondParagraph}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dome Gallery Section - Compact gallery */}
        <section className="py-12 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-headline font-bold mb-2 text-gray-900">
                        Our Journey in Pictures
                    </h2>
                    <p className="text-sm text-gray-600 max-w-xl mx-auto">
                        Visualizing our commitment to people, planet, and ethical partnerships.
                    </p>
                </motion.div>

                <div className="h-[50vh] relative w-full">
                    {isLoadingGallery ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Skeleton className="w-48 h-48 rounded-full" />
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
