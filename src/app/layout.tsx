import type { Metadata } from 'next';
import './globals.css';
import './animations.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Public_Sans, PT_Sans, Nunito, Montserrat, Hurricane } from 'next/font/google';

// Optimize font loading with swap display and subsets
const publicSans = Public_Sans({ 
  subsets: ['latin'], 
  variable: '--font-navbar',
  display: 'swap',
});

const ptSans = PT_Sans({ 
  weight: ['400', '700'], 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap',
});

const nunito = Nunito({ 
  subsets: ['latin'], 
  variable: '--font-headline',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-prose',
  display: 'swap',
});

const hurricane = Hurricane({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-subtitle',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Export Optimum | Premium Moroccan Produce',
  description: 'The finest Moroccan Avocados, Berries, and Melons delivered with global excellence and sustainable quality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${publicSans.variable} ${ptSans.variable} ${nunito.variable} ${montserrat.variable} ${hurricane.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-background">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
