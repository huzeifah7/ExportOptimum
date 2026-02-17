'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

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
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-16 lg:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Skeleton className="h-10 w-24 mb-8" />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    <div className="space-y-4 pt-8">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
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
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center text-center py-20">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-destructive">Post Not Found</h1>
                    <p className="mt-4 text-lg text-muted-foreground">We couldn't find the article you're looking for.</p>
                    <Button onClick={() => router.push('/blog')} className="mt-8">
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 hover:text-primary group">
            <Link href="/blog">
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Insights
            </Link>
          </Button>

          <article>
            <header className="mb-12">
              <Badge variant="secondary" className="mb-4 capitalize">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-primary leading-tight">
                {post.title}
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-primary font-medium leading-relaxed italic">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted-foreground border-y py-4 border-border/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={post.imageHint}
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
