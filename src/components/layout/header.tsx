'use client';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { navItems } from './nav-items';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const NavLink = ({ href, children, scrolled }: { href: string, children: React.ReactNode, scrolled: boolean }) => (
  <Link
    href={href}
    className={cn(
      "relative font-medium px-3 py-2 rounded-md transition-colors",
      scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white',
      "after:absolute after:bottom-1 after:left-1/2 after:right-1/2 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:left-0 hover:after:right-0 hover:after:w-full"
    )}
  >
    {children}
  </Link>
);

const NavDropdown = ({ group, scrolled }: { group: (typeof navItems)[number], scrolled: boolean }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className={cn(
        "group/trigger relative flex items-center gap-1 font-medium px-3 py-2 rounded-md transition-colors outline-none",
        scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white',
        "after:absolute after:bottom-1 after:left-1/2 after:right-1/2 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover/trigger:after:left-0 group-hover/trigger:after:right-0 group-hover/trigger:after:w-full"
      )}>
        {group.label} <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {group.items.map(item => (
        <DropdownMenuItem asChild key={item.href}>
          <Link href={item.href}>{item.label}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default function Header() {
  const mobileNavItems = navItems.flatMap(group => group.items || [{ label: group.label, href: group.items?.[0]?.href || '/' }]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {navItems.map((group) => {
            const isSingleItem = !group.items || group.items.length === 1;
            const mainItem = group.items?.[0] ?? { href: '/', label: group.label };

            return isSingleItem ? (
              <NavLink key={group.label} href={mainItem.href} scrolled={scrolled}>
                {group.label}
              </NavLink>
            ) : (
              <NavDropdown key={group.label} group={group} scrolled={scrolled} />
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
            <Button asChild>
                <Link href="/contact">Contact Us</Link>
            </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn("transition-colors", scrolled ? '' : 'text-white bg-transparent border-white/50 hover:bg-white/10 hover:text-white')}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation links for the website.</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <div className="mb-8">
                  <Logo />
                </div>
                <div className="flex flex-col gap-6">
                  {mobileNavItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg font-medium text-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/contact">
                    <Button className="w-full mt-4">Contact Us</Button>
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
