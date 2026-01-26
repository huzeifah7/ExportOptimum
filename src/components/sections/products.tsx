'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';

// Data type for products from Firestore
type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
};

// Card props interface
interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  slug: string;
}

// Card component
const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  url,
  color,
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
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[500px] w-[90%] md:w-[70%] rounded-2xl lg:p-10 sm:p-4 p-2 origin-top`}
      >
        <h2 className='text-2xl lg:text-4xl text-center font-bold text-white font-headline'>{title}</h2>
        <div className={`flex flex-col lg:flex-row h-full mt-5 gap-10`}>
          <div className={`w-full lg:w-[40%] relative lg:top-[10%]`}>
            <p className='text-sm lg:text-base text-white/80'>{description}</p>
            <span className='flex items-center gap-2 pt-2'>
              <Link
                href={`/products`} 
                className='underline cursor-pointer text-white'
              >
                See all products
              </Link>
              <svg
                width='22'
                height='12'
                viewBox='0 0 22 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z'
                  fill='white'
                />
              </svg>
            </span>
          </div>

          <div
            className={`relative w-full lg:w-[60%] h-full rounded-lg overflow-hidden `}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              <Image fill src={url} alt={title} className='object-cover' />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


// Main component for the products section
export default function Products() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'), limit(5));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const cardColors = ['#4B6F21', '#405D1B', '#354B15', '#2A3A10', '#8f89ff'];

  if (isLoading) {
      return (
          <section className="h-screen bg-foreground flex items-center justify-center">
              <Skeleton className="w-1/2 h-64 bg-muted/20" />
          </section>
      )
  }

  if (!products || products.length === 0) {
      return (
          <section className="h-screen bg-foreground flex items-center justify-center text-white">
              <p>No products to display.</p>
          </section>
      )
  }

  const mappedProducts = products.map((product, i) => ({
    title: product.name,
    description: product.description,
    url: product.imageUrl || '',
    slug: product.slug,
    color: cardColors[i % cardColors.length]
  }));

  return (
    <ReactLenis root>
      <div ref={container} className="bg-foreground">
        <section className='text-white h-[70vh] w-full bg-foreground grid place-content-center relative'>
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
            <h1 className='relative 2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%] font-headline'>
              Our Premium Produce
            </h1>
            <p className='relative text-center mt-4 text-lg text-white/70'>Scroll to explore our featured selection</p>
          </section>

        <section className='text-white w-full bg-foreground'>
          {mappedProducts.map((project, i) => {
            const targetScale = 1 - (mappedProducts.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                title={project.title}
                description={project.description}
                url={project.url}
                color={project.color}
                slug={project.slug}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </div>
    </ReactLenis>
  );
}
