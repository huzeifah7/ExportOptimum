import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SplitText from '@/components/ui/split-text';

const partnerIds = ['partner-1', 'partner-2', 'partner-3', 'partner-4', 'partner-5'];

export default function Partners() {
  const partners = partnerIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <section id="partners" className="py-16 lg:py-24 relative bg-background">
       <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <SplitText tag="h2" text="Our Trusted Partners" className="text-4xl md:text-5xl font-headline font-bold" />
          <SplitText 
            tag="p" 
            text="We collaborate with leading companies in the global food industry." 
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-[36px] tracking-wide"
            splitType="words"
            delay={20}
          />
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
