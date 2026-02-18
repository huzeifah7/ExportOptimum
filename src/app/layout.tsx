
import type { Metadata } from 'next';
import './globals.css';
import './animations.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Public_Sans, PT_Sans, Nunito, Montserrat, Hurricane } from 'next/font/google';

// Optimize font loading with next/font
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
  title: 'Export Optimum',
  description: 'The finest Produce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${publicSans.variable} ${ptSans.variable} ${nunito.variable} ${montserrat.variable} ${hurricane.variable}`}>
      <body className="font-body antialiased bg-background">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
