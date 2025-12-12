'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import './ModernHeroButton.css';

interface ModernHeroButtonProps {
  href: string;
  label: string;
}

export const ModernHeroButton = ({ href, label }: ModernHeroButtonProps) => {
  return (
    <Link href={href} passHref>
      <button className="modern-hero-button">
        <span className="modern-hero-button__text">{label}</span>
        <span className="modern-hero-button__icon-wrapper">
          <ArrowRight className="modern-hero-button__icon" />
        </span>
      </button>
    </Link>
  );
};
