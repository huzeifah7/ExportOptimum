
'use client';

import { ReactLenis } from 'lenis/react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
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

interface CardProps {
    i: number;
    title: string;
    description: string;
    src: string;
    url: string;
    progress: MotionValue<number>,
    range: [number, number];
    targetScale: number;
}


/* ---------------------------------------------
   PRODUCT CARD
--------------------------------------------- */

export const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  src,
  url,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`bg-foreground text-primary-foreground flex flex-col relative h-[400px] w-[60%] rounded-lg lg:p-8 sm:p-4 p-2`}
      >
        <h2 className='text-2xl text-center font-semibold'>{title}</h2>
        <div className={`flex h-full mt-5 gap-8`}>
          <div className={`w-[40%] relative top-[5%]`}>
            <p className='text-sm'>{description}</p>
            <Link href={`/products/${url}`} passHref>
                <button className="text-primary-foreground mt-4 underline">See more</button>
            </Link>
          </div>

          <div
            className={`relative w-[60%] h-full rounded-lg overflow-hidden `}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              <Image fill src={src} alt='image' className='object-cover' />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


/* ---------------------------------------------
   LOADING STATE
--------------------------------------------- */

function ProductsLoading() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-[4/5] rounded-3xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
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

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      orderBy('name'),
    );
  }, [firestore]);

  const { data: products, isLoading } =
    useCollection<Product>(productsQuery);

  const container = useRef(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end end'],
    });

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
      <main className="bg-white" ref={container}>
        <>
          <section className='text-black  h-[70vh]  w-full bg-slate-100  grid place-content-center '>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <h1 className='2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
              Our Premium Produce
            </h1>
          </section>
        </>

        <section className='w-full bg-white'>
          {products.map((product, i) => {
            const targetScale = 1 - (products.length - i) * 0.05;
            const range:[number, number] = [i / products.length, 1];
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={product?.slug}
                src={product?.imageUrl || ''}
                title={product?.name}
                description={product?.description}
                progress={scrollYProgress}
                range={range}
                targetScale={targetScale}
              />
            );
          })}
        </section>

      </main>
    </ReactLenis>
  );
}
