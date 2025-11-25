import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, Target, Globe } from 'lucide-react';
import SplitText from '@/components/ui/split-text';

const coreValues = [
  {
    icon: <Leaf className="w-10 h-10 text-accent" />,
    title: 'Sustainability',
    description: 'We are committed to environmentally friendly farming practices that preserve our natural resources for future generations.',
  },
  {
    icon: <Target className="w-10 h-10 text-accent" />,
    title: 'Our Mission',
    description: 'To deliver the finest Moroccan avocados to the world, ensuring premium quality, freshness, and exceptional customer service.',
  },
  {
    icon: <Globe className="w-10 h-10 text-accent" />,
    title: 'Global Reach',
    description: 'From our groves in Morocco, we have built a robust export network to serve clients across Europe, Asia, and North America.',
  },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-page');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">about Export optimum</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Founded in the fertile plains of Morocco, Avocado Export Hub began with a simple mission: to share the exceptional quality of our local avocados with the world.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="rounded-lg overflow-hidden shadow-lg">
              {aboutImage && (
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  width={800}
                  height={600}
                  className="object-cover w-full"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">From Grove to Globe</h2>
              <p className="text-muted-foreground mb-4">
                Our journey started over a decade ago. We have since grown into a leading exporter, but our core values remain the same. We believe in sustainable agriculture, community empowerment, and building lasting partnerships with our clients.
              </p>
              <p className="text-muted-foreground">
                Every avocado we export is a testament to the hard work of our farmers and our commitment to quality. We meticulously manage every step of the process, from nurturing the trees to careful harvesting and climate-controlled shipping, ensuring that you receive a product that is nothing short of perfect.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Core Values</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              The principles that guide our every decision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {coreValues.map((value) => (
              <div key={value.title} className="flex flex-col items-center p-6 rounded-lg">
                {value.icon}
                <h3 className="mt-4 text-xl font-bold font-headline">{value.title}</h3>
                <p className="mt-2 text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
