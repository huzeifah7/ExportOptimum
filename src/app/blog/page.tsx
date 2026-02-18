'use client';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { useRef } from 'react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

const PostCardSkeleton = () => (
  <div className="group">
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
      <Skeleton className="w-full h-full bg-gray-100" />
    </div>
    <Skeleton className="h-4 w-24 rounded-full mb-3 bg-gray-100" />
    <Skeleton className="h-6 w-3/4 mb-3 bg-gray-100" />
    <Skeleton className="h-16 w-full mb-4 bg-gray-100" />
    <Skeleton className="h-4 w-32 bg-gray-100" />
  </div>
);

export default function BlogPage() {
  const firestore = useFirestore();
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('publishDate', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);
  
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'No date';
    return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        
        <main className="flex-grow">
          {/* ══════════════════════════════════════
              HERO — Modern centered with glows
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
                  <BookOpen className="w-3.5 h-3.5" />
                  Our Blog
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
                  Insights from
                  <br />
                  <span style={{
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(135deg, hsl(88,92%,30%) 0%, hsl(88,92%,18%) 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}>the Grove</span>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto"
              >
                Explore insights, updates, and stories from our industry and the heart of our operations.
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
              BLOG GRID
          ══════════════════════════════════════ */}
          <section ref={gridRef} className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              
              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Posts Grid */}
              {!isLoading && posts && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/blog/${post.id}`} className="group block">
                        
                        {/* Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-gray-100 ring-1 ring-gray-100 group-hover:ring-[hsl(88,92%,28%)]/30 transition-all duration-400">
                          {post.imageUrl ? (
                            <>
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                data-ai-hint={post.imageHint}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Category badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[hsl(88,92%,28%)]/8 text-[hsl(88,92%,22%)] border border-[hsl(88,92%,28%)]/15">
                            {post.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[hsl(88,92%,25%)] transition-colors duration-300">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 font-light">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(post.publishDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold text-[hsl(88,92%,25%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Read more
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>

                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (!posts || posts.length === 0) && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet!</h3>
                  <p className="text-gray-500 font-light">Check back soon for insights from the grove.</p>
                </div>
              )}

            </div>
          </section>

        </main>
        
        <Footer />
      </div>
    </>
  );
}