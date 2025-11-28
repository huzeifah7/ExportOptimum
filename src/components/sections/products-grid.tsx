
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ProduceItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
};

type ProductsGridProps = {
  items: ProduceItem[];
};

export default function ProductsGrid({ items }: ProductsGridProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        return (
            <div key={item.id} className="p-1 h-full">
                <Link href={`/admin/products/edit/${item.id}`} className="block h-full">
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col relative">
                    <Badge variant="secondary" className="absolute top-2 right-2 z-10 capitalize">{item.category}</Badge>
                    <CardHeader className="p-0">
                        {item.imageUrl ? (
                          <div className="overflow-hidden relative w-full h-64">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={item.imageHint}
                              />
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-secondary flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
                        <CardDescription className="mt-2 text-base flex-grow">{item.description}</CardDescription>
                        <Button variant="link" asChild className="p-0 mt-4 self-start text-accent font-bold">
                            <span>
                                Learn More <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                    </CardContent>
                    </Card>
                </Link>
            </div>
        );
      })}
    </div>
  );
}
