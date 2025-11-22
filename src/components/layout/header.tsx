'use client';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const navItems = [
    { name: 'Vision', href: '/about' },
    { name: 'Export Optimum Team', href: '/team' },
    { name: 'Our Produce', href: '/#varieties' },
    { name: 'Quality', href: '/quality' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Sustainability', href: '/sustainability' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground font-medium relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100 outline-none">
              About Us <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/about">Vision</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/team">Export Optimum Team</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/#varieties" 
            className="text-muted-foreground transition-colors hover:text-foreground font-medium relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Our Produce
          </Link>
          <Link 
            href="/quality" 
            className="text-muted-foreground transition-colors hover:text-foreground font-medium relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Quality
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground font-medium relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100 outline-none">
              News <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/#blog">Blogs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sustainability">Sustainability</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
