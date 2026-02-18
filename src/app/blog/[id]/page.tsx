'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { motion } from 'framer-motion';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

const BlogDetailSkeleton = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <Header />
    <main className="flex-grow pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-12 bg-gray-100" />
        <Skeleton className="h-5 w-24 rounded-full mb-6 bg-gray-100" />
        <Skeleton className="h-16 w-full mb-4 bg-gray-100" />
        <Skeleton className="h-6 w-3/4 mb-8 bg-gray-100" />
        <Skeleton className="h-10 w-48 mb-12 bg-gray-100" />
        <Skeleton className="w-full aspect-[21/9] rounded-2xl mb-12 bg-gray-100" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-gray-100" />
          <Skeleton className="h-4 w-full bg-gray-100" />
          <Skeleton className="h-4 w-2/3 bg-gray-100" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const firestore = useFirestore();
  const router = useRouter();

  const blogRef = useMemoFirebase(() => {
    if (!firestore || !blogId) return null;
    return doc(firestore, 'blogPosts', blogId);
  }, [firestore, blogId]);

  const { data: post, isLoading, error } = useDoc<BlogPost>(blogRef);

  if (isLoading || !blogId) {
    return <BlogDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center py-32">
          <div className="max-w-md">
            <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📄</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">We couldn't find the article you're looking for.</p>
            <Button 
              onClick={() => router.push('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(88,92%,27%)] hover:bg-[hsl(88,92%,22%)] text-white font-bold rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readingTime = Math.ceil((post.content || '').split(' ').length / 200);
  const formattedDate = post.publishDate?.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* ══════════════════════════════════════
            HERO — Article header
        ══════════════════════════════════════ */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[hsl(88,92%,25%)] transition-colors duration-300 mb-12 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Insights
              </Link>
            </motion.div>

            <article>
              <header>
                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6"
                >
                  <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[hsl(88,92%,28%)]/10 text-[hsl(88,92%,22%)] border border-[hsl(88,92%,28%)]/20">
                    {post.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6"
                >
                  {post.title}
                </motion.h1>

                {/* Excerpt */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-10"
                >
                  {post.excerpt}
                </motion.p>

                {/* Meta row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-gray-200"
                >
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[hsl(88,92%,28%)]" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[hsl(88,92%,28%)]" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[hsl(88,92%,25%)] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </motion.div>
              </header>
            </article>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURED IMAGE
        ══════════════════════════════════════ */}
        {post.imageUrl && (
          <section className="pb-16 lg:pb-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-100"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={post.imageHint}
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            ARTICLE CONTENT
        ══════════════════════════════════════ */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="prose prose-lg max-w-none 
                prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-light
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-[hsl(88,92%,25%)] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-[hsl(88,92%,28%)] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-600
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-gray-600
                prose-li:mb-2
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:ring-1 prose-img:ring-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            BACK TO BLOG CTA
        ══════════════════════════════════════ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="flex items-center justify-between p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">More Insights</h3>
                <p className="text-sm text-gray-500">Explore our latest articles and updates</p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(88,92%,27%)] hover:bg-[hsl(88,92%,22%)] text-white font-bold rounded-full transition-all duration-300 hover:shadow-lg"
              >
                View All
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}