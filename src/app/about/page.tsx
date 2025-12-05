
'use client';
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Leaf,
  Globe,
  Users,
  Award,
  ShieldCheck,
  Package,
  Ship,
  Thermometer,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StatCard = ({
  icon,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
        </div>
        <p className="text-4xl font-bold font-headline text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
);


const TimelineStep = ({
  icon,
  title,
  description,
  isLast = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}) => (
  <div className="relative flex items-start">
    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
      {icon}
    </div>
    {!isLast && (
      <div className="absolute left-6 top-12 h-full w-0.5 bg-border" />
    )}
    <div className="ml-6 pb-12">
      <h4 className="text-xl font-bold font-headline">{title}</h4>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ValueCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <h4 className="text-xl font-bold font-headline">{title}</h4>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

export default function AboutUsPage() {
  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroImage = PlaceHolderImages.find((p) => p.id === 'about-us-hero');
  const collageImage2 = PlaceHolderImages.find((p) => p.id === 'about-us-c2');

  const stats = [
    { icon: <Leaf className="h-8 w-8" />, value: '200 ha', label: 'Orchards', delay: 0.1 },
    { icon: <Ship className="h-8 w-8" />, value: '10k+ tons', label: 'Annual Export', delay: 0.2 },
    { icon: <Thermometer className="h-8 w-8" />, value: '5+', label: 'Cold Rooms', delay: 0.3 },
    { icon: <ShieldCheck className="h-8 w-8" />, value: 'Certified', label: 'GlobalG.A.P.', delay: 0.4 },
  ];

  const timelineItems = [
    { icon: <Leaf className="h-6 w-6 text-primary" />, title: 'Cultivation & Growth', description: 'In the fertile Gharb-Loukkos region, our 200 hectares of GlobalG.A.P.-certified orchards are meticulously cared for to produce the finest Hass avocados.' },
    { icon: <Users className="h-6 w-6 text-primary" />, title: 'Precision Harvesting', description: 'Our expert teams hand-pick each avocado at its peak ripeness, ensuring optimal flavor, texture, and a longer shelf life for our partners.' },
    { icon: <Package className="h-6 w-6 text-primary" />, title: 'Advanced Packing', description: 'Our state-of-the-art packing station sorts, grades, and packages produce with precision, maintaining its integrity from the moment it leaves the tree.' },
    { icon: <Thermometer className="h-6 w-6 text-primary" />, title: 'Reliable Cold Chain', description: 'With multiple cold rooms and a capacity of 16 trucks per day, we guarantee an unbroken cold chain, preserving freshness from our door to yours.' },
    { icon: <Ship className="h-6 w-6 text-primary" />, title: 'Global Export', description: 'Our logistics network ensures timely and reliable delivery to our partners across Europe and beyond, including the Netherlands, France, Spain, and the UK.', isLast: true },
  ];

  const values = [
    { icon: <Award className="h-7 w-7" />, title: 'Uncompromising Quality', description: 'From soil to shipment, excellence is our standard. We deliver produce that consistently exceeds global benchmarks.' },
    { icon: <HeartHandshake className="h-7 w-7" />, title: 'Long-Term Partnership', description: 'We build relationships founded on trust, reliability, and mutual success. Your growth is our priority.' },
    { icon: <TrendingUp className="h-7 w-7" />, title: 'Continuous Innovation', description: 'We invest in modern agricultural techniques and technology to enhance efficiency, sustainability, and product quality.' },
    { icon: <Lightbulb className="h-7 w-7" />, title: 'Sustainable Future', description: 'As stewards of the land, we are deeply committed to environmentally-conscious farming that nurtures our planet.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section ref={heroRef} style={{ opacity: heroOpacity }} className="relative h-screen text-white flex items-center justify-center overflow-hidden">
          {heroImage && (
            <motion.div className="absolute inset-0 z-0" style={{ y: heroImageY }}>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 text-center px-4 max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight">
              Pioneering Moroccan Agriculture for the World
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              Discover the story of Export Optimum: a journey of passion, precision, and partnership from the heart of Morocco's most fertile lands to the global stage.
            </p>
          </motion.div>
        </motion.section>

        {/* Who We Are Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl font-headline font-bold"
                >
                  Rooted in Excellence, Grown for the Globe.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 text-lg text-muted-foreground"
                >
                  Export Optimum is more than an agricultural exporter; we are a cornerstone of Morocco's fresh produce industry. From our 200-hectare, GlobalG.A.P.-certified orchards in the renowned Gharb–Loukkos region, we cultivate premium Hass avocados and other produce with a deep respect for both tradition and innovation.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-4 text-lg text-muted-foreground"
                >
                  Our mission is to deliver unparalleled quality and reliability to our international partners. This is made possible by our vertically integrated operation, from meticulous orchard management to our state-of-the-art packing and cold storage facility, ensuring every shipment arrives in perfect condition.
                </motion.p>
              </div>
              <div className="relative h-96 lg:h-[500px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-0 left-0 w-2/3 h-2/3 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image src="/avocad3.avif" alt="Lush avocado orchard" fill className="object-cover" data-ai-hint="avocado orchard"/>
                  </motion.div>
                {collageImage2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-xl overflow-hidden shadow-2xl border-4 border-background"
                  >
                    <Image src={collageImage2.imageUrl} alt={collageImage2.description} fill className="object-cover" data-ai-hint={collageImage2.imageHint}/>
                  </motion.div>
                )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full overflow-hidden shadow-md -translate-x-1/2 -translate-y-1/2"
                  >
                    <Image src="/avocado1.png" alt="A single perfect avocado" fill className="object-cover" data-ai-hint="avocado fruit"/>
                  </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
            </div>
        </section>


        {/* Journey Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">From Orchard to World</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our vertically integrated process guarantees quality and traceability at every stage, delivering on our promise of excellence from the soil to the shelf.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              {timelineItems.map((item, index) => (
                 <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                    <TimelineStep {...item} isLast={index === timelineItems.length - 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership & Values Section */}
        <section className="py-20 lg:py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Guiding Principles</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                As leaders in the Moroccan Avocado Association (MAVA) and active participants in global fairs like Fruit Attraction, we are driven by a core set of values that define who we are.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ValueCard {...value} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-tr from-primary via-brand to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">
              Become a Partner in Quality
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
              Join us in delivering the world's finest produce. Contact our team to explore partnership opportunities and secure your supply of premium Moroccan avocados.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link href="/contact">
                  Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
