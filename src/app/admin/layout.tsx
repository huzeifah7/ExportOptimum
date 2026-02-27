
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
  PanelLeft,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2, ChevronLeft } from 'lucide-react';
import AdminHeader from '@/components/layout/admin-header';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const adminNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/hero', icon: ImageIcon, label: 'Hero' },
  { href: '/admin/key-figures', icon: BarChart2, label: 'Key Figures' },
  { href: '/admin/about', icon: Info, label: 'About Us' },
  { href: '/admin/quality', icon: BadgeCheck, label: 'Quality' },
  { href: '/admin/sustainability', icon: Leaf, label: 'Sustainability' },
  { href: '/admin/team', icon: Users, label: 'Team' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/partners', icon: Handshake, label: 'Partners' },
  { href: '/admin/contact', icon: Phone, label: 'Contact Info'},
  { href: '/admin/profile', icon: User, label: 'My Profile' },
];

function SidebarNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <ScrollArea className="flex-1">
       <nav className="px-2 py-6 space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
            return (
              <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group',
                         isActive 
                          ? 'bg-primary-foreground/10 text-white' 
                          : 'text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white',
                         isCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon size={20} className={cn('shrink-0', !isCollapsed && 'mr-3')} />
                      <span className={cn('font-medium', isCollapsed && 'sr-only')}>{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                     <TooltipContent side="right" className="flex items-center gap-4">
                        {item.label}
                    </TooltipContent>
                  )}
              </Tooltip>
            )
          })}
        </nav>
      </ScrollArea>
    </TooltipProvider>
  )
}

function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  return (
    <aside className={cn("bg-primary text-primary-foreground hidden md:flex flex-col shadow-xl z-10 transition-[width] duration-300", isCollapsed ? 'w-20' : 'w-64')}>
      <SidebarNav isCollapsed={isCollapsed} />
      <div className="p-4 border-t border-primary-foreground/20">
         <Button
            variant="ghost"
            className="w-full justify-center text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
            onClick={onToggle}
          >
            <ChevronLeft className={cn("h-6 w-6 transition-transform", isCollapsed && "rotate-180")} />
            <span className={cn("sr-only", !isCollapsed && "not-sr-only ml-2")}>{isCollapsed ? 'Expand' : 'Collapse'}</span>
        </Button>
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        
        <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="p-0 bg-primary text-primary-foreground border-r-0 w-64">
              <SheetHeader className="p-4 border-b border-primary-foreground/20">
                 <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <SidebarNav isCollapsed={false} />
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
