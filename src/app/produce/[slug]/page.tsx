
'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { produce } from '@/lib/produce-data';

const varietiesData = produce.map(p => ({
  ...p,
  origin: 'California, USA', // Default values, can be expanded in produce-data.ts
  season: 'Year-round',
  characteristics: ['Creamy texture', 'Nutty flavor', 'Thick, pebbly skin', 'Skin darkens as it ripens'],
}));

export default function VarietyDetailsPage({ params }: { params: { slug: string } }) {
  const variety = varietiesData.find((v) => v.slug === params.slug);

  if (!variety) {
    notFound();
  }

  const image = PlaceHolderImages.find((p) => p.id === variety.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="rounded-lg overflow-hidden shadow-lg">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={variety.name}
                  width={800}
                  height={600}
                  className="object-cover w-full"
                  data-ai-hint={variety.imageHint}
                />
              )}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{variety.name} Avocado</h1>
              <p className="mt-4 text-lg text-muted-foreground">{variety.description}</p>
              
              <div className="mt-8 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Origin:</h3>
                  <p className="text-muted-foreground">{variety.origin}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Harvest Season:</h3>
                  <p className="text-muted-foreground">{variety.season}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Key Characteristics:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variety.characteristics.map(char => (
                      <Badge key={char} variant="secondary">{char}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">Inquire About {variety.name}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
