import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SplitText from '@/components/ui/split-text';

export default function About() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-page');

  return (
    <section id="about" className="py-16 lg:py-24">
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
            <SplitText tag="h2" text="From Our Groves to Your Table" className="text-4xl md:text-5xl font-headline font-bold" textAlign="left" />
            <SplitText 
              tag="p" 
              text="As a trusted name in the global avocado market, we are passionate about quality and committed to sustainable farming. We bring the rich, creamy taste of Moroccan avocados to the world." 
              className="mt-4 text-lg text-muted-foreground"
              splitType="words"
              delay={20}
              textAlign="left"
            />
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
