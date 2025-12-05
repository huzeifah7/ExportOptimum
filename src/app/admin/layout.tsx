
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
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
     <nav className="flex-1 px-4 py-6 space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
  )
}

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-xl z-10">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <Link href="/" className="text-lg font-bold tracking-wide text-blue-400">
          EXPORT OPTIMUM
        </Link>
      </div>
      <SidebarNav />
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Export Optimum</p>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full w-full"></div>
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="p-0 bg-slate-900 text-white border-r-0 w-64">
            <div className="flex h-full flex-col">
              <div className="h-16 flex items-center justify-center border-b border-slate-800">
                <Link href="/" className="text-lg font-bold tracking-wide text-blue-400">
                  EXPORT OPTIMUM
                </Link>
              </div>
              <SidebarNav />
            </div>
          </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMobileNavToggle={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
}
