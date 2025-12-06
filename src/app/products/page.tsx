
'use client';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

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
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const ProductCardSkeleton = () => (
    <Card className="overflow-hidden shadow-sm border-border/50 h-full">
        <Skeleton className="h-60 w-full" />
        <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
    </Card>
);

export default function ProductsPage() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), orderBy('name'));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-24 lg:py-36 bg-gradient-to-br from-green-50 via-gray-50 to-yellow-50 text-center"
        >
            <div className="container mx-auto px-4">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-headline font-bold text-foreground"
                >
                    Our Fresh Moroccan Produce
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
                >
                    Cultivated with care in Morocco's most fertile regions, our produce is a promise of quality, freshness, and complete traceability.
                </motion.p>
            </div>
        </motion.section>

        {/* Dynamic Product Grid */}
        <div className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                    <ProductCardSkeleton />
                </motion.div>
              ))}

              {!isLoading && products?.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border-border/50">
                    <div className="relative h-60 w-full overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={product.imageHint}
                        />
                      ) : (
                        <div className="bg-secondary h-full flex items-center justify-center text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm font-semibold text-primary capitalize">{product.category}</p>
                      <h3 className="mt-1 text-xl font-bold font-headline text-foreground">{product.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {!isLoading && products?.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <h3 className="text-2xl font-headline">Our Produce Selection is Growing</h3>
                    <p>Check back soon to see our latest offerings.</p>
                </div>
            )}
          </div>
        </div>

        {/* Contact CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-tr from-primary via-brand to-accent text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">
              Interested in Our Produce?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
              We partner with importers, distributors, and retailers worldwide. Contact our export team to discuss your needs and discover the quality of Export Optimum.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary" className="text-lg shadow-lg hover:scale-105 transition-transform">
                <Link href="/contact">
                  Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
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
