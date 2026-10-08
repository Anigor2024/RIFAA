'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Product, Department, ProductColor } from '@/types';
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
  initialCategoryKey?: string;
  initialCollectionKey?: string;
}

type SortOption = 'featured' | 'newest' | 'priceAsc' | 'priceDesc';

export function CatalogPageContent({
  department,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  heroImage,
  products,
  initialCategoryKey = 'all',
  initialCollectionKey = 'all',
}: CatalogPageContentProps) {
  const { language, isRtl, t } = useLanguage();

  // Filters State
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(initialCategoryKey);
  const [selectedCollectionKey, setSelectedCollectionKey] = useState<string>(initialCollectionKey);
  const [selectedPriceBand, setSelectedPriceBand] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileFilterOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    filterCloseRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileFilterOpen(false);
        filterTriggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [mobileFilterOpen]);

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

  // Extract available collections within this product set
  const availableCollections = useMemo(() => {
    const map = new Map<string, { key: string; labelAr: string; labelEn: string }>();
    products.forEach((p) => {
      if (!map.has(p.collectionKey)) {
        let labelAr = p.collection;
        let labelEn = p.collection;
        if (p.collectionKey === 'autumn-winter-2026') {
          labelAr = 'خريف / شتاء 2026';
          labelEn = 'Autumn / Winter 2026';
        } else if (p.collectionKey === 'eid-edit-2026') {
          labelAr = 'تحرير العيد 2026';
          labelEn = 'The Eid Edit 2026';
        } else if (p.collectionKey === 'core-essentials') {
          labelAr = 'أساسيات رِفْعة';
          labelEn = 'Core Essentials';
        }
        map.set(p.collectionKey, {
          key: p.collectionKey,
          labelAr,
          labelEn,
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

  // Extract available colors
  const availableColors = useMemo(() => {
    const map = new Map<string, ProductColor>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        const key = c.hex.toLowerCase();
        if (!map.has(key)) {
          map.set(key, c);
        }
      });
    });
    return Array.from(map.values());
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
        // Color
        if (
          selectedColorHex !== 'all' &&
          !p.colors.some((c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase())
        ) {
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
    selectedColorHex,
    selectedSort,
  ]);

  const hasActiveFilters =
    selectedCategoryKey !== 'all' ||
    selectedCollectionKey !== 'all' ||
    selectedPriceBand !== 'all' ||
    selectedSize !== 'all' ||
    selectedColorHex !== 'all';

  const activeFilterCount = [
    selectedCategoryKey,
    selectedCollectionKey,
    selectedPriceBand,
    selectedSize,
    selectedColorHex,
  ].filter((value) => value !== 'all').length;

  const activeFilterChips = [
    ...(selectedCategoryKey !== 'all'
      ? [{
          id: 'category',
          label: availableCategories.find((item) => item.key === selectedCategoryKey)?.[language === 'ar' ? 'labelAr' : 'labelEn'] || selectedCategoryKey,
          remove: () => setSelectedCategoryKey('all'),
        }]
      : []),
    ...(selectedCollectionKey !== 'all'
      ? [{
          id: 'collection',
          label: availableCollections.find((item) => item.key === selectedCollectionKey)?.[language === 'ar' ? 'labelAr' : 'labelEn'] || selectedCollectionKey,
          remove: () => setSelectedCollectionKey('all'),
        }]
      : []),
    ...(selectedPriceBand !== 'all'
      ? [{
          id: 'price',
          label: t.priceBands[selectedPriceBand as keyof typeof t.priceBands],
          remove: () => setSelectedPriceBand('all'),
        }]
      : []),
    ...(selectedSize !== 'all'
      ? [{ id: 'size', label: selectedSize, remove: () => setSelectedSize('all') }]
      : []),
    ...(selectedColorHex !== 'all'
      ? [{
          id: 'color',
          label: availableColors.find((item) => item.hex.toLowerCase() === selectedColorHex.toLowerCase())?.[language === 'ar' ? 'nameAr' : 'nameEn'] || selectedColorHex,
          remove: () => setSelectedColorHex('all'),
        }]
      : []),
  ];

  const resetAllFilters = () => {
    setSelectedCategoryKey('all');
    setSelectedCollectionKey('all');
    setSelectedPriceBand('all');
    setSelectedSize('all');
    setSelectedColorHex('all');
    setSelectedSort('featured');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'featured' || val === 'newest' || val === 'priceAsc' || val === 'priceDesc') {
      setSelectedSort(val);
    }
  };

  const title = language === 'ar' ? titleAr : titleEn;
  const subtitle = language === 'ar' ? subtitleAr : subtitleEn;

  return (
    <div className="pt-24 sm:pt-28 md:pt-36 pb-20 bg-[#F7F4EF] min-h-screen">
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
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8DCC8] font-medium">
                  {department ? (language === 'ar' ? 'دار رِفْعة المعاصرة' : 'RIFAA HOUSE ATELIER') : (language === 'ar' ? 'مختارات دار رِفْعة' : 'RIFAA SELECTION')}
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
            <div className="p-8 sm:p-12 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          )}
        </div>

        {/* Sub-Category Horizontal Quick Nav */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 text-xs">
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
              ref={filterTriggerRef}
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileFilterOpen}
              className="min-h-11 py-2 px-3.5 bg-[#FFFDFC] border border-[#242220]/15 hover:border-[#111111] text-[#111111] flex items-center gap-2 font-medium cursor-pointer transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#511D24]" />
              <span>{t.actions.filters}</span>
              {hasActiveFilters && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#511D24] px-1 text-[10px] font-bold text-white" aria-label={String(activeFilterCount)}>
                  {activeFilterCount}
                </span>
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

            <span className="text-[#242220]/70 text-[11px] sm:text-xs" aria-live="polite">
              {filteredProducts.length} {language === 'ar' ? 'قطعة مطابقة' : 'pieces found'}
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#242220]/60 hidden sm:inline">{t.actions.sortBy}:</span>
            <div className="relative">
              <select
                aria-label={language === 'ar' ? 'ترتيب المنتجات' : 'Sort products'}
                value={selectedSort}
                onChange={handleSortChange}
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

        {/* Removable active filter chips keep complex searches understandable. */}
        {activeFilterChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2" aria-label={language === 'ar' ? 'الفلاتر النشطة' : 'Active filters'}>
            <span className="me-1 text-[11px] font-semibold text-[#242220]/50">
              {language === 'ar' ? 'تبحث الآن عن:' : 'Refined by:'}
            </span>
            {activeFilterChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.remove}
                aria-label={(language === 'ar' ? 'إزالة فلتر ' : 'Remove filter ') + chip.label}
                className="inline-flex min-h-9 items-center gap-2 border border-[#511D24]/20 bg-[#FFFDFC] px-3 text-[11px] font-semibold text-[#511D24] transition-colors hover:bg-[#EEE8DE]"
              >
                <span>{chip.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* Product Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white/50 border border-[#242220]/10 p-8 my-6">
            <h3 className="text-lg font-semibold text-[#111111]">
              {language === 'ar' ? 'لا توجد قطع مطابقة لخيارات الفلترة' : 'No silhouettes match your selected filters'}
            </h3>
            <p className="text-xs text-[#242220]/60 max-w-sm mx-auto">
              {language === 'ar'
                ? 'يرجى تجربة تعديل معايير السعر أو المقاس أو إعادة تعيين الفلاتر لعرض كافة القطع.'
                : 'Please try adjusting your price, color, or size criteria or reset all filters to view our full collection.'}
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
            role="dialog"
            aria-modal="true"
            aria-label={language === 'ar' ? 'فلترة المنتجات' : 'Filter products'}
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
                ref={filterCloseRef}
                type="button"
                onClick={() => {
                  setMobileFilterOpen(false);
                  filterTriggerRef.current?.focus();
                }}
                aria-label={language === 'ar' ? 'إغلاق الفلاتر' : 'Close filters'}
                className="p-1.5 text-[#242220]/60 hover:text-[#111111] cursor-pointer"
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
                    className={`py-2 px-3 text-start border transition-colors cursor-pointer ${
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
                      className={`py-2 px-3 text-start border transition-colors truncate cursor-pointer ${
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

              {/* Collection */}
              {availableCollections.length > 1 && (
                <div className="space-y-3 pt-4">
                  <h4 className="font-semibold text-[#111111] uppercase tracking-wider text-[11px]">
                    {language === 'ar' ? 'التشكيلة' : 'Collection'}
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCollectionKey('all')}
                      className={`w-full py-2 px-3 text-start border transition-colors cursor-pointer ${
                        selectedCollectionKey === 'all'
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#242220]/15 bg-white text-[#242220]'
                      }`}
                    >
                      {t.actions.filterAll}
                    </button>
                    {availableCollections.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => setSelectedCollectionKey(col.key)}
                        className={`w-full py-2 px-3 text-start border transition-colors cursor-pointer ${
                          selectedCollectionKey === col.key
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#242220]/15 bg-white text-[#242220]'
                        }`}
                      >
                        {language === 'ar' ? col.labelAr : col.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {availableColors.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#111111] uppercase tracking-wider text-[11px]">
                      {t.actions.color}
                    </h4>
                    {selectedColorHex !== 'all' && (
                      <button
                        onClick={() => setSelectedColorHex('all')}
                        className="text-[11px] text-[#511D24] hover:underline cursor-pointer"
                      >
                        {t.actions.filterAll}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((color) => {
                      const isSelected = selectedColorHex.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.hex}
                          onClick={() => setSelectedColorHex(isSelected ? 'all' : color.hex)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-[#111111] ring-offset-2 ring-offset-[#F7F4EF]'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-label={(language === 'ar' ? 'اختيار اللون ' : 'Select color ') + (language === 'ar' ? color.nameAr : color.nameEn)}
                          aria-pressed={isSelected}
                          title={language === 'ar' ? color.nameAr : color.nameEn}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      className={`w-full py-2 px-3 text-start border transition-colors cursor-pointer ${
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
                      className={`py-2 px-2 text-center border transition-colors cursor-pointer ${
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
                        className={`py-2 px-2 text-center border transition-colors truncate cursor-pointer ${
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
                className="py-3 px-4 border border-[#242220]/20 text-[#111111] text-xs font-semibold uppercase hover:border-[#111111] cursor-pointer"
              >
                {t.actions.resetFilters}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 bg-[#111111] text-white text-xs font-semibold uppercase hover:bg-[#511D24] text-center cursor-pointer"
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
