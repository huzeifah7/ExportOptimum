'use client';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowRight, Leaf, Package } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
};

const ProductCardSkeleton = () => (
  <div className="group">
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
      <Skeleton className="w-full h-full bg-gray-100" />
    </div>
    <Skeleton className="h-4 w-20 rounded-full mb-2 bg-gray-100" />
    <Skeleton className="h-6 w-3/4 mb-2 bg-gray-100" />
    <Skeleton className="h-16 w-full bg-gray-100" />
  </div>
);

export default function ProductsPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), orderBy('name'));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-white pt-32 pb-20">
          
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,40%,0.12) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'glow-breathe 10s ease-in-out infinite' }} />
            <div className="absolute -top-20 -left-20 w-[450px] h-[350px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,38%,0.08) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'glow-breathe 14s ease-in-out infinite 3s' }} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <span className="w-6 h-px bg-[hsl(88,92%,28%)]" />
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(88,92%,25%)]">
                <Leaf className="w-3.5 h-3.5" />
                Our Products
              </span>
              <span className="w-6 h-px bg-[hsl(88,92%,28%)]" />
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.95] tracking-[-0.04em] text-gray-900"
              >
                Fresh Moroccan
                <br />
                <span style={{
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(135deg, hsl(88,92%,30%) 0%, hsl(88,92%,18%) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}>Produce</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Cultivated with care in Morocco's most fertile regions, our produce is a promise of quality, freshness, and complete traceability.
            </motion.p>
          </div>
        </section>

        <style jsx global>{`
          @keyframes glow-breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.1) translateY(-10px); opacity: 0.65; }
          }
        `}</style>

        {/* ══════════════════════════════════════
            PRODUCTS GRID
        ══════════════════════════════════════ */}
        <section ref={gridRef} className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && products && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={`/products/${product.id}`} className="group block">
                      
                      {/* Image */}
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-gray-100 ring-1 ring-gray-100 group-hover:ring-[hsl(88,92%,28%)]/30 transition-all duration-400">
                        {product.imageUrl ? (
                          <>
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              data-ai-hint={product.imageHint}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Category badge on image */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 text-[hsl(88,92%,22%)] backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[hsl(88,92%,25%)] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">
                        {product.description}
                      </p>

                      {/* Arrow indicator */}
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[hsl(88,92%,25%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn more
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>

                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!products || products.length === 0) && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-6">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Produce Selection is Growing</h3>
                <p className="text-gray-500 font-light">Check back soon to see our latest offerings.</p>
              </div>
            )}

          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA SECTION
        ══════════════════════════════════════ */}
        <section className="py-20 lg:py-28 bg-gray-900 text-white overflow-hidden relative">
          
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,40%,0.15) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(88,92%,30%)]/20 border-2 border-[hsl(88,92%,30%)]/30 mb-8">
                <Leaf className="w-8 h-8 text-[hsl(88,92%,50%)]" />
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Interested in Our Produce?
              </h2>

              {/* Description */}
              <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                We partner with importers, distributors, and retailers worldwide. Contact our export team to discuss your needs and discover the quality of Export Optimum.
              </p>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[hsl(88,92%,30%)] hover:bg-[hsl(88,92%,35%)] text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_hsl(88,92%,30%,0.4)] text-lg group"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

            </motion.div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}