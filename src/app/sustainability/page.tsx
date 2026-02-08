
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Leaf, Recycle, Sun, Droplets, Wind, Globe, Loader2, Heart, Users, Handshake, GraduationCap, Home, Sprout } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const socialImpactInitiatives = [
  {
    icon: Users,
    title: 'Community Development',
    description: 'Investing in local communities through education, healthcare, and infrastructure projects that create lasting positive change.',
    impact: '500+ families supported'
  },
  {
    icon: GraduationCap,
    title: 'Education Programs',
    description: 'Providing scholarships, vocational training, and agricultural education to empower the next generation of farmers.',
    impact: '200+ students annually'
  },
  {
    icon: Handshake,
    title: 'Fair Employment',
    description: 'Ensuring fair wages, safe working conditions, and social benefits for all our workers and their families.',
    impact: '100% fair wages'
  },
  {
    icon: Home,
    title: 'Housing Support',
    description: 'Building affordable housing and improving living conditions for farming families in our communities.',
    impact: '50+ homes improved'
  },
  {
    icon: Heart,
    title: 'Healthcare Access',
    description: 'Providing medical services, health insurance, and wellness programs for our workers and local communities.',
    impact: 'Full coverage'
  },
  {
    icon: Sprout,
    title: 'Women Empowerment',
    description: 'Creating opportunities for women in agriculture through leadership training and entrepreneurship programs.',
    impact: '60% women workforce'
  },
];

const environmentalCommitments = [
  {
    icon: Droplets,
    stat: '50%',
    label: 'Water Conservation',
    description: 'Reduced water usage through efficient irrigation'
  },
  {
    icon: Sun,
    stat: '100%',
    label: 'Solar Powered',
    description: 'Operations powered by renewable energy'
  },
  {
    icon: Recycle,
    stat: 'Zero',
    label: 'Waste Goal',
    description: 'Comprehensive recycling and composting'
  },
  {
    icon: Wind,
    stat: '200+',
    label: 'Hectares Protected',
    description: 'Land dedicated to carbon sequestration'
  },
];

type SustainabilityImage = {
  id: string;
  src: string;
  alt: string;
};

export default function SustainabilityPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const impactRef = useRef(null);
  const isImpactInView = useInView(impactRef, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sustainabilityGallery'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: images, isLoading } = useCollection<SustainabilityImage>(galleryQuery);

  return (
    <>
      {isClient ? (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          
          <main className="flex-grow">
            {/* Hero Section - People-Focused */}
            <section ref={heroRef} className="relative bg-white py-20 lg:py-32 overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                      <Heart className="w-4 h-4" />
                      People & Planet
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 text-gray-900 leading-tight">
                      Growing Together,
                      <br />
                      <span className="text-green-600">Thriving Together</span>
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                      Our sustainability journey is about people first. We believe that taking care of our communities, empowering families, and protecting the environment are inseparable paths to a better future.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href="#impact" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        See Our Impact
                      </a>
                      <a 
                        href="/contact" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-green-600 hover:text-green-600 transition-colors"
                      >
                        Partner With Us
                      </a>
                    </div>
                  </motion.div>

                  {/* Image/Visual */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                      {/* Placeholder - replace with actual image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <Users className="w-32 h-32 text-white/30" />
                      </div>
                      {/* Floating Stats */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">500+</div>
                            <div className="text-xs text-gray-600">Families</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">200+</div>
                            <div className="text-xs text-gray-600">Students</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">100%</div>
                            <div className="text-xs text-gray-600">Fair Trade</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Redesigned Commitment Section */}
            <section className="py-20 lg:py-32 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
                        <Globe className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 text-gray-900 leading-tight">
                        Our Commitment to People & Planet
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We're not just growing avocados—we're cultivating opportunities, nurturing communities, and building a sustainable future where both people and the planet can thrive. Every decision we make considers the wellbeing of our workers, their families, and the environment we all share.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <Image 
                        src="https://images.unsplash.com/photo-1593113630424-386b24546422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiaW8lMjBjZXJ0aWZpY2F0aW9ufGVufDB8fHx8fDE3NjQwOTQ4NTh8MA&ixlib-rb-4.1.0&q=80&w=1080" 
                        alt="A hand holding soil with a small green plant, symbolizing sustainability"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint="sustainability growth"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Social Impact Initiatives */}
            <section id="impact" ref={impactRef} className="py-20 lg:py-32 bg-gray-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isImpactInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                    <Heart className="w-4 h-4" />
                    Social Impact
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-gray-900">
                    Empowering Communities
                  </h2>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our social responsibility programs focus on creating lasting positive change in the communities where we operate.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {socialImpactInitiatives.map((initiative, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isImpactInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-500 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                        <initiative.icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {initiative.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-4">
                        {initiative.description}
                      </p>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm font-semibold text-green-600">
                          {initiative.impact}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Environmental Commitments */}
            <section className="py-20 lg:py-32 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                    <Leaf className="w-4 h-4" />
                    Environmental Stewardship
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-gray-900">
                    Protecting Our Planet
                  </h2>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We implement sustainable practices that minimize our environmental footprint and preserve resources for future generations.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {environmentalCommitments.map((commitment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gray-50/50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <commitment.icon className="w-8 h-8 text-green-600" />
                      </div>

                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {commitment.stat}
                      </div>

                      <div className="text-lg font-semibold text-gray-900 mb-3">
                        {commitment.label}
                      </div>

                      <div className="text-sm text-gray-600">
                        {commitment.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            <section className="py-16 lg:py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                    <Users className="w-4 h-4" />
                    Our Community
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-gray-900">
                    Stories from the Field
                  </h2>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    See the real impact of our work through the people and places we serve.
                  </p>
                </div>
                
                {(isLoading || !isClient) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({length: 8}).map((_, i) => (
                          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                      ))}
                  </div>
                )}
                
                {isClient && !isLoading && images && images.length > 0 && (
                   <motion.div 
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } }
                        }}
                    >
                        {images.map(image => (
                            <motion.div 
                                key={image.id} 
                                className="group aspect-square relative overflow-hidden rounded-2xl shadow-lg"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <Image 
                                    src={image.src} 
                                    alt={image.alt} 
                                    fill 
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                  <p className="text-white text-center text-sm">{image.alt}</p>
                                </div>
                            </motion.div>
                        ))}
                   </motion.div>
                )}
                
                {isClient && !isLoading && (!images || images.length === 0) && (
                  <div className="text-center py-20 text-gray-600">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-headline font-bold mb-4">Gallery Coming Soon</h3>
                    <p>Check back to see stories and images from our communities.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 lg:py-32 bg-gray-900 text-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <Handshake className="w-16 h-16 mx-auto mb-6 text-green-500" />
                  
                  <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
                    Partner With Us for Change
                  </h2>
                  
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                    Join us in creating sustainable livelihoods and protecting the environment. Together, we can make a real difference in the lives of farming communities and the health of our planet.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-lg"
                    >
                      Get Involved
                    </a>
                    <a 
                      href="/about" 
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-green-500 hover:text-green-500 transition-colors text-lg"
                    >
                      Learn More
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-headline font-bold">Loading...</div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
