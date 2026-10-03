'use client';

import React, { useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  hint?: string;
  className?: string;
}

interface LensState {
  x: number;
  y: number;
  visible: boolean;
}

export function ProductImageZoom({
  src,
  alt,
  priority = false,
  sizes = '100vw',
  hint = 'Hover or press and drag to inspect details',
  className = '',
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerRef = useRef<number | null>(null);
  const [lens, setLens] = useState<LensState>({ x: 50, y: 50, visible: false });

  const updateLens = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setLens({ x, y, visible: true });
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') updateLens(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' && activePointerRef.current !== event.pointerId) return;
    updateLens(event.clientX, event.clientY);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateLens(event.clientX, event.clientY);
  };

  const hideLens = () => {
    activePointerRef.current = null;
    setLens((current) => ({ ...current, visible: false }));
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden cursor-crosshair select-none ${className}`}
      style={{ touchAction: 'none' }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={hideLens}
      onPointerCancel={hideLens}
      onPointerLeave={hideLens}
      aria-label={hint}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center"
      />

      <div
        className={`pointer-events-none absolute z-20 h-36 w-36 sm:h-44 sm:w-44 rounded-full border-2 border-white/90 shadow-[0_10px_35px_rgba(17,17,17,0.28)] ring-1 ring-black/10 transition-opacity duration-150 ${lens.visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${lens.x}%`,
          top: `${lens.y}%`,
          transform: 'translate(-50%, -50%)',
          backgroundImage: `url("${src}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '285% 285%',
          backgroundPosition: `${lens.x}% ${lens.y}%`,
          backgroundColor: '#EAE4D9',
        }}
      />

      <div className="pointer-events-none absolute bottom-3 end-3 z-20 inline-flex items-center gap-1.5 bg-[#111111]/78 px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
        <ZoomIn className="h-3.5 w-3.5" />
        <span>{hint}</span>
      </div>
    </div>
  );
}
