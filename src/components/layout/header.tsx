
'use client';
import { Logo } from '@/components/logo';
import CardNav from './CardNav';
import { navItems as originalNavItems } from './nav-items';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const cardColors = [
  { bgColor: "#4B6F21", textColor: "#ffffff" },
  { bgColor: "#405D1B", textColor: "#ffffff" },
  { bgColor: "#354B15", textColor: "#ffffff" },
  { bgColor: "#2A3A10", textColor: "#ffffff" },
];

const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const items = originalNavItems.map((item, index) => {
      // Map your original items to the structure CardNav expects
      return {
          label: item.label,
          bgColor: cardColors[index % cardColors.length].bgColor,
          textColor: cardColors[index % cardColors.length].textColor,
          links: item.items?.map(subItem => ({
              label: subItem.label,
              href: subItem.href,
              ariaLabel: subItem.label,
          })) || []
      };
  });

  if (!isClient) {
    return null; // Or a placeholder/skeleton
  }

  return (
    <CardNav
      items={items}
      baseColor="hsl(var(--background))"
      menuColor="hsl(var(--foreground))"
      buttonBgColor="hsl(var(--primary))"
      buttonTextColor="hsl(var(--primary-foreground))"
      ctaLink="/contact"
      className="font-navbar"
    >
        <Link href="/" aria-label="Home">
            <Logo />
        </Link>
    </CardNav>
  );
};

export default App;
