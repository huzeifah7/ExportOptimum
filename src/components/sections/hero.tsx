import { Award, Ship, Smile } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { icon: <Ship className="w-8 h-8 text-primary" />, value: '10,000+ Tons', label: 'Exported Annually' },
  { icon: <Smile className="w-8 h-8 text-primary" />, value: '99%+', label: 'Client Satisfaction' },
  { icon: <Award className="w-8 h-8 text-primary" />, value: '5-Star', label: 'Quality Rating' },
];

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative w-full h-[90vh] text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold leading-tight">
          Premium Moroccan Avocados
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
          From our sun-kissed groves to your table, experience the rich taste and superior quality of our hand-picked avocados.
        </p>
        <div className="mt-8">
            <Link href="#contact">
                <Button size="lg">Request a Quote</Button>
            </Link>
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  {stat.icon}
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
