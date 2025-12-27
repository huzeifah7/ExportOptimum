
'use client';

import React from 'react';
import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

const testimonialsData = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@Global_Imports",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Export Optimum has consistently delivered exceptional quality. Their avocados are the best on the market, and their logistics are seamless.",
    href: "#"
  },
  {
    author: {
      name: "David Park",
      handle: "@FreshProduceBV",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Working with Export Optimum has been a game-changer. Their commitment to quality and traceability is unmatched. Highly recommended.",
    href: "#"
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@GrocerFreshUK",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "The reliability of their cold chain is impressive. Our customers have noticed the difference in freshness and quality. A truly professional partner.",
    href: "#"
  },
   {
    author: {
      name: "Michael Chen",
      handle: "@MercadoFresco",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our customers love the creamy texture and rich flavor of the Hass avocados from Export Optimum. They are our go-to supplier for premium produce.",
    href: "#"
  }
]

export default function Testimonials() {
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0"
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-8 sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-headline font-bold leading-tight sm:text-5xl sm:leading-tight">
            Trusted By Partners Worldwide
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Our commitment to quality and reliability has earned us the trust of businesses across the globe.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:60s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                testimonialsData.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}
