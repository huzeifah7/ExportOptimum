
'use client';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  slug: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

const BlogDetailSkeleton = () => (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <article className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <Skeleton className="h-6 w-24 mx-auto mb-4" />
                        <Skeleton className="h-12 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-full max-w-lg mx-auto mt-4" />
                        <div className="flex items-center justify-center mt-6 gap-8">
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                    <Skeleton className="w-full h-[500px] rounded-lg mb-12" />
                     <div className="prose prose-lg max-w-none mx-auto">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                     </div>
                </article>
            </div>
        </main>
        <Footer />
    </div>
);


export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const firestore = useFirestore();

  const blogPostQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(
        collection(firestore, 'blogPosts'), 
        where('slug', '==', slug),
        limit(1)
    );
  }, [firestore, slug]);

  const { data: posts, isLoading: isCollectionLoading } = useCollection<BlogPost>(blogPostQuery);
  
  const post = posts?.[0];

  useEffect(() => {
      // This effect triggers a re-render once loading is complete but no post is found.
      // This is necessary for notFound() to work correctly in a client component.
      if (!isCollectionLoading && !post) {
        notFound();
      }
  }, [isCollectionLoading, post]);
  

  if (isCollectionLoading || !post) {
    return <BlogDetailSkeleton />;
  }
  
  const readingTime = Math.ceil(post.content.split(' ').length / 200); // Average reading speed

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">{post.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-headline font-bold">{post.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                 <div className="flex items-center justify-center mt-6 gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>
            </div>

            {post.imageUrl && (
              <div className="rounded-lg overflow-hidden shadow-lg mb-12">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="object-cover w-full max-h-[500px]"
                  data-ai-hint={post.imageHint}
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none mx-auto text-foreground/90 dark:prose-invert prose-headings:font-headline">
              {post.content.split('\\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return <h3 key={index} className="font-bold text-2xl mt-8 mb-4">{trimmed.substring(2, trimmed.length-2)}</h3>
                }
                if(trimmed.length > 0){
                    return <p key={index} className="mb-4 leading-relaxed">{trimmed}</p>
                }
                return null;
              })}
            </div>
          </article>
          
          <div className="text-center mt-16">
            <Button asChild variant="outline">
                <Link href="/blog">
                &larr; Back to all blogs
                </Link>
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
