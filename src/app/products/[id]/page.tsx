
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
import { CalendarDays, Thermometer, Droplet, Tag, CalendarRange } from 'lucide-react';

const AvocadoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2c-3.5 0-6.5 3.5-6.5 7.5 0 5 3 12.5 6.5 12.5s6.5-7.5 6.5-12.5C18.5 5.5 15.5 2 12 2z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

type Product = {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
  period?: string;
  storage?: string;
  sizes?: string;
  brix?: string;
  berryVarieties?: string;
  berryAvailability?: string;
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

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;
  const firestore = useFirestore();
  const router = useRouter();

  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  if (isLoading || !productId) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center py-20">
          <div>
            <h1 className="text-4xl font-bold font-headline text-destructive">404 - Product Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">We couldn't find the product you're looking for.</p>
            <Button onClick={() => router.push('/products')} className="mt-8">Back to All Products</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isBerries = product.category === 'berries';
  const hasFeatures = isBerries 
    ? (!!product.berryVarieties || !!product.berryAvailability || !!product.brix) 
    : (!!product.period || !!product.storage || !!product.sizes);

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
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-foreground leading-[1.1] mb-2">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xl md:text-2xl text-primary font-medium mb-6 italic">
                  {product.subtitle}
                </p>
              )}
              
              <div className="prose prose-lg text-muted-foreground mb-10 max-w-none font-light leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Integrated Features Section */}
              {hasFeatures && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 py-8 border-y border-border/50">
                    {isBerries ? (
                        <>
                            {product.berryVarieties && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Tag className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Varieties</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.berryVarieties}</p>
                                    </div>
                                </div>
                            )}
                            {product.berryAvailability && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <CalendarRange className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Availability</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.berryAvailability}</p>
                                    </div>
                                </div>
                            )}
                            {product.brix && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Droplet className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Brix</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.brix}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {product.period && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <CalendarDays className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Periode</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.period}</p>
                                    </div>
                                </div>
                            )}
                            {product.storage && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Thermometer className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Storage</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.storage}</p>
                                    </div>
                                </div>
                            )}
                            {product.sizes && (
                                <div className="flex flex-col items-center sm:items-start gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <AvocadoIcon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Sizes</p>
                                        <p className="text-sm font-bold text-foreground leading-tight">{product.sizes}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
              )}
              
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
