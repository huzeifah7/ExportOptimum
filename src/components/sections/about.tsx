import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">From Our Groves to Your Table</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            With a passion for quality and a commitment to sustainable farming, Avocado Export Hub is a trusted name in the global avocado market. We bring the rich, creamy taste of Moroccan avocados to the world.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/about">
                Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
