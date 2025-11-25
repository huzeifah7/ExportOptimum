import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Leaf, Package, Truck } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="w-8 h-8 text-accent" />,
    label: 'Farmers mentoring and follow up',
  },
  {
    icon: <Package className="w-8 h-8 text-accent" />,
    label: 'State of the art packing facility',
  },
  {
    icon: <Truck className="w-8 h-8 text-accent" />,
    label: 'Supply chain & logistics',
  },
];

export default function Ceo() {
  const ceoImage = PlaceHolderImages.find((p) => p.id === 'ceo-portrait');

  return (
    <section id="ceo" className="py-16 lg:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            {ceoImage && (
              <Image
                src={ceoImage.imageUrl}
                alt={ceoImage.description}
                width={800}
                height={900}
                className="object-cover w-full h-full"
                data-ai-hint={ceoImage.imageHint}
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-subtitle text-accent">Abdellah El Yamlahi</h2>
            <p className="mt-2 text-xl font-headline font-bold">CEO of Export Optimum</p>
            <p className="text-lg font-headline font-bold text-muted-foreground">President of Moroccan Avocado exporters association</p>

            <blockquote className="mt-6 text-lg italic text-muted-foreground relative pl-6 before:content-['\201C'] before:absolute before:left-0 before:top-0 before:text-5xl before:text-accent before:font-serif after:content-['\201D'] after:absolute after:-bottom-4 after:right-0 after:text-5xl after:text-accent after:font-serif">
              At our company, we're proud to offer the highest-quality Moroccan avocados to our customers. We believe that taking good care of our customers is key to our success, which is why we go above and beyond to ensure that our products are fresh, delicious, and delivered on time. We're committed to providing exceptional customer service, and we're always here to answer any questions or concerns you may have. Thank you for choosing us as your trusted source for Moroccan avocados!
            </blockquote>
            
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                {features.map((feature) => (
                    <div key={feature.label} className="flex flex-col items-center">
                        {feature.icon}
                        <p className="mt-2 text-sm text-muted-foreground">{feature.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Link href="/team">
                  Meet Our Team <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
