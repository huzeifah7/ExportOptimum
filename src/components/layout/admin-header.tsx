
'use client';

import { Logo } from '@/components/logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
import { useAuth, useUser } from '@/firebase';
import { Home, LogOut, Settings } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    
    const handleLogout = async () => {
        if (auth) {
          await signOut(auth);
        }
        router.replace('/admin/login');
    };

    return (
        <header className="h-16 flex items-center justify-between px-4 border-b bg-background z-20">
            <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <Link href="/" aria-label="Back to site">
                    <Logo />
                </Link>
                 <h1 className="text-xl font-semibold hidden md:block">Admin Panel</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || undefined} alt="Admin" />
                            <AvatarFallback>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'A'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.displayName || 'Admin'}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
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
        </header>
    );
}
