'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export function SeasonalDrop() {
  const { language, isRtl, t } = useLanguage();

  // Curated 4 Festive Occasion Pieces
  const seasonalItems = DEMO_PRODUCTS.filter((p) =>
    ['w-03', 'm-05', 'w-10', 'k-02'].includes(p.id)
  );

  return (
    <section className="py-20 md:py-28 bg-[#511D24] text-[#FAF8F5] relative overflow-hidden">
      {/* Subtle architectural noise/texture overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/15 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D9D0C4] font-medium block">
              {t.seasonalDrop.tag}
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                {t.seasonalDrop.title}
              </h2>
              <span className="font-editorial text-sm sm:text-base tracking-[0.2em] text-[#D9D0C4] uppercase">
                {t.seasonalDrop.subtitle}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/80 font-light max-w-xl leading-relaxed text-balance pt-1">
              {t.seasonalDrop.description}
            </p>
          </div>

          <div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2.5 py-3.5 px-7 bg-white text-[#111111] hover:bg-[#F7F4EF] text-xs font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-md"
            >
              <span>{t.seasonalDrop.cta}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>
        </div>

        {/* 4-Item Curated Showcase */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {seasonalItems.map((product) => (
            <div key={product.id} className="bg-[#FAF8F5] p-2 text-[#111111] shadow-lg">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
