'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Product, Department } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface CatalogViewProps {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  department?: Department;
  initialProducts: Product[];
  bannerImage?: string;
}

export function CatalogView({
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  department,
  initialProducts,
  bannerImage,
}: CatalogViewProps) {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = Array.from(
    new Set(
      initialProducts.map((p) => (language === 'ar' ? p.categoryAr : p.categoryEn))
    )
  );

  const filteredProducts = initialProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    const cat = language === 'ar' ? p.categoryAr : p.categoryEn;
    return cat === selectedCategory;
  });

  const title = language === 'ar' ? titleAr : titleEn;
  const subtitle = language === 'ar' ? subtitleAr : subtitleEn;

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{title}</span>
        </div>

        {/* Page Hero Title */}
        <div className="pb-8 mb-8 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {language === 'ar' ? 'دار رِفْعة' : 'RIFAA HOUSE'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
              {title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Sub-Category Filter Buttons */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`py-2 px-4 text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#FFFDFC] text-[#242220]/70 hover:text-[#111111] hover:bg-[#EAE4D9]'
              }`}
            >
              {t.actions.filterAll}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#FFFDFC] text-[#242220]/70 hover:text-[#111111] hover:bg-[#EAE4D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Count Status */}
        <div className="flex items-center justify-between text-xs text-[#242220]/60 mb-6">
          <span>
            {filteredProducts.length} {language === 'ar' ? 'قطعة معروضة' : 'silhouettes displayed'}
          </span>
          <span className="uppercase tracking-widest text-[10px]">
            {t.actions.currency}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
