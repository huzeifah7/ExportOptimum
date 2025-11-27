
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { posts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';

export default function BlogPage() {
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
              {posts.map((post) => {
                const image = PlaceHolderImages.find(p => p.id === post.id);
                return (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background/50 backdrop-blur-sm border-primary/10">
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
                          <p className="mt-2 text-base text-foreground/80 flex-grow">{post.excerpt}</p>
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
    </AnimatedGradientBackground>
  );
}
