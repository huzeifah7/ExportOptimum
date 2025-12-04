
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
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
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/layout/admin-header';


const adminNavItems = [
  {
    href: '/admin/dashboard',
    icon: <LayoutDashboard />,
    label: 'Dashboard',
  },
  {
    href: '/admin/products',
    icon: <Package />,
    label: 'Manage Products',
  },
  {
    href: '/admin/blogs',
    icon: <FileText />,
    label: 'Manage Blogs',
  },
  {
    href: '/admin/hero',
    icon: <ImageIcon />,
    label: 'Manage Hero Section',
  },
  {
    href: '/admin/key-figures',
    icon: <BarChart2 />,
    label: 'Manage Key Figures',
  },
  {
    href: '/admin/about',
    icon: <Info />,
    label: 'Manage About Us',
  },
  {
    href: '/admin/quality',
    icon: <BadgeCheck />,
    label: 'Manage Quality',
  },
  {
    href: '/admin/sustainability',
    icon: <Leaf />,
    label: 'Manage Sustainability',
  },
  {
    href: '/admin/team',
    icon: <Users />,
    label: 'Manage Team',
  },
  {
    href: '/admin/reviews',
    icon: <Star />,
    label: 'Manage Client Reviews',
  },
  {
    href: '/admin/partners',
    icon: <Handshake />,
    label: 'Manage Partners',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If auth state is not loading and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, user, router]);


  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Show a loader while Firebase is determining the auth state
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  // If loading is finished but there is still no user, we are redirecting, so render nothing.
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-secondary/50">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-center p-2">
                <Link href="/" aria-label="Back to site">
                    <Logo />
                </Link>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={pathname.startsWith(item.href)}
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
        <div className="flex-1 flex flex-col overflow-y-auto">
            <AdminHeader />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
