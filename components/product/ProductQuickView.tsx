'use client';

import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingBag, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useQuickView } from '@/context/QuickViewContext';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useAccount } from '@/context/AccountContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ProductImageZoom } from '@/components/product/ProductImageZoom';
import { formatPrice } from '@/lib/commerce';
import { Product, ProductColor } from '@/types';

interface QuickViewContentProps {
  product: Product;
  onClose: () => void;
}

function QuickViewContent({ product, onClose }: QuickViewContentProps) {
  const { language, t } = useLanguage();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToBag } = useBag();
  const { recordRecentlyViewed } = useAccount();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isWishlisted(product.id);
  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const category = language === 'ar' ? product.categoryAr : product.categoryEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const details = language === 'ar' ? product.detailsAr : product.detailsEn;

  const images = Array.from(
    new Set([product.image, product.secondImage].filter(Boolean))
  ) as string[];

  useEffect(() => {
    recordRecentlyViewed(product.id);
  }, [product.id, recordRecentlyViewed]);

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) return;
    addToBag(product, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F7F4EF] shadow-2xl transition-all">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label={t.actions.close}
        className="absolute top-4 end-4 z-20 p-2 text-[#111111] hover:text-[#511D24] transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Gallery Column */}
        <div className="relative bg-[#EFECE6] p-4 flex flex-col items-center justify-between">
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <ProductImageZoom
              src={images[activeImageIndex] || product.image}
              alt={name}
              sizes="(max-width: 768px) 100vw, 50vw"
              hint={language === 'ar' ? 'اضغط واسحب لتكبير التفاصيل' : 'Press, drag, or hover to zoom'}
            />
          </div>

          {/* Thumbnail switcher if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 w-full justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-16 overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#111111] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#242220]/60">
                {category}
              </span>
              <h2 className="text-xl md:text-2xl font-semibold text-[#111111] mt-1 leading-snug">
                {name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-[#242220]/10">
              <span className="text-xl font-semibold text-[#111111] tabular-nums">
                {formatPrice(product.price, language)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-[#242220]/45 line-through tabular-nums">
                  {formatPrice(product.oldPrice, language)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#242220]/80 leading-relaxed font-light">
              {description}
            </p>

            {/* Color Selector */}
            {product.colors.length > 0 && selectedColor && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#111111]">{t.actions.selectColor}:</span>
                  <span className="text-[#242220]/70">
                    {language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.nameEn}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor.nameEn === c.nameEn
                          ? 'ring-2 ring-[#111111] ring-offset-2'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={language === 'ar' ? c.nameAr : c.nameEn}
                    >
                      {selectedColor.nameEn === c.nameEn && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#111111]">{t.actions.selectSize}:</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#242220]/20 text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specification Highlights */}
            {details && details.length > 0 && (
              <div className="pt-3 border-t border-[#242220]/10">
                <ul className="text-xs text-[#242220]/75 space-y-1">
                  {details.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#511D24]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions Bottom Bar */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                disabled={isAdded}
                className="flex-1 py-3 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-medium tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.actions.addedToBag}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.actions.addToBag}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={t.actions.wishlist}
                className={`p-3 border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'border-[#511D24] bg-[#511D24] text-white'
                    : 'border-[#242220]/20 hover:border-[#111111] text-[#111111]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full py-2.5 text-center text-xs text-[#242220]/75 hover:text-[#511D24] flex items-center justify-center gap-1.5 transition-colors font-medium border-t border-[#242220]/05"
            >
              <span>{language === 'ar' ? 'عرض تفاصيل القطعة الكاملة' : 'View Full Product Details'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductQuickView() {
  const { selectedProduct, closeQuickView } = useQuickView();

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      />

      <QuickViewContent
        key={selectedProduct.id}
        product={selectedProduct}
        onClose={closeQuickView}
      />
    </div>
  );
}
