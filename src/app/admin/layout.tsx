
'use client';
import {
  LayoutDashboard,
  Package,
  FileText,
  ImageIcon,
  BarChart2,
  Info,
  BadgeCheck,
  Users,
  Star,
  Handshake,
  Leaf,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AdminHeader from '@/components/layout/admin-header';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { href: '/admin/hero', icon: ImageIcon, label: 'Hero' },
  { href: '/admin/key-figures', icon: BarChart2, label: 'Key Figures' },
  { href: '/admin/about', icon: Info, label: 'About Us' },
  { href: '/admin/quality', icon: BadgeCheck, label: 'Quality' },
  { href: '/admin/sustainability', icon: Leaf, label: 'Sustainability' },
  { href: '/admin/team', icon: Users, label: 'Team' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/partners', icon: Handshake, label: 'Partners' },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <ScrollArea className="flex-1">
     <nav className="px-4 py-6 space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group
                ${isActive 
                  ? 'bg-primary-foreground/10 text-white' 
                  : 'text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white'
                }`}
            >
              <item.icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-primary-foreground/60 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </ScrollArea>
  )
}

function Sidebar() {
  return (
    <aside className="w-64 bg-primary text-primary-foreground hidden md:flex flex-col shadow-xl z-10">
      <div className="h-16 flex items-center justify-center border-b border-primary-foreground/20">
        <Link href="/" className="text-lg font-bold tracking-widest text-primary-foreground">
          EXPORT OPTIMUM
        </Link>
      </div>
      <SidebarNav />
      <div className="p-4 border-t border-primary-foreground/20">
        <div className="bg-primary-foreground/10 rounded-lg p-4">
          <p className="text-xs text-primary-foreground/80 mb-2">Export Optimum</p>
          <div className="w-full bg-primary-foreground/20 rounded-full h-1.5">
            <div className="bg-primary-foreground h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const isLoginPage = (pathname ?? '').startsWith('/admin/login');
  
  useEffect(() => {
    if (!isUserLoading && !user && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, user, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden flex-col">
      <AdminHeader onMobileNavToggle={() => setMobileNavOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="p-0 bg-primary text-primary-foreground border-r-0 w-64">
              <SheetHeader>
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="h-16 flex items-center justify-center border-b border-primary-foreground/20">
                  <Link href="/" className="text-lg font-bold tracking-widest text-primary-foreground">
                    EXPORT OPTIMUM
                  </Link>
                </div>
                <SidebarNav />
              </div>
            </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}
