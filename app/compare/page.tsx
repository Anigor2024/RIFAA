'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns3,
  Eye,
  Heart,
  Plus,
  ScanSearch,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useQuickView } from '@/context/QuickViewContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

const CURATED_STARTERS = ['w-02', 'w-03', 'w-04'];

function localized(
  language: 'ar' | 'en',
  product: Product,
  arKey: keyof Product,
  enKey: keyof Product
) {
  const value = language === 'ar' ? product[arKey] : product[enKey];
  return typeof value === 'string' && value.trim() ? value : null;
}

export default function ComparePage() {
  const { language, isRtl } = useLanguage();
  const {
    compareItems,
    compareIds,
    compareCount,
    isFull,
    addToCompare,
    addManyToCompare,
    removeFromCompare,
    clearCompare,
  } = useCompare();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToBag } = useBag();
  const { openQuickView } = useQuickView();

  const starterProducts = CURATED_STARTERS
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const candidateProducts = DEMO_PRODUCTS.filter(
    (product) => product.inStock && !compareIds.includes(product.id)
  )
    .sort((a, b) => {
      const departmentAffinity =
        compareItems[0] && a.department === compareItems[0].department ? -1 : 0;
      const bDepartmentAffinity =
        compareItems[0] && b.department === compareItems[0].department ? -1 : 0;
      if (departmentAffinity !== bDepartmentAffinity) {
        return departmentAffinity - bDepartmentAffinity;
      }
      return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    })
    .slice(0, 6);

  const rows = [
    {
      ar: 'السعر',
      en: 'Price',
      render: (product: Product) => formatPrice(product.price, language),
    },
    {
      ar: 'التشكيلة',
      en: 'Collection',
      render: (product: Product) => product.collection,
    },
    {
      ar: 'الخامة',
      en: 'Fabric',
      render: (product: Product) =>
        localized(language, product, 'fabricAr', 'fabricEn'),
    },
    {
      ar: 'التفصيل',
      en: 'Tailoring',
      render: (product: Product) =>
        localized(language, product, 'tailoringAr', 'tailoringEn'),
    },
    {
      ar: 'القصّة',
      en: 'Fit',
      render: (product: Product) =>
        localized(language, product, 'fitAr', 'fitEn'),
    },
    {
      ar: 'العناية',
      en: 'Care',
      render: (product: Product) =>
        localized(language, product, 'careAr', 'careEn'),
    },
    {
      ar: 'الحرفة / المنشأ',
      en: 'Craft / Origin',
      render: (product: Product) =>
        localized(language, product, 'originAr', 'originEn'),
    },
    {
      ar: 'الألوان',
      en: 'Colors',
      render: (product: Product) =>
        product.colors
          .map((color) => (language === 'ar' ? color.nameAr : color.nameEn))
          .join(' · '),
    },
    {
      ar: 'المقاسات',
      en: 'Sizes',
      render: (product: Product) => product.sizes.join(' · '),
    },
    {
      ar: 'التوفر',
      en: 'Availability',
      render: (product: Product) =>
        product.inStock
          ? language === 'ar'
            ? 'متوفر'
            : 'In stock'
          : language === 'ar'
            ? 'غير متوفر'
            : 'Unavailable',
    },
  ];

  const quickAdd = (product: Product) => {
    addToBag(product, product.colors[0], product.sizes[0] || 'M', 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'استوديو المقارنة' : 'Compare Studio'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-9 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Columns3 className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                {language === 'ar' ? 'مختبر القرار' : 'DECISION STUDIO'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'قارن ما لا يظهر في الصورة وحدها.'
                : 'Compare what the image alone cannot tell you.'}
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65">
              {language === 'ar'
                ? 'ضع حتى ثلاث قطع جنباً إلى جنب وافهم اختلاف الخامة والتفصيل والقصّة والعناية والمقاسات والسعر قبل اتخاذ القرار.'
                : 'Place up to three pieces side by side and understand fabrication, tailoring, fit, care, sizing and price before deciding.'}
            </p>
            <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[#242220]/45">
              <span>
                {language === 'ar'
                  ? compareCount + ' من 3 قطع'
                  : compareCount + ' of 3 pieces'}
              </span>
              {compareCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#511D24]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{language === 'ar' ? 'مسح المقارنة' : 'Clear comparison'}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {compareItems.length === 0 ? (
          <section className="mt-10 overflow-hidden border border-[#242220]/10 bg-[#EEE8DE]/65">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex flex-col justify-between p-6 sm:p-9 lg:border-e lg:border-[#242220]/10">
                <div>
                  <Sparkles className="h-5 w-5 text-[#511D24]" />
                  <span className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B59A73]">
                    {language === 'ar' ? 'ابدأ بمقارنة منسقة' : 'START WITH A CURATED COMPARISON'}
                  </span>
                  <h2 className="mt-2 text-3xl font-bold text-[#111111]">
                    {language === 'ar'
                      ? 'ثلاث عبايات، ثلاث شخصيات مختلفة.'
                      : 'Three abayas, three distinct characters.'}
                  </h2>
                  <p className="mt-4 text-sm font-light leading-7 text-[#242220]/60">
                    {language === 'ar'
                      ? 'حمّل هذه المقارنة الجاهزة كنقطة بداية، أو أضف أي قطعة من صفحات المتجر عبر زر المقارنة.'
                      : 'Load this ready-made comparison as a starting point, or add any piece from the storefront using the compare control.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addManyToCompare(CURATED_STARTERS)}
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-5 text-xs font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#511D24]"
                >
                  <Columns3 className="h-4 w-4" />
                  <span>{language === 'ar' ? 'حمّل المقارنة المقترحة' : 'Load curated comparison'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-px bg-[#242220]/10">
                {starterProducts.map((product, index) => (
                  <div key={product.id} className="bg-[#F7F4EF]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={language === 'ar' ? product.nameAr : product.nameEn}
                        fill
                        sizes="(max-width: 1024px) 33vw, 22vw"
                        className="object-cover"
                      />
                      <span className="absolute start-3 top-3 bg-[#111111]/80 px-2 py-1 font-editorial text-[10px] text-white backdrop-blur-sm">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4">
                      <span className="line-clamp-2 text-[11px] font-semibold text-[#111111] sm:text-xs">
                        {language === 'ar' ? product.nameAr : product.nameEn}
                      </span>
                      <span className="mt-1 block text-[10px] text-[#242220]/45">
                        {formatPrice(product.price, language)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-9 overflow-x-auto">
              <div className="min-w-[760px]">
                <div
                  className="grid gap-px bg-[#242220]/10"
                  style={{
                    gridTemplateColumns:
                      '160px repeat(' + compareItems.length + ', minmax(200px, 1fr))',
                  }}
                >
                  <div className="bg-[#EEE8DE]/70 p-4" />
                  {compareItems.map((product, index) => (
                    <article key={product.id} className="bg-[#FFFDFC]">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#E7E0D4]">
                        <ImageWithFallback
                          src={product.image}
                          alt={language === 'ar' ? product.nameAr : product.nameEn}
                          fill
                          sizes="33vw"
                          className="object-cover object-center"
                        />
                        <span className="absolute start-3 top-3 bg-[#111111]/80 px-2 py-1 font-editorial text-[10px] text-white backdrop-blur-sm">
                          0{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(product.id)}
                          aria-label={language === 'ar' ? 'إزالة من المقارنة' : 'Remove from comparison'}
                          className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center bg-white/90 text-[#111111] backdrop-blur-sm transition-colors hover:bg-[#511D24] hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="p-4">
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#B59A73]">
                          {language === 'ar' ? product.categoryAr : product.categoryEn}
                        </span>
                        <Link
                          href={'/products/' + product.slug}
                          className="mt-1 block min-h-10 text-sm font-bold leading-5 text-[#111111] hover:text-[#511D24]"
                        >
                          {language === 'ar' ? product.nameAr : product.nameEn}
                        </Link>

                        <div className="mt-4 grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => openQuickView(product)}
                            className="flex min-h-9 items-center justify-center border border-[#242220]/12 text-[#242220]/65 hover:border-[#111111] hover:text-[#111111]"
                            aria-label={language === 'ar' ? 'عرض سريع' : 'Quick view'}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className={
                              isWishlisted(product.id)
                                ? 'flex min-h-9 items-center justify-center border border-[#511D24] bg-[#511D24] text-white'
                                : 'flex min-h-9 items-center justify-center border border-[#242220]/12 text-[#242220]/65 hover:border-[#511D24] hover:text-[#511D24]'
                            }
                            aria-label={language === 'ar' ? 'المفضلة' : 'Wishlist'}
                          >
                            <Heart
                              className={
                                isWishlisted(product.id)
                                  ? 'h-3.5 w-3.5 fill-current'
                                  : 'h-3.5 w-3.5'
                              }
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => quickAdd(product)}
                            className="flex min-h-9 items-center justify-center bg-[#111111] text-white hover:bg-[#511D24]"
                            aria-label={language === 'ar' ? 'أضف للحقيبة' : 'Add to bag'}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div
                  className="grid gap-px bg-[#242220]/10"
                  style={{
                    gridTemplateColumns:
                      '160px repeat(' + compareItems.length + ', minmax(200px, 1fr))',
                  }}
                >
                  {rows.flatMap((row) => [
                    <div
                      key={'label-' + row.en}
                      className="bg-[#EEE8DE]/70 p-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#511D24]"
                    >
                      {language === 'ar' ? row.ar : row.en}
                    </div>,
                    ...compareItems.map((product) => (
                      <div
                        key={row.en + '-' + product.id}
                        className="bg-[#FFFDFC] p-4 text-xs font-light leading-6 text-[#242220]/65"
                      >
                        {row.render(product) || (language === 'ar' ? 'غير محدد' : 'Not specified')}
                      </div>
                    )),
                  ])}
                </div>
              </div>
            </section>

            {!isFull && (
              <section className="mt-14 border-t border-[#242220]/10 pt-9">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                      {language === 'ar' ? 'أكمل المقارنة' : 'COMPLETE THE COMPARISON'}
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                      {language === 'ar'
                        ? 'أضف قطعة أخرى للمقارنة'
                        : 'Add another piece'}
                    </h2>
                  </div>
                  <span className="text-[10px] text-[#242220]/45">
                    {language === 'ar'
                      ? 'يمكن مقارنة 3 قطع كحد أقصى'
                      : 'Up to 3 pieces'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {candidateProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addToCompare(product.id)}
                      className="group text-start"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
                        <ImageWithFallback
                          src={product.image}
                          alt={language === 'ar' ? product.nameAr : product.nameEn}
                          fill
                          sizes="(max-width: 640px) 50vw, 16vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <span className="absolute end-2 bottom-2 flex h-8 w-8 items-center justify-center bg-[#111111] text-white">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <span className="mt-2 block line-clamp-2 text-[11px] font-semibold leading-4 text-[#111111]">
                        {language === 'ar' ? product.nameAr : product.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className="mt-16 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-3">
          {[
            {
              icon: ScanSearch,
              ar: 'قارن البيانات لا الانطباع',
              en: 'Compare data, not impressions',
              descAr: 'الخامة والتفصيل والعناية مأخوذة من بيانات كل منتج نفسه.',
              descEn: 'Fabric, tailoring and care come directly from each product record.',
            },
            {
              icon: Columns3,
              ar: 'ثلاث قطع فقط',
              en: 'Three pieces, intentionally',
              descAr: 'الحد المقصود يقلل التشتيت ويسهّل اتخاذ القرار.',
              descEn: 'The deliberate limit reduces noise and keeps the decision manageable.',
            },
            {
              icon: Check,
              ar: 'لا ادعاءات مخفية',
              en: 'No hidden fit claims',
              descAr: 'المقارنة لا تدّعي قياس جسم أو توصية مقاس آلية غير موثقة.',
              descEn: 'The studio does not invent body measurements or unverified automated sizing.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.en} className="bg-[#F7F4EF] p-6">
                <Icon className="h-4 w-4 text-[#511D24]" />
                <h3 className="mt-4 text-sm font-bold text-[#111111]">
                  {language === 'ar' ? item.ar : item.en}
                </h3>
                <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
                  {language === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>
            );
          })}
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
          >
            <span>
              {language === 'ar'
                ? 'غير متأكد ماذا تقارن؟ ابدأ بمنسّق رِفْعة'
                : 'Not sure what to compare? Start with the RIFAA Curator'}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
