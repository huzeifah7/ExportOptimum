
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Home, Layers, BadgeCheck, ArrowRight, Sparkles, TrendingUp, Users, Leaf, Heart } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';

// Animated Avocado Background
const AvocadoAnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
      <div className="absolute top-[15%] left-[10%] w-40 h-50 animate-float-slow">
        <svg viewBox="0 0 100 120" className="w-full h-full opacity-15">
          <ellipse cx="50" cy="60" rx="35" ry="45" fill="currentColor" className="text-primary" />
          <ellipse cx="50" cy="55" rx="15" ry="20" fill="currentColor" className="text-primary/40" />
        </svg>
      </div>
      
      <div className="absolute bottom-[20%] right-[15%] w-32 h-40 animate-float-medium">
        <svg viewBox="0 0 100 120" className="w-full h-full opacity-10">
          <ellipse cx="50" cy="60" rx="35" ry="45" fill="currentColor" className="text-primary" />
          <ellipse cx="50" cy="55" rx="15" ry="20" fill="currentColor" className="text-primary/40" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" className="text-primary" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path 
          d="M 0 200 Q 400 100 800 300 T 1600 200" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="2"
          className="animate-draw-line"
        />
        
        <path 
          d="M 0 500 Q 400 600 800 400 T 1600 500" 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="1.5"
          className="animate-draw-line-delayed"
        />
      </svg>
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden text-foreground">
      <Image
        src="/BGAbout.png"
        alt="Lush avocado groves"
        fill
        className="object-cover -z-10"
        data-ai-hint="agriculture landscape"
        priority
      />
      <div className="absolute inset-0 bg-white/20 -z-10"/>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              About Export Optimum
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tight mb-8 leading-tight"
          >
            Built by Family.
            <br />
            <span className="text-primary">
              Trusted Globally.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto mb-10 leading-relaxed"
          >
            Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="rounded-full px-8 text-base group shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/contact" className="flex items-center gap-2">
                Get in Touch
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
              <Link href="/quality">Our Quality Standards</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-20"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { value: '15+', label: 'Countries' },
            { value: '10+', label: 'Years Experience' },
            { value: '100%', label: 'Family Owned' },
            { value: '4', label: 'Continents' },
            { value: '50+', label: 'Global Partners'}
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-background/60 backdrop-blur-xl border border-foreground/10"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// Who We Are Section
const WhoWeAreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                alt="Export Optimum Family"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-xl">
                <p className="text-lg font-semibold text-primary mb-2">Our Promise</p>
                <p className="text-foreground/80">Fresh produce from our family to yours</p>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                <Users className="w-4 h-4 mr-2" />
                Who We Are
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 leading-tight">
              Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers.
            </h2>

            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                Founded in <strong className="text-foreground">2019</strong> as a family-owned company, Export Optimum is the natural evolution of over <strong className="text-foreground">10 years</strong> of hands-on experience in farm management and international fresh produce supply.
              </p>
              <p>
                  We own two dedicated avocado farms and manage more than <strong className="text-foreground">500 hectares</strong> of production, with exclusive access to major Moroccan farms, giving us direct control over quality, volumes, and long-term supply planning.
              </p>
              <p>
                Powered by a loyal global customer base, we operate with <strong className="text-foreground">precision planning</strong>, <strong className="text-foreground">strict quality standards</strong>, and <strong className="text-foreground">responsible sourcing</strong> at the core of everything we do.
              </p>
              <p>
                Today, Export Optimum stands as a <strong className="text-foreground">leading exporter of Moroccan avocados</strong>, serving consumers worldwide, while also supplying fresh berries and premium melons to international markets.
              </p>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <p className="text-xl font-semibold text-foreground">
                Export Optimum; fresh produce from our family to yours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Mission Section
const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const missionPoints = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Lasting Value Creation',
      description: 'Creating lasting value across the agribusiness chain while strengthening Morocco\'s position as a global benchmark.'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Sustainable Growth',
      description: 'Supporting Moroccan growers, social standards, and long-term farming sustainability for ethical and resilient growth.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Social Impact',
      description: 'Giving back to society and investing in agribusiness development to build global impact that benefits all.'
    }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
              Our Mission
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
            We Grow with{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Purpose
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            And we bring our partners with us
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-foreground/10">
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-6">
              As Export Optimum continues to expand, our mission is clear: to create lasting value across the agribusiness chain while strengthening Morocco's position as a global benchmark for quality fresh produce.
            </p>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto mb-6" />
            <p className="text-lg text-foreground/70 leading-relaxed">
              We believe responsibility isn't a limitation; it's a <strong className="text-primary">competitive advantage</strong>. We feel and we are responsible for supporting Moroccan growers, social standards, and long-term farming sustainability so that their growth is ethical, resilient, and future-proof.
            </p>
          </div>
        </motion.div>

        {/* Mission Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missionPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-foreground/10 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{point.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Vision Section
const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                Our Vision
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 leading-tight">
              Becoming a{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Global Reference
              </span>
            </h2>

            <p className="text-2xl font-semibold text-foreground mb-8">
              For Moroccan premium fresh produce
            </p>

            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                We aim to lead the future of fresh produce exports by combining <strong className="text-foreground">family-driven values</strong>, <strong className="text-foreground">sustainable growth</strong>, and <strong className="text-foreground">operational excellence</strong>.
              </p>
              <p>
                Creating opportunities for growers, confidence for partners, and trust for consumers worldwide.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'For Growers', value: 'Opportunities' },
                { label: 'For Partners', value: 'Confidence' },
                { label: 'For Consumers', value: 'Trust' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="text-sm text-foreground/60 mb-1">{item.label}</div>
                  <div className="font-bold text-primary">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1531307983284-88e547343469?q=80&w=2070&auto=format&fit=crop"
                alt="Our Vision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Values Section
const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const values = [
    {
      icon: <Award className="h-7 w-7" />,
      title: 'Our Own brand : Mavocado',
      description: "Our exclusive brand, Mavocado, represents the pinnacle of quality, delivering a premium avocado experience to consumers worldwide.",
    },
    {
      icon: <Home className="h-7 w-7" />,
      title: 'Ownership of two avocado farms',
      description: 'Direct control over our farms ensures meticulous care, sustainable practices, and consistent quality from the moment the seed is planted.',
    },
    {
      icon: <Layers className="h-7 w-7" />,
      title: 'Exclusive Access and management of over 500 hectares',
      description: 'We manage a vast expanse of avocado groves, guaranteeing a reliable and scalable supply to meet the demands of our global partners.',
    },
    {
      icon: <BadgeCheck className="h-7 w-7" />,
      title: 'Premium produce with international norms',
      description: 'Adhering to the highest global standards, our produce is certified for safety, quality, and traceability, giving you complete peace of mind.',
    },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Why Choose Us
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
            The Export Optimum{' '}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Advantage
            </span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            We provide more than advice. We deliver a clear, actionable framework for international success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-foreground/10 transition-all duration-500 hover:border-foreground/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 h-full p-8">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
                  <div className="text-primary">
                    {value.icon}
                  </div>
                </div>

                <h3 className="font-headline text-xl font-bold tracking-tight mb-4 leading-tight">
                  {value.title}
                </h3>

                <p className="text-foreground/70 leading-relaxed text-sm">
                  {value.description}
                </p>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function AboutUsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <AnimatedGradientBackground>
          <div className="flex min-h-screen flex-col bg-transparent relative">
            <AvocadoAnimatedBackground />
            
            <Header />
            
            <main className="flex-grow relative z-10">
              <HeroSection />
              <WhoWeAreSection />
              <MissionSection />
              <VisionSection />
              <ValuesSection />
            </main>
            
            <Footer />
          </div>
        </AnimatedGradientBackground>
      ) : (
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-headline font-bold">Loading...</div>
            </div>
          </main>
          <Footer />
        </div>
      )}
      
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -20px) rotate(5deg); }
          50% { transform: translate(-5px, -10px) rotate(-3deg); }
          75% { transform: translate(-10px, 15px) rotate(3deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-15px, 10px) rotate(-5deg); }
          66% { transform: translate(15px, -15px) rotate(5deg); }
        }
        
        @keyframes draw-line {
          0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          100% { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        
        @keyframes draw-line-delayed {
          0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          100% { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-draw-line {
          animation: draw-line 8s ease-in-out infinite;
        }
        
        .animate-draw-line-delayed {
          animation: draw-line-delayed 8s ease-in-out 2s infinite;
        }
      `}</style>
    </>
  );
}
