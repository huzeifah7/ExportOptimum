'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const varieties = [
  { id: 'avocado-hass', slug: 'hass', name: 'Hass', description: 'The classic, with a creamy texture and nutty flavor. Perfect for guacamole or on its own.', imageHint: 'avocado hass' },
  { id: 'avocado-fuerte', slug: 'fuerte', name: 'Fuerte', description: 'Smooth, green skin with a rich, oily texture. A popular choice for salads and sandwiches.', imageHint: 'avocado fuerte' },
  { id: 'avocado-zutano', slug: 'zutano', name: 'Zutano', description: 'A mild-flavored avocado with a shiny, yellow-green skin. Great for slicing.', imageHint: 'avocado zutano' },
];

export default function ProductsGrid() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {varieties.map((variety) => {
        const image = PlaceHolderImages.find(p => p.id === variety.id);
        return (
            <div key={variety.id} className="p-1 h-full">
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
                        <CardDescription className="mt-2 text-base flex-grow">{variety.description}</CardDescription>
                        <Button variant="link" asChild className="p-0 mt-4 self-start text-accent font-bold">
                            <span>
                                Read More <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                    </CardContent>
                    </Card>
                </Link>
            </div>
        );
      })}
    </div>
  );
}
