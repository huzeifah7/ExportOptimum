'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD = 28 * 60 * 1000; // 28 minutes
const STORAGE_KEY = 'admin_last_activity';

/**
 * SessionTimeoutGuard tracks user activity and automatically logs them out 
 * after a period of inactivity. It synchronizes activity across tabs.
 */
export function SessionTimeoutGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  
  const [showWarning, setShowWarning] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    if (!auth || isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Clear activity from storage so other tabs also react
      localStorage.removeItem(STORAGE_KEY);
      await signOut(auth);
      router.replace('/admin/login');
    } catch (error) {
      console.error("Logout failed during session timeout:", error);
      // Fallback redirect even if signout fails
      window.location.href = '/admin/login';
    } finally {
      setIsLoggingOut(false);
      setShowWarning(false);
    }
  }, [auth, router, isLoggingOut]);

  const resetTimers = useCallback((isExternalSync = false) => {
    if (showWarning) setShowWarning(false);
    
    const now = Date.now();
    if (!isExternalSync) {
      lastActivityRef.current = now;
      localStorage.setItem(STORAGE_KEY, now.toString());
    } else {
      // If synced from another tab, just update the ref
      const storedTime = localStorage.getItem(STORAGE_KEY);
      if (storedTime) lastActivityRef.current = parseInt(storedTime);
    }

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    const timeSinceActivity = now - lastActivityRef.current;
    
    const remainingWarningTime = Math.max(0, WARNING_THRESHOLD - timeSinceActivity);
    const remainingLogoutTime = Math.max(0, INACTIVITY_LIMIT - timeSinceActivity);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, remainingWarningTime);

    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, remainingLogoutTime);
  }, [handleLogout, showWarning]);

  useEffect(() => {
    if (!user) return;

    // Standard inactivity events
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      const now = Date.now();
      // Throttle updates to every 2 seconds for performance
      if (now - lastActivityRef.current > 2000) {
        resetTimers();
      }
    };

    // Check expiration when coming back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedTime = localStorage.getItem(STORAGE_KEY);
        const lastTime = storedTime ? parseInt(storedTime) : lastActivityRef.current;
        const inactiveTime = Date.now() - lastTime;
        
        if (inactiveTime >= INACTIVITY_LIMIT) {
          handleLogout();
        } else if (inactiveTime >= WARNING_THRESHOLD) {
          setShowWarning(true);
        } else {
          resetTimers(true);
        }
      }
    };

    // Listen for activity in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        lastActivityRef.current = parseInt(e.newValue);
        resetTimers(true);
      }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Initial timer setup
    resetTimers();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [user, resetTimers, handleLogout]);

  return (
    <>
      {children}
      
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="max-w-[400px] rounded-2xl border-primary/20 shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-2">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-xl font-headline font-black text-center">
              Session Security Warning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 font-prose">
              Your administrative session will expire in <strong>2 minutes</strong> due to inactivity. Would you like to extend your session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="flex-1 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              Logout Now
            </Button>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                resetTimers();
              }} 
              className="flex-1 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Stay Logged In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-headline font-black text-gray-900">Ending Session</h2>
          <p className="mt-2 text-gray-500 font-prose text-sm uppercase tracking-widest font-bold">
            Securely logging you out...
          </p>
        </div>
      )}
    </>
  );
}
