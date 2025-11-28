
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
  SidebarSeparator,
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
  Settings,
  ShieldCheck,
  Home,
  Loader2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';


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
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If auth state is not loading and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [isUserLoading, user, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    // No need to remove from localStorage, useEffect will handle redirection
    router.replace('/admin/login');
  };

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
          <SidebarFooter className="p-2">
            <SidebarSeparator />
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={() => router.push('/')}
                        tooltip="Back to Site"
                    >
                        <Home />
                        <span>Back to Site</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
             <header className="p-4 border-b flex items-center justify-between gap-4">
                <div className='flex items-center gap-4'>
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold font-headline">Admin Panel</h1>
                </div>
                <div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-auto px-4 flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjM2OTE5NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Admin" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden sm:block">
                                    <p className="font-medium text-sm">Admin</p>
                                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Manage Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                <span>Edit Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div className="p-8">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
