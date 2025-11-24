import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const posts = [
  { id: 'blog-1', title: 'The Health Benefits of Avocados', excerpt: 'Discover why this superfood is a must-have in your diet.', imageHint: 'avocado toast' },
  { id: 'blog-2', title: 'Our Sustainable Farming Practices', excerpt: 'Learn how we grow our avocados with respect for the environment.', imageHint: 'sustainable farming' },
  { id: 'blog-3', title: 'Avocado Recipes You Have to Try', excerpt: 'From breakfast to dessert, explore new ways to enjoy avocados.', imageHint: 'avocado salad' },
];

export default function Blog() {
  return (
    <section id="blog" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">From Our Blog</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-4xl">Insights, news, and stories from the world of avocados.</p>
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
                        alt={image.description}
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
      </div>
    </section>
  );
}
