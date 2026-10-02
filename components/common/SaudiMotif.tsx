import React from 'react';

interface SaudiMotifProps {
  className?: string;
  variant?: 'divider' | 'mark' | 'corner';
}

export function SaudiMotif({ className = '', variant = 'divider' }: SaudiMotifProps) {
  if (variant === 'mark') {
    // Abstract geometric stepped diamond inspired by Najdi architectural ventilation apertures
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        aria-hidden="true"
      >
        <path
          d="M10 2L18 10L10 18L2 10L10 2Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path
          d="M10 6L14 10L10 14L6 10L10 6Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <rect x="9.25" y="9.25" width="1.5" height="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Refined architectural linear rhythm inspired by Najdi triangular embrasures and Sadu precision
  return (
    <div className={`w-full flex items-center justify-center gap-3 py-2 text-[#B59A73]/60 ${className}`} aria-hidden="true">
      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#242220]/15 to-[#B59A73]/40" />
      <div className="flex items-center gap-1.5 opacity-75">
        <span className="w-1 h-1 rotate-45 border border-current" />
        <span className="w-1.5 h-1.5 rotate-45 bg-current" />
        <span className="w-1 h-1 rotate-45 border border-current" />
      </div>
      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#242220]/15 to-[#B59A73]/40" />
    </div>
  );
}
