
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { posts } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Blogs</h1>
            <div className="w-24 h-1 bg-primary mx-auto my-4"></div>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Insights, news, and stories from the world of avocados.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const image = PlaceHolderImages.find(p => p.id === post.id);
              return (
                <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group">
                  {image && (
                    <CardHeader className="p-0">
                      <div className="overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={image.description || post.title}
                          width={600}
                          height={400}
                          className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={post.imageHint}
                        />
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                    <CardDescription className="mt-2 text-base flex-grow">{post.excerpt}</CardDescription>
                    <Button variant="link" asChild className="p-0 mt-4 self-start text-accent font-bold">
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
