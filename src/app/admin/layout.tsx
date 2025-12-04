
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
  MoreHorizontal,
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
import Link from 'next/link';


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
      <div className="flex h-screen bg-secondary/50">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
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
          <SidebarFooter className="p-2">
            <SidebarSeparator />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto w-full justify-start p-2">
                        <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL || undefined} alt="Admin" />
                                <AvatarFallback>{user?.displayName?.charAt(0) ?? 'A'}</AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden group-data-[state=expanded]:block">
                                <p className="font-medium text-sm truncate">{user?.displayName || 'Admin'}</p>
                            </div>
                        </div>
                        <MoreHorizontal className="h-4 w-4 hidden ml-auto group-data-[state=expanded]:block" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin/profile">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Manage Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            <span>Back to Site</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col overflow-y-auto">
             <header className="p-4 border-b flex items-center justify-between gap-4 bg-background">
                <div className='flex items-center gap-4'>
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold font-headline">Admin Panel</h1>
                </div>
                {/* User dropdown removed from here */}
            </header>
            <div className="p-8 flex-1">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
