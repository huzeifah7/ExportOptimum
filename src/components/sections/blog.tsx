
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SplitText from '@/components/ui/split-text';
import { posts } from '@/lib/blog-data';

const homePagePosts = posts.slice(0, 3);

export default function Blog() {
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
          {homePagePosts.map((post) => {
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
                    <Link href="#">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
