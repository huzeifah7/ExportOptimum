import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function Contact() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-location');

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="h-6 w-6" />, href: '#', name: 'Twitter' },
    { icon: <Linkedin className="h-6 w-6" />, href: '#', name: 'LinkedIn' },
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold">Get In Touch</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">We're here to answer your questions about our products and export services.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Our Address</h3>
                <p className="text-muted-foreground">123 Avocado Lane, Agadir, Morocco</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Phone</h3>
                <p className="text-muted-foreground">+212 5 28 00 00 00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Email</h3>
                <p className="text-muted-foreground">exports@avocadohub.ma</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map(link => (
                <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-accent" aria-label={link.name}>
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-full min-h-[400px]">
            {mapImage && (
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={800}
                height={600}
                className="object-cover w-full h-full"
                data-ai-hint={mapImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
