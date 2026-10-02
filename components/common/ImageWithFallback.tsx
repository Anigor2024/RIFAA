'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-[#E8E2D7] text-[#242220] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F4EF] via-[#E8E2D7] to-[#D9D0C4] opacity-80" />
        <div className="relative z-10 text-center">
          <span className="font-editorial text-xl tracking-widest text-[#511D24]">RIFAA</span>
          <p className="text-[11px] text-[#242220]/60 mt-1 uppercase tracking-wider line-clamp-1">{alt || 'Silhouettes'}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
