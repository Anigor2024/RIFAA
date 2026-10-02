'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useQuickView } from '@/context/QuickViewContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToBag } = useBag();
  const { openQuickView } = useQuickView();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isWishlisted(product.id);
  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const category = language === 'ar' ? product.categoryAr : product.categoryEn;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    addToBag(product, selectedColor, defaultSize, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFECE6] cursor-pointer">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {/* Main Image */}
          <ImageWithFallback
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && product.secondImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />

          {/* Secondary Image on Hover (if available) */}
          {product.secondImage && (
            <ImageWithFallback
              src={product.secondImage}
              alt={`${name} - alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            />
          )}
        </Link>

        {/* Status indicator (Zero-pill discipline: quiet hairline label) */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isNew && (
            <span className="text-[11px] font-medium tracking-widest text-[#111111] uppercase bg-[#FFFDFC]/90 backdrop-blur-xs px-2 py-0.5">
              {t.actions.new}
            </span>
          )}
          {product.oldPrice && (
            <span className="text-[11px] font-medium tracking-widest text-[#511D24] uppercase bg-[#FFFDFC]/90 backdrop-blur-xs px-2 py-0.5">
              {t.actions.sale}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={t.actions.wishlist}
          className={`absolute top-3 end-3 z-10 p-2.5 rounded-full transition-all duration-200 cursor-pointer ${
            isFavorite
              ? 'bg-[#511D24] text-white shadow-sm'
              : 'bg-[#FFFDFC]/85 text-[#111111] hover:bg-white hover:text-[#511D24]'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isFavorite ? 'fill-current scale-110' : ''
            }`}
          />
        </button>

        {/* Quick Action Overlay (Desktop Hover) */}
        <div className="hidden md:flex absolute inset-x-3 bottom-3 z-10 gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-3 bg-[#FFFDFC]/95 hover:bg-[#111111] text-[#111111] hover:text-white text-xs font-medium tracking-wider transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.actions.quickView}</span>
          </button>
          <button
            onClick={handleQuickAdd}
            className="p-2.5 bg-[#111111] hover:bg-[#511D24] text-white transition-colors duration-200 flex items-center justify-center shadow-sm cursor-pointer"
            aria-label={t.actions.addToBag}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-1 flex flex-col space-y-1.5">
        {/* Category & Color Swatches */}
        <div className="flex items-center justify-between text-xs text-[#242220]/60">
          <span className="text-[11px] tracking-wider uppercase truncate">{category}</span>
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1">
              {product.colors.map((c) => (
                <button
                  key={c.nameEn}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(c);
                  }}
                  title={language === 'ar' ? c.nameAr : c.nameEn}
                  className={`w-2.5 h-2.5 rounded-full transition-transform cursor-pointer ${
                    selectedColor.nameEn === c.nameEn
                      ? 'scale-125 ring-1 ring-offset-1 ring-[#111111]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-[#111111] hover:text-[#511D24] transition-colors line-clamp-1"
        >
          {name}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold tracking-tight text-[#111111] tabular-nums">
            {product.price.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.actions.sar}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#242220]/45 line-through tabular-nums">
              {product.oldPrice.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} {t.actions.sar}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
