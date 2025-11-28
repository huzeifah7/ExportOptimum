
'use client';
import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsGrid from '@/components/sections/products-grid';
import Cta from '@/components/sections/cta';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase }from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const categories = ['All', 'Avocado', 'Berries', 'Other'];

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "products");
  }, [firestore]);

  const { data: produce, isLoading } = useCollection<Product>(productsQuery);

  const filteredProduce = produce && activeCategory !== 'All'
    ? produce.filter(p => p.category === activeCategory.toLowerCase())
    : produce;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Produce</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                We cultivate and export premium produce to meet global demand. Explore our selection below.
              </p>
            </div>
            
            <div className="flex justify-center gap-2 mb-12">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'capitalize transition-all',
                    activeCategory === category && 'text-primary-foreground'
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-1 h-full">
                    <Card>
                      <CardHeader className="p-0">
                        <Skeleton className="w-full h-64" />
                      </CardHeader>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full mt-1" />
                         <Skeleton className="h-8 w-24 mt-4" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            
            {filteredProduce && <ProductsGrid items={filteredProduce} />}
          </div>
        </div>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
