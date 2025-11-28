
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  
  useEffect(() => {
    // If auth is no longer loading and a user exists, redirect to dashboard.
    if (!isUserLoading && user) {
      router.replace('/admin/dashboard');
    }
  }, [router, user, isUserLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!auth) {
      setError('Authentication service is not available. Please try again later.');
      setLoading(false);
      return;
    }

    if (username === 'adminX' && password === 'adminx1') {
      try {
        await signInAnonymously(auth);
        // The useEffect will handle the redirect once the user state is updated.
      } catch (authError) {
        console.error("Firebase anonymous sign-in failed:", authError);
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };
  
  // While Firebase is checking the user's auth state, show a full-screen loader.
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  // If a user is already logged in, this component will be blank while useEffect redirects.
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="adminX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
