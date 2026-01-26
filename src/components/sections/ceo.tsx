
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Package, Truck } from 'lucide-react';
import SplitText from '@/components/ui/split-text';
import { MagicButton } from '../ui/magic-button';
import { useEffect, useState } from 'react';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="ceo" className="py-16 lg:py-24 bg-foreground text-background">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/Abdo-hd-600x601.png"
                alt="Portrait of Abdellah El Yamlahi, CEO of Export Optimum"
                width={560}
                height={501}
                className="object-cover w-full h-full"
                data-ai-hint="man portrait"
              />
          </div>
          <div>
            {isClient && (
              <>
                <SplitText tag="h2" text="&nbsp;Abdellah&nbsp; El &nbsp;Yamlahi &nbsp;" className="text-5xl font-subtitle text-bold text-accent" textAlign="left" splitType="words" /><br/>
                <SplitText tag="p" text="CEO of Export Optimum" className="mt-2 text-xl font-headline font-bold" textAlign="left" splitType="words" />
                <SplitText tag="p" text="President of Moroccan Avocado exporters association (MAVA)" className="text-lg font-headline font-bold text-muted-foreground" textAlign="left" splitType="words" />
              </>
            )}
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
              {isClient && <MagicButton />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
