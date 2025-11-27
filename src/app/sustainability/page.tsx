
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, Recycle, Sun, Droplets, Wind, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SplitText from '@/components/ui/split-text';

const keyInitiatives = [
  {
    icon: <Droplets className="w-10 h-10 text-primary" />,
    title: 'Water Conservation',
    description: 'Implementing state-of-the-art drip irrigation systems across all our groves to minimize water usage while maximizing crop health and yield. We recycle water wherever possible.',
  },
  {
    icon: <Sun className="w-10 h-10 text-primary" />,
    title: 'Renewable Energy',
    description: 'Our packing facilities and farm operations are increasingly powered by solar energy, drastically reducing our carbon footprint and our dependency on fossil fuels.',
  },
  {
    icon: <Recycle className="w-10 h-10 text-primary" />,
    title: 'Waste Reduction & Composting',
    description: 'We practice comprehensive composting of all organic waste, returning valuable nutrients to the soil. Our packaging is designed to be minimal and recyclable.',
  },
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: 'Soil Health & Biodiversity',
    description: 'Through crop rotation, cover crops, and avoiding chemical fertilizers, we enrich our soil naturally. This promotes a healthy microbiome and supports local biodiversity.',
  },
  {
    icon: <Wind className="w-10 h-10 text-primary" />,
    title: 'Carbon Sequestration',
    description: 'Our avocado groves act as significant carbon sinks. We are actively planting more trees and employing regenerative agriculture techniques to maximize CO2 capture.',
  },
  {
    icon: <Globe className="w-10 h-10 text-primary" />,
    title: 'Ethical Supply Chain',
    description: 'Sustainability extends to our people. We ensure fair labor practices, invest in our local communities, and maintain full transparency throughout our supply chain.',
  },
];

export default function SustainabilityPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');
  const philosophyImage = PlaceHolderImages.find(p => p.id === 'about-us-mission');

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
            <SplitText tag="h1" text="Cultivating a Greener Tomorrow" className="text-4xl md:text-6xl font-headline font-bold" />
            <SplitText
              tag="p"
              text="Our commitment to the planet is as deep as our roots in Moroccan soil."
              className="mt-4 max-w-3xl text-lg md:text-xl"
              splitType="words"
            />
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                 <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-headline font-bold mb-4 text-primary">Our Philosophy: Harmony with Nature</h2>
                        <p className="text-muted-foreground mb-4 text-lg">
                           For us, sustainability isn't a department; it's our entire business model. We believe that the highest quality produce can only come from a healthy, thriving ecosystem. It is our fundamental responsibility to be stewards of the land we cultivate, ensuring it remains fertile and vibrant for generations of farmers to come.
                        </p>
                        <p className="text-muted-foreground text-lg">
                           This philosophy guides every decision we make—from water management and energy use to community engagement and packaging choices. We are constantly innovating to find new ways to reduce our impact and enhance the natural environment.
                        </p>
                         <div className="mt-8">
                            <Button asChild size="lg" variant="outline">
                                <Link href="/quality#certifications">View Our Certifications</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg group">
                        {philosophyImage && (
                        <Image
                            src={philosophyImage.imageUrl}
                            alt={philosophyImage.description}
                            width={800}
                            height={600}
                            className="object-cover w-full group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={philosophyImage.imageHint}
                        />
                        )}
                    </div>
                 </div>
            </div>
        </section>


        {/* Key Initiatives Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Key Initiatives</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                We are actively implementing practices that nurture our planet and our communities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyInitiatives.map((initiative) => (
                <div key={initiative.title} className="bg-background p-8 rounded-lg shadow-lg text-center flex flex-col items-center border border-transparent hover:border-primary hover:-translate-y-2 transition-all duration-300">
                  <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mb-4">
                    {initiative.icon}
                  </div>
                  <h3 className="mt-2 text-xl font-bold font-headline">{initiative.title}</h3>
                  <p className="mt-2 text-muted-foreground flex-grow">{initiative.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
