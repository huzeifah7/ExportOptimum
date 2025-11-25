
import { posts } from '@/lib/blog-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <article>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{post.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            </div>

            {image && (
              <div className="rounded-lg overflow-hidden shadow-lg mb-8">
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

            <div className="prose prose-lg max-w-none mx-auto text-foreground/90">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('**')) {
                  return <h3 key={index} className="font-bold text-xl mt-6 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>
                }
                return <p key={index} className="mb-4">{paragraph}</p>
              })}
            </div>
          </article>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="text-accent font-bold hover:underline">
              &larr; Back to all blogs
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
