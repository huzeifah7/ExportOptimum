import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { BadgeCheck, Leaf, ShieldCheck } from 'lucide-react';

const certifications = [
  { name: 'GlobalG.A.P. Certified', icon: <BadgeCheck className="w-12 h-12 text-accent" />, description: 'Ensuring safe and sustainable farming practices.' },
  { name: 'Organic Farming', icon: <Leaf className="w-12 h-12 text-accent" />, description: 'Grown naturally without synthetic pesticides or fertilizers.' },
  { name: 'Quality Assured', icon: <ShieldCheck className="w-12 h-12 text-accent" />, description: 'Each avocado is hand-inspected for perfection.' },
];

export default function CertificationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Our Certifications</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our commitment to excellence is certified and guaranteed, from farm to port.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex flex-col items-center p-6 rounded-lg hover:bg-secondary transition-colors duration-300">
                {cert.icon}
                <h3 className="mt-4 text-xl font-bold font-headline">{cert.name}</h3>
                <p className="mt-2 text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
