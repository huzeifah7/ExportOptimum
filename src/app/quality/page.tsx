
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, PackageCheck, Truck, Microscope } from 'lucide-react';
import { cn } from '@/lib/utils';

const qualityProcess = [
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: 'Meticulous Harvesting',
    description: 'Our avocados are hand-picked at the perfect stage of maturity by experienced farmers to ensure optimal flavor, texture, and nutrient content. Each fruit is handled with care to prevent bruising.',
  },
  {
    icon: <Microscope className="w-10 h-10 text-primary" />,
    title: 'Rigorous Sorting & Grading',
    description: 'Upon arrival at our facility, every avocado undergoes a strict inspection for size, quality, and ripeness. We use both advanced technology and expert eyes to sort and grade the fruit according to international standards.',
  },
  {
    icon: <PackageCheck className="w-10 h-10 text-primary" />,
    title: 'State-of-the-Art Packing',
    description: 'We use advanced, automated packing lines to gently place avocados in protective, eco-friendly packaging. This process maintains the fruit\'s integrity and prepares it for its journey.',
  },
  {
    icon: <Truck className="w-10 h-10 text-primary" />,
    title: 'Reliable Cold Chain Logistics',
    description: 'From our packing house to the destination port, our avocados are kept in a temperature-controlled environment. This unbroken cold chain guarantees maximum freshness upon arrival.',
  },
];

const certifications = [
  { id: 'cert-global-gap', name: 'Global G.A.P.', description: 'Ensuring safe and sustainable agricultural production.' },
  { id: 'cert-brc-food', name: 'BRC Food', description: 'Guaranteeing quality, safety, and operational criteria.' },
  { id: 'cert-smeta', name: 'SMETA', description: 'Demonstrating commitment to ethical trade and social responsibility.' },
  { id: 'cert-grasp', name: 'GRASP', description: 'Assessing social practices on the farm, addressing worker health.' },
  { id: 'cert-bio', name: 'Bio Certified', description: 'Confirming organic farming practices and natural integrity.' },
  { id: 'cert-spring', name: 'SPRING', description: 'Promoting sustainable water management in agriculture.' },
  { id: 'cert-usda-organic', name: 'USDA Organic', description: 'Verifying that produce is grown and processed according to federal guidelines.' },
];

const Marquee = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("relative flex w-full overflow-hidden", className)}>
      <div className="flex w-max animate-marquee [--duration:60s] hover:[animation-play-state:paused]">
        {children}
        {children}
      </div>
    </div>
);


export default function QualityPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'quality-hero');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">A Commitment to Excellence</h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl">
              From our groves to your table, we guarantee uncompromising quality at every step of the journey.
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Quality You Can Taste and Trust</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our quality assurance is not just a process; it's a promise. We integrate meticulous care, advanced technology, and rigorous international standards to ensure that every avocado we export is a perfect representation of our commitment to excellence. We believe that true quality is about more than just the final product—it's about the integrity of the entire journey.
                    </p>
                </div>
            </div>
        </section>
        
        {/* Quality Process Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">From Grove to Globe: Our Process</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                A step-by-step look at how we ensure premium quality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {qualityProcess.map((step) => (
                <div key={step.title} className="bg-background p-8 rounded-lg shadow-lg text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">{step.icon}</div>
                  <h3 className="mt-4 text-xl font-bold font-headline">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground flex-grow">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-headline font-bold">Certified &amp; Guaranteed</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Our adherence to the highest international standards is not just a claim—it's certified. We proudly hold multiple globally-recognized credentials.
                </p>
            </div>
            <Marquee>
                {certifications.map((cert) => {
                    const image = PlaceHolderImages.find(p => p.id === cert.id);
                    return (
                        <div key={cert.id} className="relative group mx-8 flex-shrink-0 flex flex-col items-center justify-center h-48 w-48">
                            <div className="relative h-32 w-32 flex items-center justify-center p-4 bg-background rounded-lg border shadow-sm">
                                {image ? (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                        data-ai-hint={image.imageHint}
                                    />
                                ) : (
                                    <div className="text-center font-bold text-sm text-muted-foreground">{cert.name}</div>
                                )}
                            </div>
                            <div className="absolute bottom-0 w-full p-2 bg-background/80 backdrop-blur-sm rounded-b-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm font-semibold text-foreground truncate">{cert.name}</p>
                            </div>
                        </div>
                    )
                })}
            </Marquee>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
