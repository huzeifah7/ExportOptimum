'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const varieties = [
  { id: 'avocado-hass', slug: 'hass', name: 'Hass', description: 'The classic, with a creamy texture and nutty flavor. Perfect for guacamole or on its own.', imageHint: 'avocado hass' },
  { id: 'avocado-fuerte', slug: 'fuerte', name: 'Fuerte', description: 'Smooth, green skin with a rich, oily texture. A popular choice for salads and sandwiches.', imageHint: 'avocado fuerte' },
  { id: 'avocado-zutano', slug: 'zutano', name: 'Zutano', description: 'A mild-flavored avocado with a shiny, yellow-green skin. Great for slicing.', imageHint: 'avocado zutano' },
];

export default function Varieties() {
  const truncate = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  return (
    <section id="varieties" className="py-16 lg:py-24 bg-[#f9fafb] relative">
       <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Avocado Varieties</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-4xl">We cultivate and export several premium varieties to meet global demand.</p>
        </div>
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
        >
          <CarouselContent>
            {varieties.map((variety) => {
              const image = PlaceHolderImages.find(p => p.id === variety.id);
              return (
                <CarouselItem key={variety.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Link href={`/produce/${variety.slug}`} className="block h-full">
                      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
                        <CardHeader className="p-0">
                          {image && (
                            <div className="overflow-hidden">
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                width={600}
                                height={400}
                                className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={variety.imageHint}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col flex-grow">
                          <CardTitle className="font-headline text-2xl">{variety.name}</CardTitle>
                          <CardDescription className="mt-2 text-base flex-grow">{truncate(variety.description, 50)}</CardDescription>
                          <Button variant="link" asChild className="p-0 mt-4 self-start text-accent font-bold">
                              <span>
                                  Read More <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </span>
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
