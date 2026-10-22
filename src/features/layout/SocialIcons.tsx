import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function FacebookGlyph(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h2.5l.5-3h-3V9a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function InstagramGlyph(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function TwitterGlyph(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function LinkedinGlyph(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 10v7M7 7v.5M11 17v-7M11 13.5a2.5 2.5 0 0 1 5 0V17" />
    </svg>
  );
}

export function YoutubeGlyph(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
