import { Logo } from '@/components/logo';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-6 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <Logo />
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} Avocado Export Hub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
