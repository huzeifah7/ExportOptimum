'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const ProductCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden">
    <Skeleton className="h-72 w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export default function ProductsRedesign() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'), limit(3));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <motion.section
      id="products"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 relative z-10">

        {/* HEADER */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 uppercase tracking-widest text-xs bg-primary/10 text-primary border-primary/20">
            Our Harvest
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Featured Produce
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Carefully cultivated in Morocco’s most fertile regions,
            each product reflects our commitment to freshness and traceability.
          </p>
        </motion.div>

        {/* PRODUCTS */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <ProductCardSkeleton />
              </motion.div>
            ))}

          {!isLoading &&
            products?.map(product => (
              <motion.article
                key={product.id}
                variants={itemVariants}
                className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-72 overflow-hidden">
                  <Link href="/products">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        data-ai-hint={product.imageHint}
                      />
                    ) : (
                      <div className="h-full bg-secondary flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* CATEGORY */}
                  <Badge className="absolute top-4 left-4 bg-white/90 text-foreground">
                    {product.category}
                  </Badge>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="mt-2 text-muted-foreground line-clamp-3 flex-grow">
                    {product.description}
                  </p>

                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center text-primary font-semibold group/link"
                  >
                    View details
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
        </motion.div>

        {/* FOOTER CTA */}
        <motion.div variants={itemVariants} className="text-center mt-20">
          <Button
            size="lg"
            asChild
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-10"
          >
            <Link href="/products">
              Explore all produce
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </motion.section>
  );
}
