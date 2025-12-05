'use client';

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
import { Home, LogOut, Settings, Bell, ChevronDown, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from "../logo";

interface AdminHeaderProps {
  onMobileNavToggle: () => void;
}

export default function AdminHeader({ onMobileNavToggle }: AdminHeaderProps) {
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
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm">
          {/* LEFT: Mobile nav toggle and search */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileNavToggle}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="hidden md:block">
              <Link href="/">
                <Logo />
              </Link>
            </div>
          </div>

          {/* CENTER: Admin Panel Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/admin/dashboard" className="text-lg font-semibold text-gray-600 bg-gray-100 px-4 py-1 rounded-full hidden md:block">
              Admin Panel
            </Link>
            <div className="md:hidden">
              <Link href="/">
                  <Logo />
              </Link>
            </div>
          </div>

          {/* RIGHT: Profile Info & Dropdown */}
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 focus:outline-none group p-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 h-auto">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || undefined} alt="Admin" />
                            <AvatarFallback>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start">
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{user?.displayName || 'Admin'}</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
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
                            <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            <span>Back to Site</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
    );
}