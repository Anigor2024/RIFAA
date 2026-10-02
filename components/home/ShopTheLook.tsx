'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useQuickView } from '@/context/QuickViewContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { CURATED_LOOK } from '@/data/looks';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function ShopTheLook() {
  const { language, t } = useLanguage();
  const { openQuickView } = useQuickView();
  const { addToBag } = useBag();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const lookProducts = DEMO_PRODUCTS.filter((p) =>
    CURATED_LOOK.productIds.includes(p.id)
  );

  return (
    <section className="py-16 md:py-24 bg-[#F7F4EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 pb-4 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {t.shopTheLook.label}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? CURATED_LOOK.titleAr : CURATED_LOOK.titleEn}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {language === 'ar' ? CURATED_LOOK.descriptionAr : CURATED_LOOK.descriptionEn}
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Look Editorial Image (7 Cols) */}
          <div className="lg:col-span-7 relative group overflow-hidden bg-[#E5DFD3] aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4]">
            <ImageWithFallback
              src={CURATED_LOOK.mainImage}
              alt="Curated Evening Look by RIFAA"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
            />

            {/* Visual Markers on the Actual Garments */}
            <div className="absolute top-[28%] start-[50%] -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 group/marker">
              <span className="w-6 h-6 rounded-full bg-white/95 text-[#111111] text-[11px] font-semibold flex items-center justify-center shadow-md ring-2 ring-white/60">
                01
              </span>
              <span className="bg-[#111111]/90 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {language === 'ar' ? 'بلوزة حرير خالص' : 'Pure Silk Blouse'}
              </span>
            </div>

            <div className="absolute top-[58%] start-[50%] -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 group/marker">
              <span className="w-6 h-6 rounded-full bg-white/95 text-[#111111] text-[11px] font-semibold flex items-center justify-center shadow-md ring-2 ring-white/60">
                02
              </span>
              <span className="bg-[#111111]/90 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {language === 'ar' ? 'بنطال واسع بكسرات' : 'Wide-Leg Pleated Trousers'}
              </span>
            </div>

            <div className="absolute top-[72%] start-[32%] -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 group/marker">
              <span className="w-6 h-6 rounded-full bg-white/95 text-[#111111] text-[11px] font-semibold flex items-center justify-center shadow-md ring-2 ring-white/60">
                03
              </span>
              <span className="bg-[#111111]/90 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {language === 'ar' ? 'حقيبة جلدية منحوتة' : 'Sculpted Leather Tote'}
              </span>
            </div>

            <div className="absolute bottom-4 start-4 bg-[#111111]/85 backdrop-blur-xs text-white text-[11px] tracking-widest py-1.5 px-3 uppercase">
              {language === 'ar' ? '٣ قطع متناسقة بدقة' : '3 COORDINATED PIECES'}
            </div>
          </div>

          {/* Associated Product Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-wider text-[#242220]/60 font-medium">
              {t.shopTheLook.includedItems}
            </span>

            <div className="divide-y divide-[#242220]/10 bg-white/70 backdrop-blur-xs border border-[#242220]/10 p-2 sm:p-4">
              {lookProducts.map((product, idx) => {
                const name = language === 'ar' ? product.nameAr : product.nameEn;
                const category = language === 'ar' ? product.categoryAr : product.categoryEn;
                const isFavorite = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    className="py-4 first:pt-2 last:pb-2 flex items-center justify-between gap-4"
                  >
                    {/* Thumbnail & Index */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#511D24] tabular-nums w-4">
                        0{idx + 1}
                      </span>
                      <Link href={`/products/${product.slug}`} className="relative w-16 h-20 bg-[#E5DFD3] shrink-0 overflow-hidden block">
                        <ImageWithFallback
                          src={product.image}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#242220]/50 block">
                          {category}
                        </span>
                        <Link href={`/products/${product.slug}`} className="text-sm font-medium text-[#111111] hover:text-[#511D24] transition-colors line-clamp-1 block">
                          {name}
                        </Link>
                        <span className="text-xs font-semibold text-[#111111] tabular-nums block mt-1">
                          {product.price.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.actions.sar}
                        </span>
                      </div>
                    </div>

                    {/* Quick Interaction Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openQuickView(product)}
                        aria-label={t.actions.quickView}
                        className="p-2 text-[#242220]/60 hover:text-[#111111] hover:bg-[#EAE4D9] transition-colors cursor-pointer"
                        title={t.actions.quickView}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={t.actions.wishlist}
                        className={`p-2 transition-colors cursor-pointer ${
                          isFavorite ? 'text-[#511D24]' : 'text-[#242220]/60 hover:text-[#511D24]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => {
                          const defaultColor = product.colors[0];
                          const defaultSize = product.sizes[0] || 'M';
                          addToBag(product, defaultColor, defaultSize, 1);
                        }}
                        className="p-2 bg-[#111111] hover:bg-[#511D24] text-white transition-colors cursor-pointer"
                        title={t.actions.addToBag}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
