
'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
    <Card className="overflow-hidden shadow-lg flex flex-col h-full bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader className='p-0'>
            <Skeleton className="h-64 w-full" />
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-grow">
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-12 w-full" />
        </CardContent>
    </Card>
);

export default function BlogPage() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('publishDate', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  return (
    <AnimatedGradientBackground>
      <div className="flex flex-col min-h-screen bg-transparent">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">From the Grove</h1>
              <svg
                className="w-40 mx-auto my-4 text-primary"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4C11.5 1.5 22.5 1.5 33 4C43.5 6.5 54.5 6.5 65 4C75.5 1.5 86.5 1.5 97 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                Insights, news, and stories from the world of avocados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
              {posts?.map((post) => {
                return (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group block">
                      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background/50 backdrop-blur-sm border-primary/10">
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
                          <p className="mt-2 text-base text-foreground/80 flex-grow">{post.excerpt}</p>
                      </CardContent>
                      </Card>
                  </Link>
                );
              })}
            </div>
             {!isLoading && posts?.length === 0 && (
                <div className="text-center py-20 text-foreground/80">
                    <h3 className="text-2xl font-headline">No posts yet!</h3>
                    <p>Check back soon for insights from the grove.</p>
                </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}
