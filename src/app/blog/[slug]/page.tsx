
import { posts } from '@/lib/blog-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const image = PlaceHolderImages.find((p) => p.id === post.id);
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
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>By {post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>
            </div>

            {image && (
              <div className="rounded-lg overflow-hidden shadow-lg mb-12">
                <Image
                  src={image.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="object-cover w-full max-h-[500px]"
                  data-ai-hint={post.imageHint}
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none mx-auto text-foreground/90 dark:prose-invert prose-headings:font-headline">
              {post.content.split('\n').map((paragraph, index) => {
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
