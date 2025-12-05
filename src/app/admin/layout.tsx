'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
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
import React, { useEffect } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AdminHeader from '@/components/layout/admin-header';

const adminNavItems = [
  { href: '/admin/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/admin/products', icon: <Package />, label: 'Manage Products' },
  { href: '/admin/blogs', icon: <FileText />, label: 'Manage Blogs' },
  { href: '/admin/hero', icon: <ImageIcon />, label: 'Manage Hero Section' },
  { href: '/admin/key-figures', icon: <BarChart2 />, label: 'Manage Key Figures' },
  { href: '/admin/about', icon: <Info />, label: 'Manage About Us' },
  { href: '/admin/quality', icon: <BadgeCheck />, label: 'Manage Quality' },
  { href: '/admin/sustainability', icon: <Leaf />, label: 'Manage Sustainability' },
  { href: '/admin/team', icon: <Users />, label: 'Manage Team' },
  { href: '/admin/reviews', icon: <Star />, label: 'Manage Client Reviews' },
  { href: '/admin/partners', icon: <Handshake />, label: 'Manage Partners' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

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
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-secondary/50">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              variant="inset"
              collapsible="icon" 
            >
              <SidebarContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => router.push(item.href)}
                        isActive={pathname?.startsWith(item.href)}
                        tooltip={item.label}
                        size="sm"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
