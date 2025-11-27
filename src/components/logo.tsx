import type { SVGProps } from 'react';

function AvocadoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      {...props}
    >
      <path d="M346.3,34.42C307.6,1.47,243-13.13,200.3,21.5,147.4,63.14,144,142,149.2,192.3c-13,28-36.5,52.1-70.9,74.6-43.2,28.2-83.5,61.2-94,116.8-13.4,70.5,39.9,139.1,109.4,152.5,70.6,13.4,139.1-39.9,152.5-109.4,7.4-39.1-2.9-72.3-25.5-101.9,47.4-23.4,78.2-67.4,85.2-120.7,11.3-86.4-36.3-162.3-95.1-199.72ZM266.9,289.2a61,61,0,1,1,61-61A61.07,61.07,0,0,1,266.9,289.2Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Avocado Export Hub">
      <AvocadoIcon className="h-8 w-8 text-accent" />
      <span className="hidden sm:inline-block font-headline text-xl font-bold">
        Avocado Export Hub
      </span>
    </div>
  );
}