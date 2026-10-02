'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { language, isRtl, t } = useLanguage();
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">{t.actions.wishlist}</span>
        </div>

        {/* Header */}
        <div className="pb-8 mb-8 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {t.brandSentiment}
            </span>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
                {t.actions.wishlist}
              </h1>
              <span className="text-sm text-[#242220]/60 tabular-nums">
                ({wishlistCount})
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {language === 'ar'
              ? 'مجموعتك الشخصية من القطع التي حفظتها لطلبها لاحقاً أو لتنسيق إطلالتك القادمة.'
              : 'Your private portfolio of saved silhouettes, preserved for later selection or seasonal ensemble planning.'}
          </p>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#511D24] mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-medium text-[#111111]">{t.actions.emptyWishlist}</h2>
            <p className="text-xs text-[#242220]/60 leading-relaxed">
              {t.actions.emptyWishlistSub}
            </p>
            <div className="pt-2">
              <Link
                href="/new"
                className="inline-flex items-center gap-2 py-3 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
              >
                <span>{t.actions.exploreCollection}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
