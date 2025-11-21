'use client';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const navItems = [
    { name: 'Our Produce', href: '/produce' },
    { name: 'Quality', href: '/quality' },
    { name: 'Blog', href: '/#blog' },
  ];

  const mainNavItems = [
    { name: 'Our Produce', href: '/produce' },
    { name: 'Quality', href: '/quality' },
    { name: 'Blog', href: '/#blog' },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {mainNavItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground font-medium">
              {item.name}
            </Link>
          ))}
          <Link href="/#contact">
            <Button>Contact Us</Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-4">
                <div className="mb-8">
                  <Logo />
                </div>
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} className="text-lg font-medium text-foreground hover:text-primary">
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/#contact">
                    <Button className="w-full">Contact Us</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
