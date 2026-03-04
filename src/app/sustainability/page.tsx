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
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
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
        {/* HERO SECTION - 100vh for high impact immersion */}
        <section className="h-screen overflow-hidden relative">
          <HeroGeometric 
            badge="Our Sustainability Commitment"
            title1="Growing Together,"
            title2="Thriving Together"
            subtitle="At Export Optimum, sustainability is not a statement; it is a framework that guides how we produce, partner, and operate every day."
          />
        </section>

        {/* IMPACT DASHBOARD - Quantifying our commitment */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:border-primary transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center"
                >
                  <div className="relative w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-all duration-500">
                    <stat.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <div className="text-3xl font-black text-primary mb-2 font-headline">
                    {stat.value}
                  </div>
                  
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest font-prose">
                    {stat.label}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE PILLARS SECTION - Alternating content for engaging rhythm */}
        <section id="pillars" className="py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black mb-6 text-gray-900 tracking-tight">
                Our Four Pillars of <span className="text-primary">Sustainability</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-prose font-light">
                A holistic strategy designed to protect our land, empower our people, and build resilient partnerships.
              </p>
            </motion.div>

            <div className="space-y-32 lg:space-y-48">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Visual Side */}
                  <div className="relative group">
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        data-ai-hint={pillar.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                      
                      {/* Priority Marker */}
                      <div className="absolute top-8 left-8 w-16 h-16 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/50">
                        <span className="text-2xl font-black text-primary">{pillar.number}</span>
                      </div>
                    </div>
                    {/* Decorative accent */}
                    <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                  </div>

                  {/* Narrative Side */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                          <pillar.icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl font-headline font-black text-gray-900 tracking-tight leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-lg text-primary font-bold font-headline tracking-widest uppercase text-sm">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-prose font-light">
                      <p className="relative">
                        {pillar.description}
                      </p>
                      {pillar.secondParagraph && (
                        <p className="pt-6 border-t border-gray-100 italic text-base">
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

        {/* VISUAL STORYTELLING - Dome Gallery */}
        <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                <CheckCircle className="w-4 h-4" />
                Commitment in Action
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black mb-6 text-gray-900 tracking-tight">
                Our Journey in <span className="text-primary">Pictures</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-prose font-light">
                A visual overview of our sustainable practices and social impact efforts.
              </p>
            </motion.div>

            <div className="h-[75vh] md:h-[85vh] w-full rounded-[3rem] overflow-hidden bg-white shadow-3xl ring-1 ring-black/5">
              {isLoadingGallery ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Visuals</p>
                  </div>
                </div>
              ) : (
                <DomeGallery 
                  images={galleryImages || []} 
                  grayscale={false} 
                  overlayBlurColor="rgba(255, 255, 255, 0.7)" 
                />
              )}
            </div>
          </div>
        </section>

        {/* PARTNERSHIP CTA - The final word */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] bg-primary p-12 md:p-20 text-center overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl" />
              
              <div className="relative z-10 space-y-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto border-2 border-white/30 backdrop-blur-sm shadow-xl">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-headline font-black text-white tracking-tight">
                  Cultivate a Sustainable Partnership
                </h2>
                
                <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto font-prose font-light leading-relaxed">
                  Join a supply chain that values the planet and its people as much as the produce it delivers.
                </p>
                
                <div className="pt-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-primary font-black text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Partner with Us
                    <Target className="w-5 h-5" />
                  </Link>
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
