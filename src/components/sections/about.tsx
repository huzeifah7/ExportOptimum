import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function About() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-page');

  return (
    <section id="about" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg group">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                width={800}
                height={600}
                className="object-cover w-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">From Our Groves to Your Table</h2>
            <p className="mt-4 text-lg text-muted-foreground font-subtitle text-[2.75rem]">
              With a passion for quality and a commitment to sustainable farming, Avocado Export Hub is a trusted name in the global avocado market. We bring the rich, creamy taste of Moroccan avocados to the world.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
