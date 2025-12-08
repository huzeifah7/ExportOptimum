
'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
};

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

const ProductCardSkeleton = () => (
    <div className="bg-transparent p-4 rounded-lg">
        <Skeleton className="h-60 w-full rounded-md" />
        <div className="pt-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-28 mt-2" />
        </div>
    </div>
);

export default function Products() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'), limit(3));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      id="products"
      className="py-16 lg:py-24 bg-background relative"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
            backgroundColor: 'hsl(var(--background))'
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Discover Our Produce
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Grown with care in Morocco's most fertile regions, our produce is a promise of quality, freshness, and complete traceability.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
             <motion.div key={i} variants={itemVariants}>
                <ProductCardSkeleton />
            </motion.div>
          ))}
          {!isLoading && products?.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="h-full">
              <div className="rounded-lg group h-full flex flex-col">
                <div className="relative overflow-hidden">
                    <Link href="/products" className="block">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={500}
                                height={400}
                                className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                                data-ai-hint={product.imageHint}
                            />
                        ) : (
                            <div className="h-60 w-full bg-secondary flex items-center justify-center text-muted-foreground rounded-t-lg">No Image</div>
                        )}
                    </Link>
                    <div className="absolute top-0 right-0 w-28 h-28">
                        <div className="absolute transform rotate-45 bg-primary text-primary-foreground text-center font-semibold py-1 right-[-34px] top-[32px] w-[170px]">
                           {product.category}
                        </div>
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow bg-card text-card-foreground">
                  <h3 className="font-headline text-2xl font-bold text-foreground">{product.name}</h3>
                  <p className="mt-2 text-base text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
                  <div className="mt-4">
                     <Button asChild className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-md transition-colors">
                        <Link href="/products">
                            View Details
                        </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-16">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
            <Link href="/products">
              View All Produce <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
