import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  {
    id: 'client-1',
    name: 'John Doe',
    role: 'Chief Executive Officer',
    imageHint: 'person portrait',
  },
  {
    id: 'client-2',
    name: 'Jane Smith',
    role: 'Head of Operations',
    imageHint: 'person portrait',
  },
  {
    id: 'client-3',
    name: 'Peter Jones',
    role: 'Lead Agriculturist',
    imageHint: 'person portrait',
  },
];

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Meet Our Team</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground font-subtitle text-5xl">
              The passionate individuals dedicated to bringing you the best avocados from Morocco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => {
              const image = PlaceHolderImages.find((p) => p.id === member.id);
              return (
                <Card key={member.name} className="text-center overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                  <CardHeader className="p-0">
                    {image && (
                      <div className="overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={member.name}
                          width={400}
                          height={400}
                          className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={member.imageHint}
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="font-headline text-2xl">{member.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{member.role}</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="h-6 w-6" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary">
                            <Twitter className="h-6 w-6" />
                        </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
