
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { posts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);
  const featuredImage = PlaceHolderImages.find(p => p.id === featuredPost.id);

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
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
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Insights, news, and stories from the world of avocados.
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-16 group">
                <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 grid grid-cols-1 md:grid-cols-2">
                        <div className="relative h-64 md:h-full min-h-[300px]">
                        {featuredImage && (
                            <Image
                                src={featuredImage.imageUrl}
                                alt={featuredPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                data-ai-hint={featuredPost.imageHint}
                            />
                        )}
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <Badge variant="secondary" className="mb-2 w-fit">{featuredPost.category}</Badge>
                            <h2 className="text-3xl lg:text-4xl font-headline font-bold">{featuredPost.title}</h2>
                            <p className="mt-4 text-lg text-muted-foreground">{featuredPost.excerpt}</p>
                            <Button variant="link" className="p-0 mt-6 self-start text-accent font-bold">
                                Read More <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                </Link>
            </section>
          )}

          {/* Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherPosts.map((post) => {
              const image = PlaceHolderImages.find(p => p.id === post.id);
              return (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background">
                    {image && (
                        <div className="overflow-hidden relative h-64">
                            <Image
                                src={image.imageUrl}
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
                    </CardContent>
                    </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
