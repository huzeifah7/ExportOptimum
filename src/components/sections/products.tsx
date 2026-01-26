'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

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
   CARD
--------------------------------------------- */

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="relative flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[520px] h-[520px]
                 snap-center rounded-3xl overflow-hidden bg-background
                 border border-border/30 shadow-xl"
    >
      {/* IMAGE */}
      <div className="relative h-[60%] w-full">
        {product.imageUrl && (
          <Image
            fill
            src={product.imageUrl}
            alt={product.name}
            className="object-cover"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col h-[40%]">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          {product.category}
        </span>

        <h3 className="text-2xl font-headline font-bold mb-3">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-auto">
          {product.description}
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center
                     rounded-full bg-primary px-6 py-3 text-sm
                     font-medium text-primary-foreground
                     hover:scale-105 transition-transform"
        >
          View product
        </Link>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------
   PAGE
--------------------------------------------- */

export default function Products() {
  const firestore = useFirestore();

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
    return (
      <section className="py-32 flex justify-center">
        <Skeleton className="w-[70%] h-64" />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-32 text-center">
        <p>No products available.</p>
      </section>
    );
  }

  return (
    <ReactLenis root>
      <main className="bg-background overflow-hidden">

        {/* HEADER */}
        <section className="pt-32 pb-20 text-center px-6">
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Moroccan origin · Export quality
          </span>

          <h1 className="mt-6 text-5xl xl:text-6xl font-headline font-semibold">
            Our Premium Produce
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            A curated selection of our finest fruits, grown with care
            and trusted by international markets.
          </p>
        </section>

        {/* SLIDER */}
        <section className="relative">
          <div
            className="flex gap-8 px-6 pb-24 overflow-x-auto snap-x snap-mandatory
                       scrollbar-none"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-32 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-10 py-4 rounded-full
                       bg-primary text-primary-foreground font-medium
                       hover:scale-105 transition-transform"
          >
            View full product catalog
          </Link>
        </section>
      </main>
    </ReactLenis>
  );
}
