
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Target, Eye, Network, Handshake, ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Meteors } from '@/components/ui/meteors';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SplitText from '@/components/ui/split-text';

// ---- START of user-provided components, adapted ----

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }: {imgUrl: string, subheading: string, heading: string, children: React.ReactNode}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }: {imgUrl: string}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }: {subheading: string, heading: string}) => {
  const targetRef = useRef(null);
  
  return (
    <div
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
        <SplitText
            tag="p"
            text={subheading}
            className="mb-2 text-center text-xl font-light md:mb-4 md:text-3xl text-white/80"
            splitType="words"
        />
        <SplitText
            tag="p"
            text={heading}
            className="text-center text-4xl font-bold md:text-7xl font-headline"
            splitType="chars"
            delay={30}
        />
    </div>
  );
};

const SectionContent = ({ title, children, ctaText, ctaLink }: {title: string, children: React.ReactNode, ctaText?: string, ctaLink?: string}) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold font-headline text-foreground md:col-span-4">
      {title}
    </h2>
    <div className="col-span-1 md:col-span-8">
        {children}
      {ctaText && ctaLink && (
        <Button asChild className="w-full mt-8 rounded-lg md:w-fit" size="lg">
            <Link href={ctaLink}>
                {ctaText} <ArrowUpRight className="inline ml-2" />
            </Link>
        </Button>
      )}
    </div>
  </div>
);

// ---- END of user-provided components ----

// This is from the original page and should be kept for the "Why Choose Us" section.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

const ValueCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description:string; }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary/80 to-accent/80 transform scale-[0.80] rounded-full blur-3xl" />
      <div className="relative shadow-xl bg-background/90 border border-border  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col items-start">
        <div className="h-14 w-14 rounded-full border flex items-center justify-center mb-4 border-gray-500 bg-primary/10 text-primary">
          {icon}
        </div>

        <h1 className="font-bold text-xl text-foreground mb-4 relative z-50">
          {title}
        </h1>

        <p className="font-normal text-base text-muted-foreground mb-4 relative z-50">
          {description}
        </p>

        {isClient && <Meteors number={20} />}
      </div>
    </div>
  );
};

export default function AboutUsPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  const values = [
    {
      icon: <Briefcase className="h-7 w-7" />,
      title: 'Decades of Export Expertise',
      description: "Our team's deep, hands-on experience in international trade provides you with an unparalleled strategic advantage.",
    },
    {
      icon: <Target className="h-7 w-7" />,
      title: 'Actionable Market Intelligence',
      description: 'We go beyond data, offering tailored market insights that identify real-world opportunities for your business.',
    },
    {
      icon: <Network className="h-7 w-7" />,
      title: 'Global Partner Network',
      description: 'Leverage our extensive network of trusted international partners to accelerate your entry and growth in new markets.',
    },
    {
      icon: <Handshake className="h-7 w-7" />,
      title: 'Practical Execution Support',
      description: 'We are your operational partners, assisting with everything from logistics and compliance to in-market representation.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isClient && <Header />}
      <main className="flex-grow bg-white">
        <TextParallaxContent
            imgUrl="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            subheading="Who We Are"
            heading="Built by the ElYamlahi Family. Empowered by growers. Trusted by global buyers."
        >
            <SectionContent title="Our Story">
                <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
                    Founded in 2019 as a family-owned company, Export Optimum is the natural evolution of over 10 years of hands-on experience in farm management and international fresh produce supply.
                </p>
                <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
                    Powered by a loyal global customer base, we operate with precision planning, strict quality standards, and responsible sourcing at the core of everything we do.
                </p>
                <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
                    Today, Export Optimum stands as a leading exporter of Moroccan avocados, serving consumers worldwide and supplying fresh berries and premium melons to international markets.
                </p>
                <p className="text-xl font-semibold text-foreground md:text-2xl">
                    Export Optimum: fresh produce from our family to yours.
                </p>
            </SectionContent>
        </TextParallaxContent>

         <TextParallaxContent
            imgUrl="https://images.unsplash.com/photo-1508921340878-ba53e1f416ec?q=80&w=2070&auto=format&fit=crop"
            subheading="Our Mission"
            heading="Empowering Global Expansion"
        >
            <SectionContent title="What We Strive For">
                 <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
                   Our mission is to empower Moroccan agricultural producers by providing them with reliable, efficient, and profitable access to global markets. We strive to be a catalyst for growth, ensuring that the quality of Moroccan produce is recognized and valued worldwide, while demystifying the complexities of international trade for our partners.
                </p>
            </SectionContent>
        </TextParallaxContent>

        <TextParallaxContent
            imgUrl="https://images.unsplash.com/photo-1531307983284-88e547343469?q=80&w=2070&auto=format&fit=crop"
            subheading="Our Vision"
            heading="Fostering Thriving Enterprises"
        >
            <SectionContent title="Our Future Outlook">
                 <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
                    Our vision is to be the world's most trusted partner for premium Moroccan avocados and produce. We aim to build a future where our commitment to sustainability, quality, and innovation not only leads the market but also fosters a thriving, interconnected global community of growers, partners, and consumers.
                </p>
            </SectionContent>
        </TextParallaxContent>

        {/* Section 4: Why Choose Us - kept from original */}
        <motion.section
          className="py-24 lg:py-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2 variants={itemVariants} className="text-4xl font-bold text-foreground md:text-5xl font-headline">
                The Export Optimum Advantage
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground">
                We provide more than advice. We deliver a clear, actionable framework for international success.
              </motion.p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {isClient && values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <ValueCard {...value} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      {isClient && <Footer />}
    </div>
  );
}
