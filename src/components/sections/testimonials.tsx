import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  { id: 'client-1', name: 'John Doe', company: 'Global Grocers', text: 'The quality of avocados from Avocado Export Hub is consistently outstanding. Our customers love them!', imageHint: 'person portrait' },
  { id: 'client-2', name: 'Jane Smith', company: 'Fresh Foods Inc.', text: 'Reliable, professional, and always delivering the best. They are our go-to partner for avocados.', imageHint: 'person portrait' },
  { id: 'client-3', name: 'Peter Jones', company: 'Organic Market', text: 'Their organic avocados are second to none. The taste and texture are perfect.', imageHint: 'person portrait' },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">What Our Clients Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground font-subtitle text-[33px] tracking-wide">We pride ourselves on building lasting relationships based on trust and quality.</p>
        </div>
        <Carousel opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const image = PlaceHolderImages.find(p => p.id === testimonial.id);
              return (
                <CarouselItem key={testimonial.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
                        <blockquote className="text-lg italic text-muted-foreground">"{testimonial.text}"</blockquote>
                        <div className="flex items-center mt-6">
                          {image && (
                            <Avatar>
                              <AvatarImage src={image.imageUrl} alt={image.description} data-ai-hint={testimonial.imageHint} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="ml-4 text-left">
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
