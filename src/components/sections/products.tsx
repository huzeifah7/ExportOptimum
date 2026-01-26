'use client';

import { ReactLenis } from 'lenis/react';
import {
  motion,
  useScroll,
  useTransform,
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
   PRODUCT ROW
--------------------------------------------- */

function ProductRow({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'end 40%'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  const reverse = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-10 py-20 border-t border-border/30`}
    >
      {/* IMAGE */}
      <motion.div
        style={{ y: imageY }}
        className={`relative h-[340px] rounded-2xl overflow-hidden ${
          reverse ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6'
        }`}
      >
        {product.imageUrl && (
          <Image
            fill
            src={product.imageUrl}
            alt={product.name}
            className="object-cover"
          />
        )}
      </motion.div>

      {/* CONTENT */}
      <div
        className={`flex flex-col justify-center ${
          reverse ? 'lg:col-span-5 lg:col-start-2' : 'lg:col-span-5'
        }`}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {product.category}
        </span>

        <h2 className="text-3xl xl:text-4xl font-headline font-bold mb-4">
          {product.name}
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {product.description}
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors"
          >
            View product
          </Link>

          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Full catalog →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------
   MAIN PAGE
--------------------------------------------- */

export default function Products() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      orderBy('name'),
      limit(5)
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
      <main className="bg-white">

        {/* HEADER */}
        <section className="pt-32 pb-24 text-center px-6">
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Moroccan origin · Export quality
          </span>

          <h1 className="mt-6 text-5xl xl:text-6xl font-headline font-semibold">
            Our Premium Produce
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Carefully cultivated, professionally packed, and trusted
            by international partners.
          </p>
        </section>

        {/* PRODUCT LIST */}
        <section className="max-w-4xl mx-auto px-2 p-4">
          {products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </section>

        {/* FOOTER CTA */}
        <section className="py-24 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform"
          >
            View complete product range
          </Link>
        </section>
      </main>
    </ReactLenis>
  );
}
