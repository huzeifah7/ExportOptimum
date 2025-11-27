'use client';
import { Logo } from '@/components/logo';
import CardNav from './CardNav';
import { navItems as originalNavItems } from './nav-items';
import Link from 'next/link';

const App = () => {
  const items = originalNavItems.map(item => {
      // Map your original items to the structure CardNav expects
      return {
          label: item.label,
          bgColor: "#0D0716", // Example color, adjust as needed
          textColor: "#fff", // Example color, adjust as needed
          links: item.items?.map(subItem => ({
              label: subItem.label,
              href: subItem.href,
              ariaLabel: subItem.label,
          })) || []
      };
  });

  return (
    <CardNav
      items={items}
      baseColor="hsl(var(--background))"
      menuColor="hsl(var(--foreground))"
      buttonBgColor="hsl(var(--primary))"
      buttonTextColor="hsl(var(--primary-foreground))"
      ctaLink="/contact"
    >
        <Link href="/" aria-label="Home">
            <Logo />
        </Link>
    </CardNav>
  );
};

export default App;
