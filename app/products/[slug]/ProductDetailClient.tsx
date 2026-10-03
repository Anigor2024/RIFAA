'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAccount } from '@/context/AccountContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ProductCard } from '@/components/product/ProductCard';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { SaudiMotif } from '@/components/common/SaudiMotif';
import { ProductImageZoom } from '@/components/product/ProductImageZoom';
import { formatPrice } from '@/lib/commerce';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { language, isRtl, t } = useLanguage();
  const { addToBag } = useBag();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { recordRecentlyViewed } = useAccount();

  // Gallery Images
  const galleryImages = [
    product.image,
    product.secondImage,
    ...(product.additionalImages || []),
  ].filter(Boolean) as string[];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  useEffect(() => {
    recordRecentlyViewed(product.id);
  }, [product.id, recordRecentlyViewed]);

  const isFavorite = isWishlisted(product.id);
  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const category = language === 'ar' ? product.categoryAr : product.categoryEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const fabric = language === 'ar' ? product.fabricAr : product.fabricEn;
  const tailoring = language === 'ar' ? product.tailoringAr : product.tailoringEn;
  const fit = language === 'ar' ? product.fitAr : product.fitEn;
  const origin = language === 'ar' ? product.originAr : product.originEn;
  const care = language === 'ar' ? product.careAr : product.careEn;
  const details = language === 'ar' ? product.detailsAr : product.detailsEn;

  const departmentLabel =
    product.department === 'women'
      ? t.nav.women
      : product.department === 'men'
      ? t.nav.men
      : t.nav.kids;

  const handleAdd = () => {
    addToBag(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${product.department}`} className="hover:text-[#111111] transition-colors">
            {departmentLabel}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-xs">{name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Gallery Column (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
            {/* Thumbnails (Desktop side bar) */}
            {galleryImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 shrink-0 w-20">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-full overflow-hidden border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#111111] ring-1 ring-[#111111] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
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

            {/* Main Image Display */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EAE4D9] shadow-sm">
              <ProductImageZoom
                src={galleryImages[activeImageIndex] || product.image}
                alt={name}
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                hint={language === 'ar' ? 'مرّر أو اضغط واسحب لفحص نسيج القماش بدقة' : 'Hover or press and drag to inspect fabric texture'}
              />

              {/* Status Badges */}
              <div className="absolute top-4 start-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                {product.isNew && (
                  <span className="text-xs font-semibold tracking-widest text-[#111111] uppercase bg-[#FFFDFC]/95 backdrop-blur-xs px-2.5 py-1">
                    {t.actions.new}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="text-xs font-semibold tracking-widest text-[#511D24] uppercase bg-[#FFFDFC]/95 backdrop-blur-xs px-2.5 py-1">
                    {t.actions.sale}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Thumbnails Row */}
            {galleryImages.length > 1 && (
              <div className="flex md:hidden gap-2 overflow-x-auto w-full pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden border ${
                      activeImageIndex === idx ? 'border-[#111111]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <ImageWithFallback src={img} alt="thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Column (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#511D24] font-medium">
                  {category}
                </span>
                <span className="text-[11px] text-[#242220]/60 uppercase tracking-widest">
                  {product.collection}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-snug">
                {name}
              </h1>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-[#242220]/10">
              <span className="text-2xl sm:text-3xl font-bold text-[#111111] tabular-nums">
                {formatPrice(product.price, language)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-[#242220]/45 line-through tabular-nums">
                  {formatPrice(product.oldPrice, language)}
                </span>
              )}
              <span className="ms-auto text-xs text-[#242220]/60">
                {t.actions.inStock}
              </span>
            </div>

            {/* Product Narrative */}
            <p className="text-sm text-[#242220]/80 font-light leading-relaxed">
              {description}
            </p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#111111]">{t.actions.color}:</span>
                  <span className="text-[#242220]/70">
                    {language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.nameEn}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        selectedColor.nameEn === c.nameEn
                          ? 'ring-2 ring-[#111111] ring-offset-2 ring-offset-[#F7F4EF]'
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

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#111111]">{t.actions.size}:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#511D24] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{t.actions.sizeGuide}</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 text-xs font-semibold border text-center transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                          : 'border-[#242220]/20 bg-white/60 text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Buy CTA & Wishlist */}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={handleAdd}
                disabled={isAdded}
                className="flex-1 py-4 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
                className={`p-4 border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'border-[#511D24] bg-[#511D24] text-white'
                    : 'border-[#242220]/20 bg-white/60 hover:border-[#111111] text-[#111111]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-3 pb-3 border-y border-[#242220]/10 grid grid-cols-2 gap-3 text-xs text-[#242220]/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#511D24] shrink-0" />
                <span>{language === 'ar' ? 'توصيل مجاني فوق 500 ر.س' : 'Free shipping > 500 SAR'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#511D24] shrink-0" />
                <span>{language === 'ar' ? 'إرجاع مجاني 14 يوماً' : '14-day free returns'}</span>
              </div>
            </div>

            {/* Detailed Craftsmanship Accordion */}
            <div className="divide-y divide-[#242220]/10 text-xs">
              {/* Specs & Tailoring */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  className="w-full flex items-center justify-between font-semibold text-[#111111] py-1 cursor-pointer"
                >
                  <span>{t.actions.fabric}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'specs' && (
                  <div className="pt-3 pb-1 space-y-2 text-[#242220]/80 leading-relaxed font-light">
                    {fabric && <p><strong>{language === 'ar' ? 'القماش:' : 'Fabric:'}</strong> {fabric}</p>}
                    {tailoring && <p><strong>{language === 'ar' ? 'الحياكة:' : 'Tailoring:'}</strong> {tailoring}</p>}
                    {fit && <p><strong>{language === 'ar' ? 'القصّة:' : 'Silhouette:'}</strong> {fit}</p>}
                    {details && details.length > 0 && (
                      <ul className="list-disc ps-4 space-y-1 pt-1">
                        {details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Origin & Care */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'origin' ? null : 'origin')}
                  className="w-full flex items-center justify-between font-semibold text-[#111111] py-1 cursor-pointer"
                >
                  <span>{t.actions.origin} & {t.actions.care}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'origin' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'origin' && (
                  <div className="pt-3 pb-1 space-y-2 text-[#242220]/80 leading-relaxed font-light">
                    {origin && <p><strong>{language === 'ar' ? 'المنشأ:' : 'Origin:'}</strong> {origin}</p>}
                    {care && <p><strong>{language === 'ar' ? 'العناية:' : 'Care:'}</strong> {care}</p>}
                    <p className="text-[11px] text-[#242220]/60 pt-1">
                      {language === 'ar'
                        ? 'تُسلّم كل قطعة في صندوق رِفْعة الحصري المغلف بورق حريري مناسب للإهداء.'
                        : 'Every piece is delivered in RIFAA’s signature keepsake gift presentation box.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Saudi Divider */}
        <div className="my-16 md:my-24">
          <SaudiMotif />
        </div>

        {/* Related Products ("You May Also Like") */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#242220]/10 pb-4 gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#511D24] font-medium block">
                  {language === 'ar' ? 'مختارات متناسقة' : 'CURATED ENSEMBLE'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                  {t.actions.youMayAlsoLike}
                </h2>
              </div>
              <Link
                href={`/${product.department}`}
                className="text-xs font-semibold tracking-wider uppercase text-[#111111] hover:text-[#511D24] transition-colors"
              >
                {t.actions.viewAll}
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        department={product.department}
        categoryKey={product.categoryKey}
      />
    </div>
  );
}
