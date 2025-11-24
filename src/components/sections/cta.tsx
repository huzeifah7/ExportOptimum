import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Cta() {
  return (
    <section className="bg-brand py-16 lg:py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Partner With Us?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
          Reach out to our team to discuss your needs and learn how we can supply you with the finest Moroccan avocados.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">
              Contact Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
