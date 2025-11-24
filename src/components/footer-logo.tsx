import type { SVGProps } from 'react';

function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      {...props}
    >
      <g transform="rotate(45 50 50)">
        <path
          d="M50 10 C 80 10, 90 20, 90 50 S 80 90, 50 90 S 10 80, 10 50 S 20 10, 50 10 Z"
          className="stroke-accent"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy=".3em"
          fontSize="10"
          fontWeight="bold"
          transform="rotate(-45 50 50)"
          className="fill-accent stroke-none"
        >
          <tspan x="50" dy="-0.5em">EXPORT</tspan>
          <tspan x="50" dy="1.2em">OPTIMUM</tspan>
        </text>
      </g>
    </svg>
  );
}

export function FooterLogo() {
  return (
    <div className="flex items-center gap-2" aria-label="Export Optimum">
      <LogoIcon className="h-16 w-16" />
    </div>
  );
}
