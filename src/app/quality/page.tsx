
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, PackageCheck, Truck, Microscope, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
  { id: 'cert-global-gap', name: 'Global G.A.P.' },
  { id: 'cert-brc-food', name: 'BRC Food' },
  { id: 'cert-smeta', name: 'SMETA' },
  { id: 'cert-grasp', name: 'GRASP' },
  { id: 'cert-bio', name: 'Bio Certified' },
  { id: 'cert-spring', name: 'Spring' },
];

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
                <div key={step.title} className="bg-background p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
                  <div className="flex-shrink-0">{step.icon}</div>
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Certified & Guaranteed</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our adherence to the highest international standards is not just a claim—it's certified. We proudly hold multiple globally-recognized certifications that attest to our commitment to food safety, ethical practices, and sustainable agriculture. These credentials are your assurance that you are partnering with a trusted and responsible supplier.
                    </p>
                     <ul className="mt-6 space-y-3">
                        {certifications.map((cert) => (
                            <li key={cert.id} className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-primary" />
                                <span className="text-lg text-foreground">{cert.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {certifications.map(cert => {
                        const image = PlaceHolderImages.find(p => p.id === cert.id);
                        return (
                            <div key={cert.id} className="bg-secondary/50 p-4 rounded-lg flex items-center justify-center aspect-square transition-transform hover:scale-105 hover:shadow-xl">
                                {image ? (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={128}
                                        height={128}
                                        className="object-contain"
                                        data-ai-hint={image.imageHint}
                                    />
                                ) : (
                                    <div className="text-center font-bold">{cert.name}</div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
