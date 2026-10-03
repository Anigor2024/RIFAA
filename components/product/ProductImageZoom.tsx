'use client';

import React, { useRef, useState } from 'react';
import { ScanSearch, ZoomIn } from 'lucide-react';
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

const ZOOM_LEVELS = [6, 9] as const;
type ZoomLevel = (typeof ZOOM_LEVELS)[number];

export function ProductImageZoom({
  src,
  alt,
  priority = false,
  sizes = '100vw',
  hint = 'Hover or press and drag to inspect fabric details',
  className = '',
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerRef = useRef<number | null>(null);
  const [lens, setLens] = useState<LensState>({ x: 50, y: 50, visible: false });
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(6);

  const updateLens = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setLens({ x, y, visible: true });
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') {
      updateLens(event.clientX, event.clientY);
    }
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

  const backgroundScale = `${zoomLevel * 100}% ${zoomLevel * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden cursor-crosshair select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
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
        className={`pointer-events-none absolute z-20 h-40 w-40 sm:h-52 sm:w-52 rounded-full border-[3px] border-white shadow-[0_16px_48px_rgba(17,17,17,0.34)] ring-1 ring-black/15 transition-opacity duration-100 ${
          lens.visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${lens.x}%`,
          top: `${lens.y}%`,
          transform: 'translate(-50%, -50%)',
          backgroundImage: `url("${src}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: backgroundScale,
          backgroundPosition: `${lens.x}% ${lens.y}%`,
          backgroundColor: '#EAE4D9',
        }}
      >
        <div className="absolute inset-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
      </div>

      <div
        className="absolute top-3 end-3 z-30 flex items-center gap-1 bg-[#111111]/82 p-1 backdrop-blur-sm"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
      >
        <span className="px-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
          Fabric
        </span>
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setZoomLevel(level)}
            className={`min-w-9 px-2 py-1 text-[10px] font-bold transition-colors ${
              zoomLevel === level
                ? 'bg-white text-[#111111]'
                : 'text-white hover:bg-white/15'
            }`}
            aria-pressed={zoomLevel === level}
            aria-label={`Set product detail zoom to ${level} times`}
          >
            {level}×
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 end-3 z-20 inline-flex max-w-[80%] items-center gap-1.5 bg-[#111111]/82 px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
        {zoomLevel === 9 ? <ScanSearch className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
        <span>{hint}</span>
        <span className="font-bold text-white/90">· {zoomLevel}×</span>
      </div>
    </div>
  );
}
