
'use client';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const PostCardSkeleton = () => (
    <motion.div variants={itemVariants}>
        <Card className="overflow-hidden shadow-sm h-full border-border/50">
            <Skeleton className="h-56 w-full" />
            <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </motion.div>
);

export default function BlogPage() {
  const firestore = useFirestore();

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
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 lg:py-24 bg-gradient-to-br from-green-50 via-gray-50 to-yellow-50 text-center"
        >
            <div className="container mx-auto px-4">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-headline font-bold text-foreground"
                >
                    Insights from the Grove
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
                >
                    Explore insights, updates, and stories from our industry and the heart of our operations.
                </motion.p>
            </div>
        </motion.section>

        {/* Blog Grid */}
        <div className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                >
                {isLoading && Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
                
                {!isLoading && posts?.map((post) => (
                    <motion.div key={post.id} variants={itemVariants}>
                      <Link href={`/blog/${post.id}`} className="group block h-full">
                          <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border-border/50">
                          {post.imageUrl && (
                              <div className="overflow-hidden relative h-56">
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
                              <Badge variant="secondary" className="mb-3 w-fit capitalize">{post.category}</Badge>
                              <h3 className="font-headline text-xl font-bold leading-snug">{post.title}</h3>
                              <p className="mt-3 text-sm text-muted-foreground flex-grow line-clamp-3">{post.excerpt}</p>
                              <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                                <span>{formatDate(post.publishDate)}</span>
                              </div>
                          </CardContent>
                          </Card>
                      </Link>
                    </motion.div>
                ))}
                </motion.div>
                
                {!isLoading && posts?.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground col-span-full">
                        <h3 className="text-2xl font-headline">No posts yet!</h3>
                        <p>Check back soon for insights from the grove.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
