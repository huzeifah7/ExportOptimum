import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const partnerIds = ['partner-1', 'partner-2', 'partner-3', 'partner-4', 'partner-5'];

export default function Partners() {
  const partners = partnerIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <section id="partners" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Trusted Partners</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-4xl">We collaborate with leading companies in the global food industry.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {partners.map((partner) => (
            partner &&
            <div key={partner.id}>
              <Image
                src={partner.imageUrl}
                alt={partner.description}
                width={158}
                height={48}
                className="object-contain contrast-0 hover:contrast-100 transition-all duration-300"
                data-ai-hint={partner.imageHint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
