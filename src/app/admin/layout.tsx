
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
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
  LogOut,
  Settings,
  Home,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
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
import { signOut } from 'firebase/auth';


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
  const auth = useAuth();

  const isLoginPage = (pathname ?? '').startsWith('/admin/login');
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.replace('/admin/login');
  };

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
        <div className="flex h-screen bg-secondary/50">
            <Sidebar 
              variant="sidebar"
              collapsible="icon" 
            >
              <SidebarHeader>
                 <Link href="/" aria-label="Back to site">
                    <Logo />
                </Link>
              </SidebarHeader>
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
              <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-auto p-2 w-full justify-start gap-2">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL || undefined} alt="Admin" />
                                <AvatarFallback>{user?.displayName?.charAt(0) ?? 'A'}</AvatarFallback>
                            </Avatar>
                            <div className="text-left group-data-[collapsible=icon]:hidden">
                                <p className="font-medium text-sm truncate">{user?.displayName || 'Admin'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2 ml-2" align="start" side="right">
                        <DropdownMenuLabel>
                            <p className="font-medium text-sm truncate">{user?.displayName || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </DropdownMenuLabel>
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
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
