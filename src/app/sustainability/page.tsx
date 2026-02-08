
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Leaf, Recycle, Sun, Droplets, Wind, Globe, Loader2, Heart, Users, Handshake, GraduationCap, Home, Sprout } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// Social Impact Data
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

// Environmental Data
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sustainabilityGallery'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: images, isLoading } = useCollection<SustainabilityImage>(galleryQuery);

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Clean, No Background Images */}
        <section className="pt-24 pb-20 lg:pt-32 lg:pb-28 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border-2 border-primary/20 text-primary rounded-full text-sm font-bold mb-8 shadow-sm">
                <Heart className="w-5 h-5" />
                People & Planet First
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold mb-8 text-foreground leading-tight">
                Growing Together,
                <br />
                <span className="text-primary">Thriving Together</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
                Our sustainability is built on a simple truth: healthy communities and a healthy planet go hand in hand. We invest in people to create lasting positive change.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a 
                  href="#impact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                >
                  See Our Impact
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-background border-2 border-foreground text-foreground font-bold rounded-xl hover:bg-foreground hover:text-background transition-all duration-300 text-lg shadow-lg"
                >
                  Partner With Us
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: '500+', label: 'Families Supported' },
                  { value: '200+', label: 'Students Educated' },
                  { value: '100%', label: 'Fair Wages' },
                  { value: '60%', label: 'Women Workforce' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-background rounded-2xl p-6 shadow-lg border-2 border-primary/10"
                  >
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement - Clean Background */}
        <section className="py-20 lg:py-28 bg-background border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-8 text-foreground max-w-3xl mx-auto leading-tight">
                Building Communities, Protecting Nature
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                We're not just growing avocados—we're cultivating opportunities, nurturing communities, and building a sustainable future where both people and the planet thrive. Every decision we make considers the wellbeing of our workers, their families, and the environment we all share.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Social Impact Section */}
        <section id="impact" className="py-20 lg:py-28 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border-2 border-primary/20 text-primary rounded-full text-sm font-bold mb-6 shadow-sm">
                <Heart className="w-5 h-5" />
                Social Impact Programs
              </div>
              
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-foreground">
                Empowering Communities
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Creating lasting positive change through programs that support education, healthcare, fair employment, and community development.
              </p>
            </motion.div>

            {/* Impact Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {socialImpactInitiatives.map((initiative, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-background rounded-2xl p-8 shadow-lg border-2 border-border hover:border-primary hover:shadow-2xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <initiative.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {initiative.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {initiative.description}
                  </p>

                  {/* Impact Metric */}
                  <div className="pt-4 border-t-2 border-border">
                    <div className="text-lg font-bold text-primary">
                      {initiative.impact}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Environmental Section */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/5 border-2 border-primary/20 text-primary rounded-full text-sm font-bold mb-6 shadow-sm">
                <Leaf className="w-5 h-5" />
                Environmental Commitment
              </div>
              
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-foreground">
                Protecting Our Planet
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Sustainable practices that minimize environmental impact and preserve resources for future generations.
              </p>
            </motion.div>

            {/* Environmental Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {environmentalCommitments.map((commitment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-muted/50 to-background rounded-2xl p-8 text-center shadow-lg border-2 border-border hover:shadow-2xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <commitment.icon className="w-10 h-10 text-primary" />
                  </div>

                  {/* Stat */}
                  <div className="text-5xl font-bold text-primary mb-3">
                    {commitment.stat}
                  </div>

                  {/* Label */}
                  <div className="text-xl font-bold text-foreground mb-3">
                    {commitment.label}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {commitment.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 lg:py-28 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-background border-2 border-primary/20 text-primary rounded-full text-sm font-bold mb-6 shadow-sm">
                <Users className="w-5 h-5" />
                Our Community
              </div>
              
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-foreground">
                Stories from the Field
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Real people, real impact. See how our programs transform lives and communities.
              </p>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({length: 8}).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
                ))}
              </div>
            )}
            
            {/* Gallery Grid */}
            {images && images.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                    className="group aspect-square relative overflow-hidden rounded-2xl shadow-lg border-2 border-border hover:border-primary transition-all duration-300"
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                  >
                    <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="text-primary-foreground font-semibold text-sm">{image.alt}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Empty State */}
            {!isLoading && (!images || images.length === 0) && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 text-foreground">Gallery Coming Soon</h3>
                <p className="text-muted-foreground">Check back to see stories and images from our communities.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-8">
                <Handshake className="w-10 h-10 text-primary-foreground" />
              </div>
              
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-background">
                Partner With Us for Change
              </h2>
              
              {/* Description */}
              <p className="text-xl text-background/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                Join us in creating sustainable livelihoods and protecting the environment. Together, we can make a real difference in the lives of farming communities and the health of our planet.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 text-lg shadow-xl"
                >
                  Get Involved
                </a>
                <a 
                  href="/about" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-bold rounded-xl hover:bg-muted transition-all duration-300 text-lg shadow-xl"
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
  );
}
