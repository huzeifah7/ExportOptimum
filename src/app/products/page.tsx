
'use client';
import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsGrid from '@/components/sections/products-grid';
import Cta from '@/components/sections/cta';
import { produce } from '@/lib/produce-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = ['All', 'Avocado', 'Berries'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProduce = activeCategory === 'All'
    ? produce
    : produce.filter(p => p.category === activeCategory);

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

            <ProductsGrid items={filteredProduce} />
          </div>
        </div>
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

    