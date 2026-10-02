'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useQuickView } from '@/context/QuickViewContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Product } from '@/types';

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const { language, t } = useLanguage();
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
            <div className="py-12 text-center text-[#242220]/60">
              <p className="text-sm">{t.brandDescription}</p>
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
                          {product.price.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.actions.sar}
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
