import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SplitText from '@/components/ui/split-text';

export default function Quality() {
    const qualityImage = PlaceHolderImages.find(p => p.id === 'blog-2');
  return (
    <section id="quality" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <SplitText tag="h2" text="Uncompromising Quality" className="text-4xl md:text-5xl font-headline font-bold" textAlign="left" />
            <SplitText 
              tag="p" 
              text="From our sun-kissed groves in Morocco, we are dedicated to cultivating avocados of the highest quality. Our commitment to excellence begins with meticulous care for our trees and soil, ensuring that every fruit is a testament to nature’s perfection. We adhere to strict international standards, guaranteeing that from farm to port, our avocados meet the pinnacle of freshness and taste." 
              className="mt-4 text-lg text-muted-foreground"
              splitType="words"
              delay={10}
              textAlign="left"
            />
             <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/quality#certifications">
                  Our Certifications <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg group lg:order-last">
            {qualityImage && (
              <Image
                src={qualityImage.imageUrl}
                alt={qualityImage.description}
                width={800}
                height={600}
                className="object-cover w-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                data-ai-hint={qualityImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
