
'use client';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowRight, Leaf, Package } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useRef, useMemo } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  berryType?: string;
  melonType?: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
  order?: number;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
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

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index, isInView }: { product: Product; index: number; isInView: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
  >
    <Link href={`/products/${product.id}`} className="group block">
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
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 text-[hsl(88,92%,22%)] backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[hsl(88,92%,25%)] transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">
        {product.description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[hsl(88,92%,25%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  </motion.article>
);

// ─── Section config ───────────────────────────────────────────────────────────
const VARIETIES: {
  key: string;
  subCategoryKey?: 'berryType' | 'melonType';
  subCategoryValue?: string;
  id?: string;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    key: 'avocado',
    label: 'Avocado',
    emoji: '🥑',
    description: 'Creamy Moroccan avocados, harvested at peak ripeness for export-grade quality.',
  },
  {
    key: 'berries',
    subCategoryKey: 'berryType',
    subCategoryValue: 'blueberry',
    id: 'berries-blueberry',
    label: 'Blueberries',
    emoji: '🫐',
    description: 'Fresh blueberries bursting with antioxidants and sweet flavor.',
  },
  {
    key: 'berries',
    subCategoryKey: 'berryType',
    subCategoryValue: 'raspberry',
    id: 'berries-raspberry',
    label: 'Raspberries',
    emoji: '🍓',
    description: 'Succulent raspberries carefully picked for peak sweetness.',
  },
  {
    key: 'berries',
    subCategoryKey: 'berryType',
    subCategoryValue: 'strawberry',
    id: 'berries-strawberry',
    label: 'Strawberries',
    emoji: '🍓',
    description: 'Vibrant and juicy strawberries, perfect for international markets.',
  },
  {
    key: 'melon',
    subCategoryKey: 'melonType',
    subCategoryValue: 'melon',
    id: 'melon-variety',
    label: 'Melons',
    emoji: '🍈',
    description: 'Sweet, aromatic melons grown in Morocco\'s warm interior valleys.',
  },
  {
    key: 'melon',
    subCategoryKey: 'melonType',
    subCategoryValue: 'watermelon',
    id: 'watermelon-variety',
    label: 'Watermelons',
    emoji: '🍉',
    description: 'Refreshing and juicy watermelons, perfect for summer export.',
  },
];

const HERO_BUTTONS = [
  { id: 'avocado', label: 'Avocado', emoji: '🥑' },
  { id: 'berries-blueberry', label: 'Berries', emoji: '🫐' },
  { id: 'melon-variety', label: 'Melon', emoji: '🍈' },
];

// ─── Variety Section ──────────────────────────────────────────────────────────
const VarietySection = ({
  variety,
  subCategoryKey,
  subCategoryValue,
  id,
  label,
  emoji,
  firestore,
  sectionIndex,
}: {
  variety: string;
  subCategoryKey?: 'berryType' | 'melonType';
  subCategoryValue?: string;
  id?: string;
  label: string;
  emoji: string;
  description: string;
  firestore: ReturnType<typeof useFirestore>;
  sectionIndex: number;
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Fetch items by category, then filter sub-category client-side to avoid complex index requirements
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'),
      where('category', '==', variety)
    );
  }, [firestore, variety]);

  const { data: rawProducts, isLoading } = useCollection<Product>(productsQuery);

  // Apply manual order and sub-category filtering locally
  const products = useMemo(() => {
    if (!rawProducts) return null;
    let filtered = [...rawProducts];
    if (subCategoryKey && subCategoryValue) {
      filtered = filtered.filter(p => p[subCategoryKey] === subCategoryValue);
    }
    return filtered.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [rawProducts, subCategoryKey, subCategoryValue]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-20" id={id || variety}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl leading-none" aria-hidden>{emoji}</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {label}
              </h2>
            </div>
          </div>

          {/* Divider line */}
          <div className="hidden sm:block flex-1 mx-8 h-px bg-gradient-to-r from-gray-200 to-transparent self-center" />

          {/* Count badge */}
          {!isLoading && products && products.length > 0 && (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[hsl(88,92%,28%)]/20 bg-[hsl(88,92%,28%)]/5 text-[11px] font-bold text-[hsl(88,92%,22%)] uppercase tracking-widest whitespace-nowrap">
              <Leaf className="w-3 h-3" />
              {products.length} {products.length === 1 ? 'variety' : 'varieties'}
            </span>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* Grid */}
        {!isLoading && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} isInView={isInView} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && (!products || products.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-4 text-3xl">
              {emoji}
            </div>
            <p className="text-gray-400 font-light text-sm">No {label.toLowerCase()} products available yet.</p>
          </div>
        )}

        {/* Bottom separator (not on last section) */}
        {sectionIndex < VARIETIES.length - 1 && (
          <div className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        )}
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-white pt-32 pb-20">

          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,40%,0.12) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'glow-breathe 10s ease-in-out infinite' }} />
            <div className="absolute -top-20 -left-20 w-[450px] h-[350px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, hsl(88,92%,38%,0.08) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'glow-breathe 14s ease-in-out infinite 3s' }} />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
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

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Cultivated with care in Morocco's most fertile regions, our produce is a promise of quality, freshness, and complete traceability.
            </motion.p>

            {/* Main Category anchors */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mt-10 flex-wrap"
            >
              {HERO_BUTTONS.map((v) => (
                <a
                  key={v.id}
                  href={`#${v.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[hsl(88,92%,28%)]/40 hover:bg-[hsl(88,92%,28%)]/5 text-sm font-medium text-gray-600 hover:text-[hsl(88,92%,22%)] transition-all duration-200"
                >
                  <span>{v.emoji}</span>
                  {v.label}
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        <style jsx global>{`
          @keyframes glow-breathe {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.1) translateY(-10px); opacity: 0.65; }
          }
        `}</style>

        {/* CATEGORY & SUB-CATEGORY SECTIONS */}
        {VARIETIES.map((v, i) => (
          <VarietySection
            key={v.id || v.key}
            variety={v.key}
            subCategoryKey={v.subCategoryKey}
            subCategoryValue={v.subCategoryValue}
            id={v.id || v.key}
            label={v.label}
            emoji={v.emoji}
            description={v.description}
            firestore={firestore}
            sectionIndex={i}
          />
        ))}

        {/* CTA - Floating Card Style with Margins */}
        <section className="mx-4 sm:mx-6 lg:mx-12 mb-16 py-20 lg:py-28 bg-gray-900 text-white overflow-hidden relative rounded-[40px] shadow-2xl">
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(88,92%,30%)]/20 border-2 border-[hsl(88,92%,30%)]/30 mb-8">
                <Leaf className="w-8 h-8 text-[hsl(88,92%,50%)]" />
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Interested in Our Produce?
              </h2>

              <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                We partner with importers, distributors, and retailers worldwide. Contact our export team to discuss your needs and discover the quality of Export Optimum.
              </p>

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
