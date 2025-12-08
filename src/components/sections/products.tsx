
'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';

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
  <Card className="overflow-hidden border-border/20 shadow-sm h-full">
    <Skeleton className="h-60 w-full" />
    <CardContent className="p-6 space-y-3">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-5 w-20 mt-2" />
    </CardContent>
  </Card>
);

export default function Products() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'), limit(6));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      id="products"
      className="py-16 lg:py-24 bg-gray-50/50"
    >
      <div className="container mx-auto px-4">
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
            <motion.div key={product.id} variants={itemVariants}>
              <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col border-border/30 bg-white">
                <CardHeader className="p-0">
                  {product.imageUrl ? (
                    <div className="overflow-hidden relative h-60 w-full">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={product.imageHint}
                      />
                    </div>
                  ) : (
                    <div className="h-60 w-full bg-secondary flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <Badge variant="secondary" className="w-fit capitalize mb-2">{product.category}</Badge>
                  <h3 className="font-headline text-2xl font-bold text-foreground">{product.name}</h3>
                  <p className="mt-2 text-base text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
                  <div className="mt-4 pt-4 border-t border-border/20">
                     <Button variant="link" asChild className="p-0 text-primary font-bold">
                        <Link href="/products">
                            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-16">
          <Button size="lg" asChild>
            <Link href="/products">
              View All Produce <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
