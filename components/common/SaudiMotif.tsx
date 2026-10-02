import React from 'react';

interface SaudiMotifProps {
  className?: string;
  variant?: 'divider' | 'mark' | 'corner';
}

export function SaudiMotif({ className = '', variant = 'divider' }: SaudiMotifProps) {
  if (variant === 'mark') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block ${className}`}
        aria-hidden="true"
      >
        <path
          d="M12 2L15 8L21 9.5L16.5 14L18 20L12 17L6 20L7.5 14L3 9.5L9 8L12 2Z"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
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
