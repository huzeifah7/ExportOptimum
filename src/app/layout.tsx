import type { Metadata } from 'next';
import './globals.css';
import './animations.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Avocado Export Hub',
  description: 'Premium Moroccan Avocado Exports',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hurricane&family=PT+Sans:wght@400;700&family=Nunito:wght@400;700;800&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background pt-32">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
