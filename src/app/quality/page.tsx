
'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, PackageCheck, Truck, Microscope, CheckCircle, Award, Sparkles, ArrowRight, Globe, BadgeCheck, MapPin, Calendar, Snowflake, CalendarCheck, MessagesSquare } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';
import MagicBento from '@/components/ui/MagicBento';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const processSteps = [
  {
    icon: Leaf,
    title: 'Cultivation & Growing',
    description: 'Situated at the heart of all operations amid vast stretches of fertile farms ; Export optimum manages farms operated under water-efficient irrigation systems and sustainable agricultural practices. This disciplined approach ensures stable production volumes and consistent quality, season after season.',
  },
  {
    icon: CalendarCheck,
    title: 'Precision Harvesting for Export-Grade Freshness',
    description: 'At Export Optimum, we believe harvesting is not a moment ; it is a calibrated operation. Our harvesting teams are trained to work with speed, care, and selectivity, ensuring each avocado, melon, and berry is picked within a precisely defined maturity window based on varietal standards, dry matter levels, and export-market requirements.',
  },
  {
    icon: Microscope,
    title: 'Sorting & Selection',
    description: 'Only export-grade produce moves forward . At Export Optimum, every unit undergoes a rigorous combination of visual and mechanical inspections to assess size uniformity, firmness, and cosmetic integrity. Our teams are trained to identify even minor defects that could compromise shelf life or presentation ; allowing us to deliver excellence at every stage of the supply chain.',
  },
  {
    icon: PackageCheck,
    title: 'Packing',
    description: 'Engineered for Protection and Compliance : At Export Optimum, we ensure hygienic handling, precise labeling, and full traceability in strict compliance with both international and national regulations. Each unit is packed according to destination-market specifications and client-defined packaging requirements, preserving freshness, protecting structural integrity, and enabling seamless customs clearance.',
  },
  {
    icon: Truck,
    title: 'Export Logistics',
    description: 'Masterful Export Logistics ; At Export Optimum we don’t just merely move freight; we orchestrate a symphony of precision ,from the initial load to the final destination, our seamless coordination with premier global carriers ensures safe delivery on time every time. Thanks to our expert team we handle logistics with the sophistication and precision our clients deserve.',
  },
  {
    icon: MessagesSquare,
    title: 'Communication Beyond the Sale',
    description: 'Export Optimum, our commitment doesn’t end once the shipment is booked or delivered. We maintain clear, proactive communication throughout the entire process, addressing concerns and offering support whenever it’s needed. Our team remains readily available to provide guidance, timely updates, and solution ensuring our clients feel informed, supported, and confident from start to finish.',
  }
];

type Certification = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
}

export default function QualityPage() {
  const [isClient, setIsClient] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const certsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'qualityCertifications');
  }, [firestore]);

  const { data: certifications, isLoading } = useCollection<Certification>(certsQuery);

  return (
    <>
      {isClient ? (
        <div className="flex flex-col min-h-screen">
            
            <Header />
            
            <main className="flex-grow">
              {/* Hero Section */}
              <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32  flex items-center justify-center text-white overflow-hidden ">
                <Image
                    src="/BGAbout.png"
                    alt="Lush avocado groves"
                    fill
                    className="object-cover -z-10"
                    data-ai-hint="agriculture landscape"
                    priority
                />
                <div className="absolute inset-0 bg-black/15 -z-10" />
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-6"
                  >
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/20">
                      <Award className="w-4 h-4 mr-2" />
                      Our Commitment
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6 leading-tight text-white max-w-5xl mx-auto p-5 " 
                  >
                    At Export Optimum,<span className='text-primary'> Quality</span> is a non-negotiable.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-white/100 max-w-4xl mx-auto mb-10 leading-relaxed"
                  >
                    From orchard to arrival, our quality systems ensure uniformity, freshness, and full compliance, so you receive reliable volumes you can confidently sell forward. Our operations are centered around six uncompromising quality pillars. 
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button asChild size="lg" className="rounded-full px-8 text-base group shadow-lg">
                      <Link href="#certifications" className="flex items-center gap-2">
                        View Certifications
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="rounded-full px-8 text-base border border-white/50 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-foreground transition-all duration-300 shadow-lg">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </motion.div>
                </div>
              </section>

              {/* Quality Pillars Section */}
              <section className="py-20 lg:py-32 bg-primary/5">
                <div className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 px-4"
                  >
                    <div className="inline-block mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Our Standards
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
                      Our Quality{' '}
                      <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Pillars
                      </span>
                    </h2>
                    
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed">
                    Our operations are centered around six uncompromising quality pillars, Our operations are built around six uncompromising quality pillars, designed to protect your supply chain and strengthen our position as your trusted long-term partner.
                    </p>
                  </motion.div>
                  
                  <MagicBento 
                    textAutoHide={false}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="80, 200, 120"
                  />
                </div>
              </section>
              
              {/* Process Timeline Section */}
              <section className="py-20 lg:py-32 relative overflow-hidden bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                  >
                    <div className="inline-block mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                        Our Process
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
                      Premium Avocados, Melons & Fresh Berries: From Export Optimum to the Globe
                    </h2>
                    
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed">
                      From Export Optimum to the Globe : Sourced at peak maturity. Controlled at every stage. Delivered with precision.
                    
                    </p>
                  </motion.div>

                  <div className="relative max-w-5xl mx-auto">
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gray-200/70 rounded-full hidden md:block origin-top" 
                    />
                    
                    <div className="space-y-24 md:space-y-32">
                      {processSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`relative flex flex-col md:flex-row items-center gap-8 ${
                            index % 2 === 1 ? 'md:flex-row-reverse' : ''
                          }`}
                        >
                          <div className="flex-1 w-full">
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white backdrop-blur-xl border-2 border-gray-200 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 p-8 lg:p-10">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-6 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                                {String(index + 1).padStart(2, '0')}
                              </div>

                              <h3 className="font-headline text-2xl lg:text-3xl font-bold tracking-tight mb-4 leading-tight text-gray-900">
                                {step.title}
                              </h3>

                              <p className="text-gray-600 leading-relaxed text-base">
                                {step.description}
                              </p>

                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                              
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          </div>

                          <div className="relative z-10 flex-shrink-0">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                              className="relative"
                            >
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/40 border-4 border-white ring-4 ring-gray-100">
                                <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                              </div>
                              
                              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                            </motion.div>
                          </div>

                          <div className="hidden md:block flex-1" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Certifications Section */}
              <section id="certifications" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                  >
                    <div className="inline-block mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
                        <Award className="w-4 h-4 mr-2" />
                        Certifications
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6">
                      Certified, Verified,{' '}
                      <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Trusted
                      </span>
                    </h2>
                    
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed">
                      Our commitment to international standards is your guarantee of food safety, environmental responsibility, and full traceability. We are proudly certified by globally recognized bodies.
                    </p>
                  </motion.div>

                  {isLoading && (
                    <div className="flex justify-center items-center h-40">
                      <div className="flex gap-4">
                        <Skeleton className="h-32 w-48 rounded-2xl" />
                        <Skeleton className="h-32 w-48 rounded-2xl" />
                        <Skeleton className="h-32 w-48 rounded-2xl" />
                      </div>
                    </div>
                  )}
                  
                  {certifications && certifications.length > 0 && (
                    <Marquee pauseOnHover className="[--duration:60s]">
                      {certifications.map((cert) => (
                        <div 
                          key={cert.id} 
                          className="group relative flex-shrink-0 mx-6"
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-xl border-2 border-gray-200 p-6 w-56 h-40 flex flex-col items-center justify-center transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                            <div className="relative h-20 w-full mb-3">
                              {cert.imageUrl ? (
                                <Image
                                  src={cert.imageUrl}
                                  alt={cert.name}
                                  fill
                                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-foreground/5 rounded-lg flex items-center justify-center">
                                  <Award className="w-10 h-10 text-primary/30" />
                                </div>
                              )}
                            </div>
                            
                            <p className="font-headline text-sm font-bold text-center text-gray-900">
                              {cert.name}
                            </p>

                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                          </div>
                        </div>
                      ))}
                    </Marquee>
                  )}

                  {!isLoading && (!certifications || certifications.length === 0) && (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto text-primary/30 mb-4" />
                      <p className="text-foreground/60">Certification information coming soon</p>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Trust Message Section */}
              <section className="p-8 bg-background">
                <div className="relative bg-primary rounded-3xl p-12 lg:p-20 overflow-hidden shadow-2xl max-w-7xl mx-auto">
                    <div aria-hidden="true" className="absolute -top-20 -right-20 w-52 h-52 bg-white/10 rounded-full opacity-50" />
                    <div aria-hidden="true" className="absolute -bottom-24 -left-16 w-64 h-64 bg-white/10 rounded-full opacity-50" />
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="relative z-10 text-primary-foreground">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 border-2 border-white/30">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-6">
                          Excellence,{' '}
                          <span className="text-white">
                            Delivered
                          </span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
                          Our process is designed for one purpose: to deliver the finest Moroccan produce to our partners with absolute confidence. From our soil to your shelves, we stand by our promise of quality, reliability, and trust.
                        </p>

                        <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-base group shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                          <Link href="/contact" className="flex items-center gap-2">
                            Partner With Us
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
              </section>
            </main>
            
            <Footer />
          </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background">
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
