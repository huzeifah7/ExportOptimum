
'use client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { AnimatedGradientBackground } from '@/components/ui/animated-gradient-background';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  twitter?: string;
};

const TeamMemberSkeleton = () => (
    <Card className="flex flex-col text-center overflow-hidden shadow-lg bg-background/50 backdrop-blur-sm">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-6 flex-grow flex flex-col">
        <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-5 w-1/2 mx-auto mb-3" />
        <Skeleton className="h-12 w-full" />
        <div className="mt-4 flex justify-center gap-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
);

export default function TeamPage() {
  const firestore = useFirestore();
  
  const teamMembersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);
  
  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  return (
    <AnimatedGradientBackground>
      <div className="flex flex-col min-h-screen bg-transparent">
        <Header />
        <main className="flex-grow py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Meet Our Leadership</h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
                The passionate individuals dedicated to bringing you the best avocados from Morocco.
              </p>
            </div>
            
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({length: 6}).map((_, i) => <TeamMemberSkeleton key={i} />)}
              </div>
            )}
            
            {!isLoading && teamMembers && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="flex flex-col text-center overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group bg-background/50 backdrop-blur-sm">
                    <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <h3 className="font-headline text-2xl font-bold">{member.name}</h3>
                      <p className="text-primary font-semibold mt-1">{member.role}</p>
                      <p className="text-muted-foreground mt-3 text-sm flex-grow">{member.bio}</p>
                      <div className="mt-4 flex justify-center gap-4">
                          {member.linkedin && <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <Linkedin className="h-5 w-5" />
                          </Link>}
                          {member.twitter && <Link href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <Twitter className="h-5 w-5" />
                          </Link>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && !teamMembers?.length && (
                 <div className="text-center py-20 text-foreground/80">
                    <h3 className="text-2xl font-headline">Our Team is Growing!</h3>
                    <p>Information about our dedicated team members will be available here soon.</p>
                </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}

    