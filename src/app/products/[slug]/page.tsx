
'use client';

import { useParams, notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.slug as string;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(() => {
    // We can only build the ref if we have the firestore instance AND the productId from the URL
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  // The useDoc hook will handle the null ref and start loading once the ref is available.
  const { data: product, isLoading } = useDoc<Product>(productRef);

  // Show a loading skeleton if we are waiting for the URL param, the firestore instance, or the data itself.
  // `!productRef` is a good indicator that we're still waiting for `productId` or `firestore`.
  // `isLoading` is the indicator that `useDoc` is actively fetching.
  if (isLoading || !productRef) {
    return <ProductDetailSkeleton />;
  }

  // If loading is finished and we still don't have a product, it means the document doesn't exist.
  // This is the correct time to show a 404 page.
  if (!product) {
    notFound();
  }

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
