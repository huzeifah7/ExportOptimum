
'use client';

import { ReactLenis } from 'lenis/react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

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
};

/* ---------------------------------------------
   PRODUCT CARD
--------------------------------------------- */

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 mb-3">
          <motion.div
            style={{ scale: imageScale }}
            className="absolute inset-0"
          >
            {product.imageUrl ? (
              <Image
                fill
                src={product.imageUrl}
                alt={product.name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:brightness-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
          </motion.div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase text-neutral-700">
              {product.category}
            </span>
          </motion.div>

          {/* Quick View Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-neutral-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div style={{ y: contentY }} className="px-1">
          <h3 className="text-lg font-semibold mb-1.5 text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-2">
            {product.description}
          </p>

          <div className="flex items-center text-xs font-medium text-neutral-900 group-hover:gap-1.5 transition-all duration-300">
            <span>Explore</span>
            <svg
              className="w-3.5 h-3.5 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ---------------------------------------------
   LOADING STATE
--------------------------------------------- */

function ProductsLoading() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   MAIN PAGE
--------------------------------------------- */

export default function Products() {
  const firestore = useFirestore();
  const headerRef = useRef<HTMLElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      orderBy('name'),
      limit(8)
    );
  }, [firestore]);

  const { data: products, isLoading } =
    useCollection<Product>(productsQuery);

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-32 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No products available</h3>
          <p className="text-neutral-600">Check back soon for our latest offerings.</p>
        </div>
      </section>
    );
  }

  return (
    <ReactLenis root>
      <main className="bg-neutral-50 min-h-screen">

        {/* PRODUCTS GRID */}
        <section className="pb-20 pt-20">
          <div className="max-w-8xl mx-auto px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h2 className="text-8xl md:text-4xl font-bold text-neutral-900 pt-5">
                Featured Products
              </h2>
              <p className="text-base text-neutral-600 max-w-2xl mx-auto pt-5">
                Discover our selection of premium produce, sourced from the finest farms and delivered with excellence.
              </p>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-all duration-300 hover:gap-4 hover:shadow-xl shadow-lg"
            >
              <span>View Complete Product Range</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </section>
      </main>
    </ReactLenis>
  );
}
