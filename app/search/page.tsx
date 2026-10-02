'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export default function SearchPage() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | 'women' | 'men' | 'kids'>('all');

  const suggestions = [
    'ثوب سعودي أبيض',
    'عباية كريب ياباني',
    'بشت مناسبات',
    'تحرير العيد',
    'بليزر صوف',
    'ثوب ولادي',
    'White Saudi Thobe',
    'Crepe Abaya',
    'Linen Shirt',
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_PRODUCTS.filter((product) => {
      // Department filter
      if (selectedDepartment !== 'all' && product.department !== selectedDepartment) {
        return false;
      }
      if (!q) return true;

      const matchAr =
        product.nameAr.toLowerCase().includes(q) ||
        product.categoryAr.toLowerCase().includes(q) ||
        product.descriptionAr.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q) ||
        (product.fabricAr && product.fabricAr.toLowerCase().includes(q));

      const matchEn =
        product.nameEn.toLowerCase().includes(q) ||
        product.categoryEn.toLowerCase().includes(q) ||
        product.descriptionEn.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q) ||
        (product.fabricEn && product.fabricEn.toLowerCase().includes(q));

      return matchAr || matchEn;
    });
  }, [query, selectedDepartment]);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{t.actions.search}</span>
        </nav>

        {/* Page Header & Search Bar */}
        <div className="pb-8 mb-8 border-b border-[#242220]/10 space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#511D24] font-medium block">
              {t.brandSentiment}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] mt-1">
              {t.search.title}
            </h1>
          </div>

          {/* Large Search Input */}
          <div className="relative max-w-3xl flex items-center border border-[#242220]/20 bg-white focus-within:border-[#111111] transition-colors shadow-2xs">
            <SearchIcon className="w-5 h-5 text-[#242220]/40 ms-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-full py-4 px-3 bg-transparent text-sm sm:text-base text-[#111111] placeholder-[#242220]/40 focus:outline-hidden"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-2 me-2 text-[#242220]/40 hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter Tabs & Suggestions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: t.actions.filterAll },
                { id: 'women', label: t.nav.women },
                { id: 'men', label: t.nav.men },
                { id: 'kids', label: t.nav.kids },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDepartment(tab.id as any)}
                  className={`py-1.5 px-3.5 font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                    selectedDepartment === tab.id
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#EAE3D6] text-[#242220]/70 hover:text-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#242220]/50 font-medium">{t.search.quickSuggestions}</span>
              {suggestions.slice(0, 5).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(s)}
                  className="px-2.5 py-1 bg-white hover:bg-[#111111] text-[#242220]/80 hover:text-white border border-[#242220]/10 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-[#242220]/60 mb-6">
          <span>
            {results.length} {language === 'ar' ? 'قطعة معروضة' : 'silhouettes displayed'}
          </span>
          {query && (
            <span>
              {language === 'ar' ? 'نتائج البحث عن:' : 'Search results for:'} &ldquo;{query}&rdquo;
            </span>
          )}
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white/50 border border-[#242220]/10 p-8">
            <h3 className="text-base font-medium text-[#111111]">{t.search.noResults}</h3>
            <p className="text-xs text-[#242220]/60 max-w-sm mx-auto">{t.search.tryAnother}</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedDepartment('all');
              }}
              className="mt-3 py-2 px-6 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#511D24] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'عرض كافة القطع' : 'View All Silhouettes'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
