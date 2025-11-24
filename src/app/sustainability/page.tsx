import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, Recycle, Sun } from 'lucide-react';

const sustainabilityGoals = [
  {
    icon: <Leaf className="w-10 h-10 text-accent" />,
    title: 'Water Conservation',
    description: 'Implementing state-of-the-art drip irrigation systems to minimize water usage while maximizing crop yield.',
  },
  {
    icon: <Sun className="w-10 h-10 text-accent" />,
    title: 'Renewable Energy',
    description: 'Our farms are increasingly powered by solar energy, reducing our carbon footprint and dependency on fossil fuels.',
  },
  {
    icon: <Recycle className="w-10 h-10 text-accent" />,
    title: 'Waste Reduction',
    description: 'We practice composting and other recycling methods to ensure that nothing goes to waste, enriching our soil naturally.',
  },
];

export default function SustainabilityPage() {
  const sustainabilityImage = PlaceHolderImages.find(p => p.id === 'blog-2');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Commitment to Sustainability</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground font-subtitle text-[36px] tracking-wide">
              We believe that great avocados come from a healthy planet. Learn about our initiatives to protect the environment for generations to come.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="rounded-lg overflow-hidden shadow-lg">
              {sustainabilityImage && (
                <Image
                  src={sustainabilityImage.imageUrl}
                  alt={sustainabilityImage.description}
                  width={800}
                  height={600}
                  className="object-cover w-full"
                  data-ai-hint={sustainabilityImage.imageHint}
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Growing a Greener Future</h2>
              <p className="text-muted-foreground mb-4">
                Sustainability isn't just a buzzword for us; it's at the core of everything we do. From the soil we cultivate to the packaging we use, every decision is made with the planet in mind. We are dedicated to pioneering sustainable agricultural practices in Morocco.
              </p>
              <p className="text-muted-foreground">
                Our approach combines traditional farming wisdom with modern technology to create a system that is both productive and ecologically sound. We are proud to contribute to a global food system that is healthier for people and the planet.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Sustainability Goals</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-[36px] tracking-wide">
              Specific actions we're taking to make a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {sustainabilityGoals.map((value) => (
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
