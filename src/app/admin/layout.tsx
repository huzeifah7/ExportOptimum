
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
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
  LogOut,
  Leaf,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.replace('/admin');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.replace('/admin');
  };
  
  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return null; // Redirecting is handled in useEffect
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
             <header className="p-4 border-b flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold font-headline">Admin Panel</h1>
            </header>
            <div className="p-8">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
