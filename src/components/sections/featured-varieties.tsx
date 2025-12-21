
'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { produce } from '@/lib/produce-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featuredVarietiesSlugs = ['hass', 'fuerte', 'zutano'];

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
    transition: { type: 'spring', stiffness: 100, duration: 0.5 },
  },
};

export default function FeaturedVarieties() {
  const featuredVarieties = produce.filter(p => featuredVarietiesSlugs.includes(p.slug));

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      id="featured-varieties"
      className="py-16 lg:py-24 bg-gray-50/50"
    >
      <div className="container mx-auto px-4">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Featured Avocado Varieties
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore our hand-picked selection of premium avocado varieties, each with its own unique flavor and texture.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredVarieties.map((variety) => {
            const image = PlaceHolderImages.find(p => p.id === variety.id);
            return (
              <motion.div key={variety.id} variants={itemVariants} className="h-full">
                <Card className="rounded-lg group h-full flex flex-col border border-border/20 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                      <Link href={`/produce/${variety.slug}`} className="block">
                          {image ? (
                              <Image
                                  src={image.imageUrl}
                                  alt={variety.name}
                                  width={500}
                                  height={400}
                                  className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300"
                                  data-ai-hint={variety.imageHint}
                              />
                          ) : (
                              <div className="h-60 w-full bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
                          )}
                      </Link>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow bg-background text-card-foreground">
                    <h3 className="font-headline text-2xl font-bold text-foreground">{variety.name}</h3>
                    <p className="mt-2 text-base text-muted-foreground line-clamp-2 flex-grow">{variety.description}</p>
                    <div className="mt-4">
                       <Button asChild variant="link" className="p-0 text-primary font-semibold">
                          <Link href={`/produce/${variety.slug}`}>
                              Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
