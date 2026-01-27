
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

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
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

// A dedicated component to show when the product is not found.
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

  // Show a skeleton while the ID is loading from the URL or the data is being fetched.
  if (isLoading || !productId) {
    return <ProductDetailSkeleton />;
  }

  // After loading, if there's no product, show the not found component.
  if (!product) {
    return <ProductNotFound />;
  }

  // If we have a product, render the details.
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="rounded-lg overflow-hidden shadow-lg">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={800}
                  height={600}
                  className="object-cover w-full"
                  data-ai-hint={product.imageHint}
                  priority
                />
              )}
            </div>
            <div>
              <Badge variant="secondary" className="mb-2 capitalize">{product.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{product.name}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
              
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">Inquire About This Product</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
