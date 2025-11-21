import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

const varieties = [
  { id: 'avocado-hass', slug: 'hass', name: 'Hass', description: 'The classic, with a creamy texture and nutty flavor. Perfect for guacamole or on its own.', imageHint: 'avocado hass' },
  { id: 'avocado-fuerte', slug: 'fuerte', name: 'Fuerte', description: 'Smooth, green skin with a rich, oily texture. A popular choice for salads and sandwiches.', imageHint: 'avocado fuerte' },
  { id: 'avocado-zutano', slug: 'zutano', name: 'Zutano', description: 'A mild-flavored avocado with a shiny, yellow-green skin. Great for slicing.', imageHint: 'avocado zutano' },
];

export default function Varieties() {
  return (
    <section id="varieties" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Avocado Varieties</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">We cultivate and export several premium varieties to meet global demand.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {varieties.map((variety) => {
            const image = PlaceHolderImages.find(p => p.id === variety.id);
            return (
              <Link key={variety.id} href={`/produce/${variety.slug}`}>
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full">
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
                  <CardContent className="p-6">
                    <CardTitle className="font-headline text-2xl">{variety.name}</CardTitle>
                    <CardDescription className="mt-2 text-base">{variety.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
