import { BadgeCheck, Leaf, ShieldCheck } from 'lucide-react';

const certifications = [
  { name: 'GlobalG.A.P. Certified', icon: <BadgeCheck className="w-12 h-12 text-accent" />, description: 'Ensuring safe and sustainable farming practices.' },
  { name: 'Organic Farming', icon: <Leaf className="w-12 h-12 text-accent" />, description: 'Grown naturally without synthetic pesticides or fertilizers.' },
  { name: 'Quality Assured', icon: <ShieldCheck className="w-12 h-12 text-accent" />, description: 'Each avocado is hand-inspected for perfection.' },
];

export default function Quality() {
  return (
    <section id="quality" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Uncompromising Quality</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Our commitment to excellence is certified and guaranteed, from farm to port.</p>
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
    </section>
  );
}
