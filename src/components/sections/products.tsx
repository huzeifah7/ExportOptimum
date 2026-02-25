
'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Package, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

/* ---------------------------------------------
   TYPES
--------------------------------------------- */

type Product = {
  id: string;
  name: string;
  category: string;
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
        initial={{ opacity: 0.6, scale: 0.95 }}
        animate={{ 
          opacity: isActive ? 1 : 0.6,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-240 flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-[hsl(88,92%,28%)]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[hsl(88,92%,30%)]/10"
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
                priority={isActive}
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
   MAIN COMPONENT WITH SLIDER
--------------------------------------------- */

export default function Products() {
  const firestore = useFirestore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      limit(12)
    );
  }, [firestore]);

  const { data: rawProducts, isLoading } = useCollection<Product>(productsQuery);

  // Apply manual order locally
  const products = useMemo(() => {
    if (!rawProducts) return null;
    return [...rawProducts].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [rawProducts]);

  // Responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setSlidesPerView(4);
      else if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const maxIndex = Math.max(0, products.length - slidesPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(prev => prev + 1);
  };

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
                <span className="text-2xl text-[hsl(88,92%,25%)]">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(products.length).padStart(2, '0')}</span>
              </div>

              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all duration-300 hover:border-[hsl(88,92%,28%)] hover:bg-[hsl(88,92%,28%)]/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 transition-colors group-hover:text-[hsl(88,92%,25%)]" />
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="w-14 h-14 rounded-full bg-[hsl(88,92%,28%)] flex items-center justify-center transition-all duration-300 hover:bg-[hsl(88,92%,23%)] hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[hsl(88,92%,28%)] group"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-2" ref={containerRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / slidesPerView)}%`,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / slidesPerView}% - ${(slidesPerView - 1) * 24 / slidesPerView}px)` }}
                >
                  <ProductSlideCard 
                    product={product} 
                    isActive={index >= currentIndex && index < currentIndex + slidesPerView}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-12 max-w-md mx-auto">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(88,92%,30%)] to-[hsl(88,92%,20%)] rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((currentIndex + 1) / products.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
