
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SplitText from '@/components/ui/split-text';

export default function QualityRedesign() {

  return (
    <section
      id="quality"
      className="relative py-24 lg:py-32 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* CONTENT */}
          <div className="lg:col-span-5">
            <Badge className="mb-4 uppercase tracking-widest text-xs bg-primary/10 text-primary border-primary/20">
              Quality & Standards
            </Badge>

            <SplitText
              tag="h2"
              text="Uncompromising quality, at every step"
              className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight"
              textAlign="left"
            />

            <SplitText
              tag="p"
              text="From our sun-kissed groves in Morocco to international export, every avocado is cultivated with precision, patience, and respect for the land."
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
              splitType="words"
              delay={8}
              textAlign="left"
            />

            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
              We follow strict international standards and controlled processes,
              ensuring consistent freshness, traceability, and exceptional taste
              from farm to port.
            </p>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-8 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all group"
            >
              <Link href="/quality#certifications">
                View our certifications
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* IMAGE */}
          <div className="relative lg:col-span-7 rounded-3xl overflow-hidden shadow-2xl group">
              <>
                <Image
                  src="https://californiaavocado.com/wp-content/uploads/2024/03/24-CAC-3536_April_Blog_Imagery_030824_V2__header.jpg"
                  alt="High quality avocados"
                  width={1200}
                  height={900}
                  className="object-cover w-full h-[420px] lg:h-[520px] transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint="avocado quality"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />

                {/* Label */}
                <div className="absolute bottom-6 left-6 text-white text-sm tracking-wide">
                  Certified • Traceable • Export-ready
                </div>
              </>
          </div>
        </div>
      </div>
    </section>
  );
}
