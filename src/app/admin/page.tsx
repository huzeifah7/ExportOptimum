
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

export default function AdminRootPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [isUserLoading, user, router]);

  // Render a loader while checking auth state to prevent flicker
  return null;
}
