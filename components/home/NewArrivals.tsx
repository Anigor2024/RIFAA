'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Department } from '@/types';

export function NewArrivals() {
  const { language, isRtl, t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | Department>('all');

  const filterTabs: { id: 'all' | Department; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'women', labelAr: 'النساء', labelEn: 'Women' },
    { id: 'men', labelAr: 'الرجال', labelEn: 'Men' },
    { id: 'kids', labelAr: 'الأطفال', labelEn: 'Kids' },
  ];

  const filteredProducts = DEMO_PRODUCTS.filter((product) => {
    if (selectedFilter === 'all') return true;
    return product.department === selectedFilter;
  }).slice(0, 8); // 8 featured pieces for curated luxury cadence

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC] border-y border-[#242220]/05">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Segmented Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#242220]/10 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {t.newArrivals.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {t.newArrivals.title}
            </h2>
          </div>

          {/* Interactive Filter Controls (Functional Button Tabs) */}
          <div className="flex items-center gap-1 sm:gap-2 self-start md:self-auto overflow-x-auto max-w-full pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`py-2 px-4 text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#F7F4EF] text-[#242220]/70 hover:text-[#111111] hover:bg-[#EAE4D9]'
                }`}
              >
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Desktop / 2-Column Mobile Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/new"
            className="inline-flex items-center gap-2.5 py-3.5 px-8 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs font-medium tracking-widest uppercase transition-all duration-300 group cursor-pointer"
          >
            <span>{t.newArrivals.viewAll}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
