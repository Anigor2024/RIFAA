'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X, Sparkles, Layers3, Columns3, Grid2X2, ArrowLeft, ArrowRight, IdCard, Compass, WandSparkles, Gift } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useQuickView } from '@/context/QuickViewContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Product } from '@/types';
import { formatPrice } from '@/lib/commerce';

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const { language, isRtl, t } = useLanguage();
  const { openQuickView } = useQuickView();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return DEMO_PRODUCTS.filter((product) => {
      const matchAr =
        product.nameAr.toLowerCase().includes(q) ||
        product.categoryAr.toLowerCase().includes(q) ||
        product.descriptionAr.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q);

      const matchEn =
        product.nameEn.toLowerCase().includes(q) ||
        product.categoryEn.toLowerCase().includes(q) ||
        product.descriptionEn.toLowerCase().includes(q) ||
        product.collection.toLowerCase().includes(q);

      return matchAr || matchEn;
    });
  }, [query]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    setQuery('');
    closeSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleItemClick = (product: Product) => {
    handleClose();
    openQuickView(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Search Sheet */}
      <div className="relative z-10 w-full bg-[#F7F4EF] shadow-2xl max-h-[88vh] flex flex-col">
        {/* Search Bar Container */}
        <div className="max-w-5xl mx-auto w-full px-6 py-6 md:py-8 border-b border-[#242220]/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-[#242220]/60 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full bg-transparent text-lg md:text-2xl font-light text-[#111111] placeholder-[#242220]/40 focus:outline-hidden"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#242220]/40 hover:text-[#111111] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-[#242220]/60 hover:text-[#111111] transition-colors cursor-pointer"
              aria-label={t.actions.close}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[#242220]/50 font-medium">{t.search.quickSuggestions}</span>
            {t.search.suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(item)}
                className="px-3 py-1 bg-[#EBE5DA] hover:bg-[#111111] text-[#242220] hover:text-white transition-colors cursor-pointer text-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="max-w-5xl mx-auto w-full flex-1 overflow-y-auto px-6 py-6">
          {query.trim() === '' ? (
            <div className="py-8">
              <div className="mb-7 flex flex-col justify-between gap-3 border-b border-[#242220]/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                    {language === 'ar' ? 'استكشف أدوات رِفْعة' : 'RIFAA DISCOVERY TOOLS'}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#111111]">
                    {language === 'ar' ? 'ابحث أو ابدأ من أداة قرار.' : 'Search, or start with a decision tool.'}
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#242220]/40">
                  / · Ctrl K · ⌘ K
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    href: '/concierge',
                    icon: Compass,
                    ar: 'كونسيرج رِفْعة',
                    en: 'Concierge',
                    subAr: 'استأنف رحلتك من الخطوة الأنسب',
                    subEn: 'Resume from the clearest next step',
                  },
                  {
                    href: '/passport',
                    icon: IdCard,
                    ar: 'جواز الأسلوب',
                    en: 'Style Passport',
                    subAr: 'احفظ تفضيلات غير حساسة على جهازك',
                    subEn: 'Save non-sensitive preferences locally',
                  },
                  {
                    href: '/studio',
                    icon: Sparkles,
                    ar: 'استوديو رِفْعة',
                    en: 'RIFAA Studio',
                    subAr: 'كل أدوات القرار في مساحة واحدة',
                    subEn: 'All decision tools in one workspace',
                  },
                  {
                    href: '/discover',
                    icon: Sparkles,
                    ar: 'منسّق رِفْعة',
                    en: 'Curator',
                    subAr: 'ترشيح حسب المناسبة والخامة',
                    subEn: 'Recommendations by moment and material',
                  },
                  {
                    href: '/atelier',
                    icon: Layers3,
                    ar: 'المشغل',
                    en: 'Atelier',
                    subAr: 'كوّن إطلالة كاملة',
                    subEn: 'Compose a complete edit',
                  },
                  {
                    href: '/pairing',
                    icon: WandSparkles,
                    ar: 'التنسيق',
                    en: 'Pairing',
                    subAr: 'ابدأ من أي قطعة وابنِ حولها',
                    subEn: 'Build around any anchor piece',
                  },
                  {
                    href: '/compare',
                    icon: Columns3,
                    ar: 'المقارنة',
                    en: 'Compare',
                    subAr: 'قارن ثلاث قطع جنباً إلى جنب',
                    subEn: 'Compare up to three pieces',
                  },
                  {
                    href: '/capsule',
                    icon: Grid2X2,
                    ar: 'الكابسولة',
                    en: 'Capsule',
                    subAr: 'خمس قطع بوظائف مختلفة',
                    subEn: 'Build a five-role wardrobe',
                  },
                  {
                    href: '/gifts',
                    icon: Gift,
                    ar: 'الهدايا',
                    en: 'Gifting',
                    subAr: 'ترشيحات حسب المناسبة والميزانية',
                    subEn: 'Gift edits by occasion and budget',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className="group border border-[#242220]/10 bg-[#FFFDFC] p-4 transition-colors hover:border-[#511D24]/35"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4 text-[#511D24]" />
                        {isRtl ? (
                          <ArrowLeft className="h-3.5 w-3.5 text-[#242220]/30 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-[#242220]/30 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                      <span className="mt-4 block text-sm font-bold text-[#111111]">
                        {language === 'ar' ? item.ar : item.en}
                      </span>
                      <span className="mt-1 block text-[10px] leading-5 text-[#242220]/48">
                        {language === 'ar' ? item.subAr : item.subEn}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <p className="mt-7 text-center text-xs text-[#242220]/45">{t.brandDescription}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-base font-medium text-[#111111]">{t.search.noResults}</p>
              <p className="text-xs text-[#242220]/60">{t.search.tryAnother}</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-wider text-[#242220]/60">
                  {results.length} {t.search.resultsFound}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {results.map((product) => {
                  const name = language === 'ar' ? product.nameAr : product.nameEn;
                  const category = language === 'ar' ? product.categoryAr : product.categoryEn;
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-[3/4] bg-[#EBE5DA] overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="pt-2 text-xs space-y-1">
                        <span className="text-[10px] text-[#242220]/60 uppercase tracking-wider block">
                          {category}
                        </span>
                        <h4 className="font-medium text-[#111111] group-hover:text-[#511D24] transition-colors line-clamp-1">
                          {name}
                        </h4>
                        <span className="font-semibold text-[#111111] tabular-nums block">
                          {formatPrice(product.price, language)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
