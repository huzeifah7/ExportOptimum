
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, Target, Globe, Users, Award, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const timelineEvents = [
  {
    year: '2010',
    title: 'The Seed is Planted',
    description: 'Our founders, driven by a passion for quality agriculture, establish the first avocado groves in the fertile regions of Morocco.',
    imageId: 'timeline-1'
  },
  {
    year: '2015',
    title: 'First International Export',
    description: 'After years of perfecting our cultivation methods, we successfully completed our first international shipment to Europe, marking our entry into the global market.',
    imageId: 'timeline-2'
  },
  {
    year: '2020',
    title: 'Embracing Sustainability',
    description: 'We achieved major sustainability milestones, implementing water-saving irrigation and receiving our first organic certifications.',
    imageId: 'timeline-3'
  },
  {
    year: '2024',
    title: 'Expanding Horizons',
    description: 'With a network spanning continents, we continue to grow, innovate, and share the finest Moroccan avocados with the world.',
    imageId: 'timeline-4'
  },
];

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

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');
  const missionImage = PlaceHolderImages.find(p => p.id === 'about-us-mission');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] text-white">
          {heroImage && (
            <Image 
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Story</h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl">From Moroccan Soil to Global Tables: A Journey of Passion and Quality.</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Rooted in Excellence</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Export Optimum was born from a simple yet powerful idea: to share the exceptional quality and taste of Moroccan avocados with the world. Our journey is one of dedication, innovation, and a deep respect for the land we cultivate. We are more than just exporters; we are custodians of a legacy, committed to delivering nature's finest with every shipment.
                    </p>
                </div>
            </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24 bg-secondary/30 relative">
             <div
                className="absolute inset-0 z-0 opacity-50"
                style={{
                backgroundImage: `
                    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "30px 30px",
                }}
            />
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Journey Through Time</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        A decade of growth, milestones, and unwavering commitment.
                    </p>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border hidden md:block"></div>
                    {timelineEvents.map((event, index) => {
                        const image = PlaceHolderImages.find(p => p.id === event.imageId);
                        const isEven = index % 2 === 0;
                        return (
                        <div key={event.year} className={`flex md:items-center w-full mb-8 md:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <div className="hidden md:flex w-1/2"></div>
                            <div className="hidden md:flex justify-center w-12">
                                <div className="z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">{index + 1}</div>
                            </div>
                            <div className="w-full md:w-1/2 p-4">
                                <div className={`bg-background p-6 rounded-lg shadow-lg border ${isEven ? 'md:ml-4' : 'md:mr-4'}`}>
                                    <h3 className="text-2xl font-headline font-bold text-primary">{event.year}</h3>
                                    <h4 className="text-xl font-bold mt-2">{event.title}</h4>
                                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                                    {image && (
                                        <Image src={image.imageUrl} alt={event.title} width={400} height={250} className="rounded-md mt-4 w-full object-cover h-48" data-ai-hint={image.imageHint}/>
                                    )}
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </section>

        {/* Mission and Vision */}
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                 <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl font-headline font-bold mb-4">Our Mission & Vision</h2>
                        <p className="text-muted-foreground mb-6">
                            Our mission is to be the world's most trusted source of Moroccan avocados, celebrated for their superior quality and our unwavering commitment to sustainable and ethical practices. We envision a future where our avocados enrich tables globally, fostering healthy lifestyles and supporting the communities we work with.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-full"><Award className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold">Commitment to Quality</h4>
                                    <p className="text-sm text-muted-foreground">Delivering excellence from grove to globe, every single time.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-full"><Leaf className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold">Sustainable Practices</h4>
                                    <p className="text-sm text-muted-foreground">Nurturing the land that nurtures us for future generations.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 text-primary rounded-full"><Users className="w-6 h-6" /></div>
                                <div>
                                    <h4 className="font-bold">Community Empowerment</h4>
                                    <p className="text-sm text-muted-foreground">Building strong partnerships and uplifting local communities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg group order-1 lg:order-2">
                        {missionImage && (
                        <Image
                            src={missionImage.imageUrl}
                            alt={missionImage.description}
                            width={800}
                            height={600}
                            className="object-cover w-full group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={missionImage.imageHint}
                        />
                        )}
                    </div>
                 </div>
            </div>
        </section>

        {/* Team Preview */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">The People Behind the Produce</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Our team’s dedication and expertise are the secret ingredients to our success.
              </p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member) => {
                const image = PlaceHolderImages.find((p) => p.id === member.id);
                return (
                    <div key={member.name} className="text-center group">
                        {image && (
                            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-background group-hover:border-primary transition-colors">
                                <Image
                                src={image.imageUrl}
                                alt={member.name}
                                fill
                                className="object-cover"
                                data-ai-hint={member.imageHint}
                                />
                            </div>
                        )}
                        <h3 className="mt-4 text-xl font-bold font-headline">{member.name}</h3>
                        <p className="text-muted-foreground">{member.role}</p>
                    </div>
                );
                })}
            </div>
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/team">Meet Our Full Team</Link>
                </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
