import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Logo } from '@/components/logo';
import { navItems } from './nav-items';

const contactDetails = {
	email: 'contact@exportoptimum.com',
	phone: '+1 (234) 567-890',
	address: '123 Produce Lane, Fruit Valley, 90210'
};

const socialLinks = [
	{ label: 'LinkedIn', href: 'https://www.linkedin.com', Icon: Linkedin },
	{ label: 'Facebook', href: 'https://www.facebook.com', Icon: Facebook },
	{ label: 'Instagram', href: 'https://www.instagram.com', Icon: Instagram }
];

export default function Footer() {
	return (
		<footer className="bg-background border-t">
			<div className="container mx-auto py-12 px-6 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-12">
					<div className="lg:col-span-4 space-y-6">
						<Link href="/" aria-label="Back to homepage">
                            <Logo />
                        </Link>
						<p className="text-sm text-muted-foreground">
							Fresh Moroccan produce delivered with traceability, cold-chain reliability, and a commitment to sustainable partnerships.
						</p>
						<div className="space-y-4 text-sm">
							<a
								href={`mailto:${contactDetails.email}`}
								className="flex items-center gap-3 text-muted-foreground transition hover:text-primary"
							>
								<Mail className="h-5 w-5 text-primary" aria-hidden="true" />
								<span>{contactDetails.email}</span>
							</a>
							<a
								href={`tel:${contactDetails.phone.replace(/\s+/g, '')}`}
								className="flex items-center gap-3 text-muted-foreground transition hover:text-primary"
							>
								<Phone className="h-5 w-5 text-primary" aria-hidden="true" />
								<span>{contactDetails.phone}</span>
							</a>
							<div className="flex items-start gap-3 text-muted-foreground">
								<MapPin className="mt-1 h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
								<span>{contactDetails.address}</span>
							</div>
						</div>
					</div>

					<div className="lg:col-span-5 grid grid-cols-2 gap-8">
						{navItems.map((group) => (
							<div key={group.label}>
								<p className="font-headline font-semibold text-foreground">{group.label}</p>
								<ul className="mt-4 space-y-2">
									{group.items?.map((link) => (
										<li key={link.href}>
                                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                {link.label}
                                            </Link>
                                        </li>
									))}
								</ul>
							</div>
						))}
					</div>

					<div className="lg:col-span-3 space-y-6">
                        <div>
                            <p className="font-headline font-semibold text-foreground">Follow Us</p>
                            <div className="mt-4 flex gap-4">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition hover:border-primary hover:bg-accent hover:text-primary"
                                        aria-label={`Follow Export Optimum on ${item.label}`}
                                    >
                                        <item.Icon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </div>
                         <div>
                            <p className="font-headline font-semibold text-foreground">Visit Us</p>
                             <p className="mt-2 text-sm text-muted-foreground">
                                Book a supply visit or virtual walkthrough with our export coordination team.
                            </p>
                        </div>
					</div>
				</div>
				<div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
					© {new Date().getFullYear()} Avocado Export Hub. All rights reserved.
				</div>
			</div>
		</footer>
	)
}
