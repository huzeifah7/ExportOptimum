
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirect once the user state is updated.
    } catch (signInError: any) {
        // If sign-in fails, first try to create the user, assuming it might not exist.
        // This is a common pattern for bootstrapping the first admin user.
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // After successful creation, the onAuthStateChanged listener will handle the redirect.
        } catch (signUpError: any) {
            setLoading(false);
            // If sign-up fails because the email is in use, it means the password was wrong.
            if (signUpError.code === 'auth/email-already-in-use') {
                setError('Invalid password. Please check your credentials and try again.');
            } else {
                // Handle other sign-up errors
                console.error("Firebase sign-up failed:", signUpError);
                setError('Failed to create an admin account. Please try again.');
            }
        }
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
