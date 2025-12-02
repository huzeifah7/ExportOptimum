
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SplitText from '@/components/ui/split-text';

export default function About() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-page');

  return (
    <section id="about" className="py-16 lg:py-24 relative">
        <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
                repeating-linear-gradient(
                  to right,
                  black 0px,
                  black 3px,
                  transparent 3px,
                  transparent 8px
                ),
                repeating-linear-gradient(
                  to bottom,
                  black 0px,
                  black 3px,
                  transparent 3px,
                  transparent 8px
                ),
              radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)
          `,
          WebkitMaskImage: `
                      repeating-linear-gradient(
                  to right,
                  black 0px,
                  black 3px,
                  transparent 3px,
                  transparent 8px
                ),
                repeating-linear-gradient(
                  to bottom,
                  black 0px,
                  black 3px,
                  transparent 3px,
                  transparent 8px
                ),
              radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg group">
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
          <div className="lg:col-span-3 text-center lg:text-left">
            <SplitText tag="h2" text="From Our Groves to Your Table" className="text-4xl md:text-5xl font-headline font-bold" textAlign="left" />
            <p className="mt-4 text-lg text-muted-foreground">
              As a trusted name in the global avocado market, we are passionate about quality and committed to sustainable farming. We bring the rich, creamy taste of Moroccan avocados to the world.
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
