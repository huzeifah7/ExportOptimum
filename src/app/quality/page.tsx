
'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, PackageCheck, Truck, Microscope, CheckCircle, ShieldCheck, Thermometer, GitBranch, Sprout, HandHelping } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Marquee from '@/components/ui/marquee';

const qualityPillars = [
    {
        icon: <Thermometer className="w-8 h-8 text-primary" />,
        title: 'Freshness',
        description: 'An unbroken cold chain and rapid logistics ensure our produce arrives as fresh as the day it was picked.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: 'Hygiene & Safety',
        description: 'We adhere to strict international hygiene protocols at every stage, from handling to packing.',
    },
    {
        icon: <GitBranch className="w-8 h-8 text-primary" />,
        title: 'Traceability',
        description: 'Every batch is fully traceable, providing complete transparency from our orchards to your facility.',
    },
     {
        icon: <Sprout className="w-8 h-8 text-primary" />,
        title: 'Sustainability',
        description: 'Responsible farming practices that respect the land, conserve water, and support our ecosystem.',
    },
    {
        icon: <HandHelping className="w-8 h-8 text-primary" />,
        title: 'Professional Handling',
        description: 'Our trained teams handle produce with the utmost care to prevent bruising and maintain perfect condition.',
    },
    {
        icon: <PackageCheck className="w-8 h-8 text-primary" />,
        title: 'Advanced Packing',
        description: 'Our modern facilities use precision technology to sort, grade, and pack produce for optimal protection.',
    },
];

const processSteps = [
  {
    icon: Leaf,
    title: 'Cultivation & Growing',
    description: 'In the fertile Gharb-Loukkos region, our 200+ hectares of orchards are cultivated using modern, water-efficient irrigation and sustainable farming practices.',
  },
  {
    icon: HandHelping,
    title: 'Harvesting',
    description: 'Each avocado is hand-picked at its optimal maturity by our skilled teams, ensuring peak flavor and a longer shelf life.',
  },
  {
    icon: Microscope,
    title: 'Sorting & Selection',
    description: 'Upon arrival at our packing station, every piece of fruit undergoes rigorous manual and mechanical inspection for quality, size, and firmness.',
  },
  {
    icon: Thermometer,
    title: 'Cooling & Storage',
    description: 'Produce is immediately moved to our advanced, temperature-controlled cold rooms, initiating an unbroken cold chain to preserve freshness.',
  },
  {
    icon: PackageCheck,
    title: 'Packing',
    description: 'Our state-of-the-art packing line handles fruit with precision and care, ensuring it is hygienically packed and labeled for full traceability.',
  },
  {
    icon: Truck,
    title: 'Export Logistics',
    description: 'With a capacity of up to 16 trucks per day, we guarantee efficient and reliable dispatch to our partners across Europe and beyond.',
  },
];


type Certification = {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};


export default function QualityPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'quality-hero');
  const firestore = useFirestore();

  const certsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'qualityCertifications');
  }, [firestore]);

  const { data: certifications, isLoading } = useCollection<Certification>(certsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[60vh] bg-gray-50 flex items-center justify-center"
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 text-center px-4 text-white">
            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl font-headline font-extrabold"
            >
              Committed to Quality,<br/>From Farm to World.
            </motion.h1>
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90"
            >
              Our philosophy is simple: true quality is born from care, precision, and an unwavering commitment to excellence at every step.
            </motion.p>
          </div>
        </motion.section>

        {/* Quality Pillars Section */}
        <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Quality Pillars</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        These are the non-negotiable principles that guide our operations and guarantee the superiority of our produce.
                    </p>
                </div>
                 <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {qualityPillars.map((pillar) => (
                        <motion.div key={pillar.title} variants={itemVariants}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full text-center hover:-translate-y-2 hover:shadow-lg transition-transform duration-300">
                                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xl font-bold font-headline">{pillar.title}</h3>
                                <p className="mt-2 text-muted-foreground">{pillar.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
        
        {/* Process Timeline Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">From Grove to Globe</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Our vertically integrated process ensures complete control over quality, safety, and traceability at every stage.
              </p>
            </div>
            <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200" aria-hidden="true"></div>
                {processSteps.map((step, index) => (
                    <motion.div 
                        key={step.title}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="relative mb-12"
                    >
                        <div className={cn("flex items-center", index % 2 === 0 ? "justify-start" : "justify-end")}>
                            <div className={cn("w-1/2", index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left")}>
                               <motion.div
                                 initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                                 whileInView={{ x: 0, opacity: 1 }}
                                 viewport={{ once: true, amount: 0.5 }}
                                 transition={{ duration: 0.6, delay: 0.2 + (0.1 * index) }}
                               >
                                  <h3 className="text-xl font-bold font-headline text-primary">{step.title}</h3>
                                  <p className="mt-1 text-muted-foreground">{step.description}</p>
                               </motion.div>
                            </div>
                        </div>
                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary shadow-lg">
                           <step.icon className="w-8 h-8 text-primary" />
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-20 lg:py-32 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-headline font-bold">Certified, Verified, Trusted.</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Our commitment to international standards is your guarantee of food safety, environmental responsibility, and full traceability. We are proudly certified by globally recognized bodies.
                </p>
            </div>
            {isLoading && (
              <div className="flex justify-center items-center h-24">
                  <Skeleton className="h-16 w-3/4" />
              </div>
            )}
            {certifications && certifications.length > 0 && (
                <Marquee pauseOnHover className="[--duration:60s]">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="flex-shrink-0 mx-8 flex flex-col items-center justify-center h-40 w-48 bg-white p-4 rounded-2xl border shadow-sm">
                            <div className="relative h-20 w-full mb-2">
                                {cert.imageUrl ? (
                                    <Image
                                        src={cert.imageUrl}
                                        alt={cert.name}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-center text-foreground">{cert.name}</p>
                        </div>
                    ))}
                </Marquee>
            )}
          </div>
        </section>
        
        {/* Trust Message Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <CheckCircle className="h-16 w-16 mx-auto text-primary" />
                    <h2 className="mt-6 text-3xl md:text-4xl font-headline font-bold">Excellence, Delivered.</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our process is designed for one purpose: to deliver the finest Moroccan produce to our partners with absolute confidence. From our soil to your shelves, we stand by our promise of quality, reliability, and trust.
                    </p>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
