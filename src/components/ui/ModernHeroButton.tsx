'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import './ModernHeroButton.css';

interface ModernHeroButtonProps {
  href: string;
}

export const ModernHeroButton = ({ href }: ModernHeroButtonProps) => {
  return (
    <Link href={href} passHref>
      <button className="modern-hero-button">
        <span className="modern-hero-button__text">Request a Quote</span>
        <span className="modern-hero-button__icon-wrapper">
          <ArrowRight className="modern-hero-button__icon" />
        </span>
      </button>
    </Link>
  );
};
