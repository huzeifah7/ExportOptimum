
'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, CalendarDays, Thermometer, Shrink } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
  origin?: string;
  season?: string;
  characteristics?: string;
  period?: string;
  storage?: string;
  sizes?: string;
};

const ProductDetailSkeleton = () => (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <div className="space-y-4">
                           <Skeleton className="h-6 w-1/4" />
                           <Skeleton className="h-8 w-1/2" />
                        </div>
                         <Skeleton className="h-12 w-48" />
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

const ProductNotFound = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center text-center py-20">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-destructive">404 - Product Not Found</h1>
                    <p className="mt-4 text-lg text-muted-foreground">We couldn't find the product you're looking for.</p>
                    <Button onClick={() => router.push('/products')} className="mt-8">
                        Back to All Products
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};


export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  if (error) {
      return (
         <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center text-center py-20">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-destructive">Error Loading Product</h1>
                    <p className="mt-4 text-lg text-muted-foreground">There was a problem fetching the product data. Please try again later.</p>
                </div>
            </main>
            <Footer />
        </div>
      )
  }

  if (isLoading || !productId) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const hasFeatures = product.period || product.storage || product.sizes;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            
            {/* Image Section */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-border/50"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={600}
                  className="object-cover w-full h-auto aspect-[4/3]"
                  data-ai-hint={product.imageHint}
                  priority
                />
              )}
            </motion.div>

            {/* Content Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4 capitalize py-1.5 px-4 text-sm font-semibold tracking-wide bg-primary/10 text-primary border-primary/20">
                {product.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-foreground leading-[1.1] mb-6">
                {product.name}
              </h1>
              
              <div className="prose prose-lg text-muted-foreground mb-10 max-w-none font-light leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Specifications Section */}
              <div className="grid gap-6 mb-10">
                {product.origin && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Origin</h3>
                            <p className="text-muted-foreground">{product.origin}</p>
                        </div>
                    </div>
                )}

                {product.season && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Harvest Season</h3>
                            <p className="text-muted-foreground">{product.season}</p>
                        </div>
                    </div>
                )}

                {product.characteristics && (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Key Characteristics</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{product.characteristics}</p>
                        </div>
                    </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <Link href="/contact">Inquire About This Product</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full font-bold text-lg hover:bg-secondary/50">
                  <Link href="/products">View All Produce</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* New "Our Features" Section */}
          {hasFeatures && (
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-16 border-t"
            >
                <h2 className="text-3xl font-bold font-headline mb-12 text-center lg:text-left">Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {product.period && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <CalendarDays className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-foreground">Periode: {product.period}</p>
                            </div>
                        </div>
                    )}
                    {product.storage && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Thermometer className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-foreground">Storage: {product.storage}</p>
                            </div>
                        </div>
                    )}
                    {product.sizes && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Shrink className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-foreground">Sizes: {product.sizes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
