'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { Product, Department } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/product/ProductCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

interface CatalogPageContentProps {
  department?: Department;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  heroImage?: string;
  products: Product[];
}

export function CatalogPageContent({
  department,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  heroImage,
  products,
}: CatalogPageContentProps) {
  const { language, isRtl, t } = useLanguage();

  // Filters State
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [selectedPriceBand, setSelectedPriceBand] = useState<string>('all');
  const [selectedCollectionKey, setSelectedCollectionKey] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'newest' | 'priceAsc' | 'priceDesc'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract available categories within this product set
  const availableCategories = useMemo(() => {
    const map = new Map<string, { key: string; labelAr: string; labelEn: string }>();
    products.forEach((p) => {
      if (!map.has(p.categoryKey)) {
        map.set(p.categoryKey, {
          key: p.categoryKey,
          labelAr: p.categoryAr,
          labelEn: p.categoryEn,
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Extract available sizes
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategoryKey !== 'all' && p.categoryKey !== selectedCategoryKey) {
          return false;
        }
        // Collection
        if (selectedCollectionKey !== 'all' && p.collectionKey !== selectedCollectionKey) {
          return false;
        }
        // Price Band
        if (selectedPriceBand === 'under500' && p.price >= 500) {
          return false;
        }
        if (selectedPriceBand === 'between500And1000' && (p.price < 500 || p.price > 1000)) {
          return false;
        }
        if (selectedPriceBand === 'above1000' && p.price <= 1000) {
          return false;
        }
        // Size
        if (selectedSize !== 'all' && !p.sizes.includes(selectedSize)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'newest') {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
        if (selectedSort === 'priceAsc') {
          return a.price - b.price;
        }
        if (selectedSort === 'priceDesc') {
          return b.price - a.price;
        }
        // Featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    products,
    selectedCategoryKey,
    selectedCollectionKey,
    selectedPriceBand,
    selectedSize,
    selectedSort,
  ]);

  const hasActiveFilters =
    selectedCategoryKey !== 'all' ||
    selectedPriceBand !== 'all' ||
    selectedCollectionKey !== 'all' ||
    selectedSize !== 'all';

  const resetAllFilters = () => {
    setSelectedCategoryKey('all');
    setSelectedPriceBand('all');
    setSelectedCollectionKey('all');
    setSelectedSize('all');
    setSelectedSort('featured');
  };

  const title = language === 'ar' ? titleAr : titleEn;
  const subtitle = language === 'ar' ? subtitleAr : subtitleEn;

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{title}</span>
        </nav>

        {/* Department Editorial Hero */}
        <div className="relative overflow-hidden bg-[#E2DBD0] mb-10 shadow-xs">
          {heroImage ? (
            <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] w-full min-h-[200px]">
              <ImageWithFallback
                src={heroImage}
                alt={title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white space-y-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D9D0C4] font-medium">
                  {language === 'ar' ? 'دار رِفْعة للأزياء المعاصرة' : 'RIFAA FASHION HOUSE'}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 max-w-xl font-light leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-10 px-6 sm:px-10 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
                  {language === 'ar' ? 'مجموعات الدار' : 'RIFAA REPERTOIRE'}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
                  {title}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Primary Category Quick Switcher Tabs */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-[#242220]/10 text-xs">
            <button
              onClick={() => setSelectedCategoryKey('all')}
              className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategoryKey === 'all'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#FFFDFC] text-[#242220]/70 hover:text-[#111111] hover:bg-[#EAE4D9]'
              }`}
            >
              {t.actions.filterAll}
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`py-2 px-4 font-medium tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategoryKey === cat.key
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#FFFDFC] text-[#242220]/70 hover:text-[#111111] hover:bg-[#EAE4D9]'
                }`}
              >
                {language === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        )}

        {/* Controls Toolbar: Filter Drawer Button, Sort, Active Counts */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#242220]/10 text-xs">
          {/* Left: Filter Toggle & Active Tag Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="py-2 px-3.5 bg-[#FFFDFC] border border-[#242220]/15 hover:border-[#111111] text-[#111111] flex items-center gap-2 font-medium cursor-pointer transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#511D24]" />
              <span>{t.actions.filters}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#511D24]" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[#511D24] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.actions.resetFilters}</span>
              </button>
            )}

            <span className="text-[#242220]/60 hidden sm:inline-block">
              {filteredProducts.length} {language === 'ar' ? 'قطعة مطابقة' : 'silhouettes found'}
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#242220]/60 hidden sm:inline">{t.actions.sortBy}:</span>
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="bg-[#FFFDFC] border border-[#242220]/15 py-2 px-3 pe-8 text-[#111111] font-medium appearance-none focus:outline-hidden cursor-pointer"
              >
                <option value="featured">{t.sort.featured}</option>
                <option value="newest">{t.sort.newest}</option>
                <option value="priceAsc">{t.sort.priceAsc}</option>
                <option value="priceDesc">{t.sort.priceDesc}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#242220]/60 absolute top-1/2 end-2.5 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white/50 border border-[#242220]/10 p-8 my-6">
            <h3 className="text-lg font-semibold text-[#111111]">
              {language === 'ar' ? 'لا توجد قطع مطابقة لخيارات الفلترة' : 'No silhouettes match your selected filters'}
            </h3>
            <p className="text-xs text-[#242220]/60 max-w-sm mx-auto">
              {language === 'ar'
                ? 'يرجى تجربة تعديل معايير السعر أو المقاس أو إعادة تعيين الفلاتر لعرض كافة القطع.'
                : 'Please try adjusting your price or size criteria or reset all filters to view our full collection.'}
            </p>
            <button
              onClick={resetAllFilters}
              className="py-2.5 px-6 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#511D24] transition-colors cursor-pointer"
            >
              {t.actions.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Drawer Dialog */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-[#111111]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div
            className={`fixed inset-y-0 ${
              isRtl ? 'right-0' : 'left-0'
            } w-full max-w-md bg-[#F7F4EF] shadow-2xl flex flex-col justify-between`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#242220]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#511D24]" />
                <h3 className="font-semibold text-base text-[#111111]">
                  {t.actions.filters}
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-[#242220]/60 hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Options Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-xs divide-y divide-[#242220]/10">
              {/* Category */}
              <div className="space-y-3 pt-0">
                <h4 className="font-semibold text-[#111111] uppercase tracking-wider text-[11px]">
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategoryKey('all')}
                    className={`py-2 px-3 text-start border transition-colors ${
                      selectedCategoryKey === 'all'
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-[#242220]/15 bg-white text-[#242220]'
                    }`}
                  >
                    {t.actions.filterAll}
                  </button>
                  {availableCategories.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setSelectedCategoryKey(c.key)}
                      className={`py-2 px-3 text-start border transition-colors truncate ${
                        selectedCategoryKey === c.key
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#242220]/15 bg-white text-[#242220]'
                      }`}
                    >
                      {language === 'ar' ? c.labelAr : c.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Band */}
              <div className="space-y-3 pt-4">
                <h4 className="font-semibold text-[#111111] uppercase tracking-wider text-[11px]">
                  {language === 'ar' ? 'نطاق السعر' : 'Price Range'}
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: t.priceBands.all },
                    { key: 'under500', label: t.priceBands.under500 },
                    { key: 'between500And1000', label: t.priceBands.between500And1000 },
                    { key: 'above1000', label: t.priceBands.above1000 },
                  ].map((band) => (
                    <button
                      key={band.key}
                      onClick={() => setSelectedPriceBand(band.key)}
                      className={`w-full py-2 px-3 text-start border transition-colors ${
                        selectedPriceBand === band.key
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#242220]/15 bg-white text-[#242220]'
                      }`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              {availableSizes.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h4 className="font-semibold text-[#111111] uppercase tracking-wider text-[11px]">
                    {t.actions.size}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedSize('all')}
                      className={`py-2 px-2 text-center border transition-colors ${
                        selectedSize === 'all'
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#242220]/15 bg-white text-[#242220]'
                      }`}
                    >
                      {t.actions.filterAll}
                    </button>
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2 px-2 text-center border transition-colors truncate ${
                          selectedSize === s
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#242220]/15 bg-white text-[#242220]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#242220]/10 bg-white flex items-center gap-3">
              <button
                onClick={resetAllFilters}
                className="py-3 px-4 border border-[#242220]/20 text-[#111111] text-xs font-semibold uppercase hover:border-[#111111]"
              >
                {t.actions.resetFilters}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 bg-[#111111] text-white text-xs font-semibold uppercase hover:bg-[#511D24] text-center"
              >
                {language === 'ar'
                  ? `عرض ${filteredProducts.length} قطعة`
                  : `Show ${filteredProducts.length} Items`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
