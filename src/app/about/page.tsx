
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Eye, Network, Handshake } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';

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

const ValueCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="rounded-2xl border border-border bg-background p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-headline text-foreground">{title}</h3>
    <p className="mt-3 text-muted-foreground">{description}</p>
  </div>
);

export default function AboutUsPage() {
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
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Who We Are */}
        <motion.section
          className="py-24 lg:py-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl font-headline">
                  Pioneering Your Path to Global Markets
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Export Optimum is an international trade and export development firm. We exist to help ambitious companies navigate the complexities of global markets, unlock new revenue streams, and build sustainable international growth.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  From market intelligence to practical execution, we provide the strategic support necessary to turn your export ambitions into tangible success.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="relative h-80 lg:h-96 rounded-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="A team of professionals collaborating around a world map"
                  fill
                  className="rounded-2xl object-cover shadow-xl"
                  data-ai-hint="team collaboration"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Section 2 & 3: Mission & Vision */}
        <div className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid gap-16 lg:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              {/* Our Mission */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground font-headline">Our Mission</h2>
                </div>
                <p className="mt-5 text-lg text-muted-foreground">
                  To demystify international trade and empower businesses with the strategic tools, intelligence, and support needed to expand globally with confidence and clarity.
                </p>
              </motion.div>
              
              {/* Our Vision */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground font-headline">Our Vision</h2>
                </div>
                <p className="mt-5 text-lg text-muted-foreground">
                  To be the most trusted strategic partner for companies building a sustainable and profitable international presence, fostering a world of interconnected and thriving global enterprises.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Section 4: Why Choose Us */}
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
              {values.map((value) => (
                <motion.div key={value.title} variants={itemVariants}>
                  <ValueCard {...value} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
