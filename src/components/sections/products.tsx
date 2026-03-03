
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Package, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

/* ---------------------------------------------
   TYPES
--------------------------------------------- */

type Product = {
  id: string;
  name: string;
  category: string;
  berryType?: string;
  melonType?: string;
  description: string;
  imageUrl?: string;
  slug: string;
  order?: number;
};

/* ---------------------------------------------
   PRODUCT SLIDE CARD
--------------------------------------------- */

function ProductSlideCard({ product, isActive }: { product: Product; isActive: boolean }) {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <motion.div 
        animate={{ 
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-[hsl(88,92%,28%)]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(88,92%,30%)]/10"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {product.imageUrl ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-white/95 text-[hsl(88,92%,22%)] backdrop-blur-sm shadow-md border border-gray-100">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl border border-gray-100 group-hover:bg-[hsl(88,92%,28%)] group-hover:border-[hsl(88,92%,28%)]">
              <ArrowRight className="w-4 h-4 text-[hsl(88,92%,25%)] group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight tracking-tight group-hover:text-[hsl(88,92%,25%)] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 font-light flex-grow mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-end pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-[hsl(88,92%,25%)] transition-colors duration-300">
              <span className="text-xs font-medium">Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(88,92%,30%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </Link>
  );
}

/* ---------------------------------------------
   LOADING STATE
--------------------------------------------- */

function ProductsLoading() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[320px] space-y-4">
              <Skeleton className="w-full aspect-[3/4] rounded-3xl bg-gray-100" />
              <Skeleton className="h-6 w-3/4 bg-gray-100" />
              <Skeleton className="h-20 w-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */

export default function Products() {
  const firestore = useFirestore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      limit(32)
    );
  }, [firestore]);

  const { data: rawProducts, isLoading } = useCollection<Product>(productsQuery);

  const products = useMemo(() => {
    if (!rawProducts) return null;
    
    return [...rawProducts].sort((a, b) => {
      const getRank = (p: Product) => {
        const cat = (p.category || '').toLowerCase();
        const bType = (p.berryType || '').toLowerCase();
        const mType = (p.melonType || '').toLowerCase();

        if (cat === 'avocado') return 10;
        if (cat === 'berries') {
          if (bType === 'blueberry') return 20;
          if (bType === 'raspberry') return 30;
          if (bType === 'strawberry') return 40;
          return 35; 
        }
        if (cat === 'melon') {
          if (mType === 'melon') return 50;
          if (mType === 'watermelon') return 60;
          return 55;
        }
        return 100;
      };

      const rankA = getRank(a);
      const rankB = getRank(b);

      if (rankA !== rankB) return rankA - rankB;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }, [rawProducts]);

  const onScroll = useCallback((api: any) => {
    const progress = Math.max(0, Math.min(1, api.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  const onSelect = useCallback((api: any) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    onScroll(emblaApi);
    
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
  }, [emblaApi, onSelect, onScroll]);

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No products available</h3>
          <p className="text-gray-500 font-light">Check back soon for our latest offerings.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="bg-white overflow-hidden">
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-8 h-px bg-[hsl(88,92%,28%)]" />
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(88,92%,25%)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Our Selection
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight leading-[1.1]"
              >
                Featured
                <br />
                <span className="bg-gradient-to-r from-[hsl(88,92%,30%)] to-[hsl(88,92%,20%)] bg-clip-text text-transparent">
                  Products
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-gray-500 font-light max-w-xl leading-relaxed"
              >
                Discover our selection of premium produce, sourced from the finest farms and delivered with excellence.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="text-sm font-bold text-gray-400 mr-2">
                <span className="text-2xl text-[hsl(88,92%,25%)]">{String(selectedIndex + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(products.length).padStart(2, '0')}</span>
              </div>

              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all duration-300 hover:border-[hsl(88,92%,28%)] hover:bg-[hsl(88,92%,28%)]/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 transition-colors group-hover:text-[hsl(88,92%,25%)]" />
              </button>

              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="w-14 h-14 rounded-full bg-[hsl(88,92%,28%)] flex items-center justify-center transition-all duration-300 hover:bg-[hsl(88,92%,23%)] hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[hsl(88,92%,28%)] group"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[350px]"
                >
                  <ProductSlideCard 
                    product={product} 
                    isActive={index === selectedIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 max-w-md mx-auto">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(88,92%,30%)] to-[hsl(88,92%,20%)] rounded-full"
                animate={{
                  width: `${scrollProgress}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[hsl(88,92%,27%)] hover:bg-[hsl(88,92%,22%)] text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_12px_50px_hsl(88,92%,28%,0.4)] group shadow-xl text-lg hover:scale-105 active:scale-100"
            >
              View Complete Product Range
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
