import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  {
    id: 'ceo-portrait',
    name: 'Abdellah El Yamlahi',
    role: 'Owner & CEO',
    bio: 'With over 20 years of experience in agriculture and international trade, Abdellah leads our company with a vision for quality and sustainability. He is also the president of the Moroccan Avocado Exporters Association (MAVA).',
    imageHint: 'man portrait',
  },
  {
    id: 'client-2',
    name: 'Jane Smith',
    role: 'Head of Operations',
    bio: 'Jane orchestrates the complex logistics of getting our avocados from the farm to your table, ensuring freshness and quality every step of the way.',
    imageHint: 'person portrait',
  },
  {
    id: 'client-3',
    name: 'Peter Jones',
    role: 'Lead Agriculturist',
    bio: 'Peter combines traditional farming wisdom with the latest in sustainable agriculture to oversee the health and productivity of our groves.',
    imageHint: 'person portrait',
  },
   {
    id: 'team-member-4',
    name: 'Fatima Zahra',
    role: 'Quality Assurance Manager',
    bio: 'Fatima is responsible for ensuring that every avocado meets our stringent quality standards, from size and ripeness to taste and texture.',
    imageHint: 'person portrait',
  },
  {
    id: 'team-member-5',
    name: 'Youssef Ait Benhaddou',
    role: 'Supply Chain Coordinator',
    bio: 'Youssef manages our network of partner farms, ensuring a steady and reliable supply of premium avocados throughout the season.',
    imageHint: 'person portrait',
  },
  {
    id: 'team-member-6',
    name: 'Emily Williams',
    role: 'International Sales Director',
    bio: 'Emily builds and maintains relationships with our global partners, bringing the taste of Moroccan avocados to new markets.',
    imageHint: 'person portrait',
  }
];

export default function TeamPage() {
  const [ceo, ...otherMembers] = teamMembers;
  const ceoImage = PlaceHolderImages.find((p) => p.id === ceo.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Meet Our Team</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              The passionate individuals dedicated to bringing you the best avocados from Morocco.
            </p>
          </div>

          {/* CEO Section */}
          <div className="mb-20">
            <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
                <div className="grid md:grid-cols-3 items-center">
                    <div className="md:col-span-1">
                        {ceoImage && (
                        <Image
                            src={ceoImage.imageUrl}
                            alt={ceo.name}
                            width={500}
                            height={600}
                            className="object-cover w-full h-full max-h-[600px]"
                            data-ai-hint={ceo.imageHint}
                        />
                        )}
                    </div>
                    <div className="md:col-span-2 p-8 lg:p-12">
                        <h2 className="text-3xl font-headline font-bold text-primary">{ceo.name}</h2>
                        <p className="text-xl font-semibold text-muted-foreground mt-1">{ceo.role}</p>
                        <p className="mt-4 text-foreground/80">{ceo.bio}</p>
                         <div className="mt-6 flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-6 w-6" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
          </div>

          {/* Other Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMembers.map((member) => {
              const image = PlaceHolderImages.find((p) => p.id === member.id);
              return (
                <Card key={member.name} className="flex flex-col text-center overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                  <div className="relative h-64 w-full overflow-hidden">
                    {image && (
                        <Image
                          src={image.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={member.imageHint}
                        />
                    )}
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="font-headline text-2xl font-bold">{member.name}</h3>
                    <p className="text-primary font-semibold mt-1">{member.role}</p>
                    <p className="text-muted-foreground mt-3 text-sm flex-grow">{member.bio}</p>
                    <div className="mt-4 flex justify-center gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary">
                            <Twitter className="h-5 w-5" />
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
