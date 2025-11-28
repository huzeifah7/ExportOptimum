
'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SplitText from '@/components/ui/split-text';
import { Badge } from '../ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  imageUrl?: string;
  imageHint?: string;
  publishDate: Timestamp;
};

const PostCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full bg-background">
        <CardHeader className="p-0">
            <Skeleton className="h-64 w-full" />
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-grow">
            <Skeleton className="h-5 w-1/4 mb-4" />
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-12 w-full" />
            <div className="flex items-center mt-4 pt-4 border-t">
                <Skeleton className="h-6 w-24" />
            </div>
        </CardContent>
    </Card>
);


export default function Blog() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('publishDate', 'desc'), limit(3));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);


  return (
    <section id="blog" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SplitText tag="h2" text="From Our Blog" className="text-4xl md:text-5xl font-headline font-bold" />
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Insights, news, and stories from the world of avocados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && Array.from({length: 3}).map((_, i) => <PostCardSkeleton key={i} />)}
            {posts?.map((post) => {
              return (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background">
                    {post.imageUrl && (
                        <div className="overflow-hidden relative h-64">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={post.imageHint}
                            />
                        </div>
                    )}
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>
                        <h3 className="font-headline text-2xl font-bold">{post.title}</h3>
                        <p className="mt-2 text-base text-muted-foreground flex-grow">{post.excerpt}</p>
                         <div className="flex items-center mt-4 pt-4 border-t">
                            <Button variant="link" className="p-0 text-accent font-bold">
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                    </Card>
                </Link>
              );
            })}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/blog">
              View All Posts <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
