'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Layers3,
  Plus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { getPairingRecommendations } from '@/lib/pairing';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

export default function PairingPage() {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addManyToBag } = useBag();
  const { addManyToWishlist, wishlistIds } = useWishlist();

  const requestedId = searchParams.get('anchor');
  const initialAnchor =
    DEMO_PRODUCTS.find((product) => product.id === requestedId) ||
    DEMO_PRODUCTS.find((product) => product.id === 'w-01') ||
    DEMO_PRODUCTS[0];

  const [anchorId, setAnchorId] = useState(initialAnchor.id);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const anchor =
    DEMO_PRODUCTS.find((product) => product.id === anchorId) || initialAnchor;

  const recommendations = useMemo(
    () => getPairingRecommendations(anchor, 6),
    [anchor]
  );

  const activeRecommendations =
    selectedIds.length > 0
      ? recommendations.filter((item) => selectedIds.includes(item.product.id)).slice(0, 3)
      : recommendations.slice(0, 3);

  const pieces = [anchor, ...activeRecommendations.map((item) => item.product)];
  const total = pieces.reduce((sum, product) => sum + product.price, 0);
  const allSaved = pieces.every((product) => wishlistIds.includes(product.id));

  const changeAnchor = (id: string) => {
    setAnchorId(id);
    setSelectedIds([]);
    router.replace('/pairing?anchor=' + id, { scroll: false });
  };

  const toggleRecommendation = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const addLook = () => {
    addManyToBag(
      pieces.map((product) => ({
        product,
        color: product.colors[0],
        size: product.sizes[0] || 'M',
        quantity: 1,
      }))
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const saveLook = () => addManyToWishlist(pieces.map((product) => product.id));

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45">
          <Link href="/" className="hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/studio" className="hover:text-[#111111]">
            {language === 'ar' ? 'الاستوديو' : 'Studio'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'استوديو التنسيق' : 'Pairing Studio'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Layers3 className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                {language === 'ar' ? 'تنسيق ديناميكي حول أي قطعة' : 'DYNAMIC PRODUCT PAIRING'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'ابدأ بقطعة واحدة، وابنِ حولها إطلالة كاملة.'
                : 'Start with one piece and build a complete edit around it.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'الاقتراحات تعتمد على نوع القطعة، القسم، التشكيلة، تقارب الألوان والتوفر. يمكنك اختيار حتى ثلاث قطع مكملة.'
              : 'Recommendations use category, department, collection, color harmony and availability. Choose up to three complementary pieces.'}
          </p>
        </header>

        <section className="mt-8 border border-[#242220]/10 bg-[#EEE8DE]/60 p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                {language === 'ar' ? 'القطعة المحورية' : 'ANCHOR PIECE'}
              </span>
              <p className="mt-1 text-xs leading-5 text-[#242220]/50">
                {language === 'ar' ? 'اختر أي قطعة من الـ36.' : 'Choose any of the 36 pieces.'}
              </p>
            </div>

            <select
              value={anchorId}
              onChange={(event) => changeAnchor(event.target.value)}
              className="w-full border border-[#242220]/15 bg-[#FFFDFC] px-4 py-3 text-sm text-[#111111] outline-none focus:border-[#511D24]"
            >
              {DEMO_PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {language === 'ar' ? product.nameAr : product.nameEn}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <article className="overflow-hidden border border-[#242220]/10 bg-[#FFFDFC]">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
              <ImageWithFallback
                src={anchor.image}
                alt={language === 'ar' ? anchor.nameAr : anchor.nameEn}
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#D9D0C4]">
                  {language === 'ar' ? 'نقطة البداية' : 'ANCHOR'}
                </span>
                <h2 className="mt-1 text-2xl font-bold">
                  {language === 'ar' ? anchor.nameAr : anchor.nameEn}
                </h2>
                <span className="mt-2 block text-sm font-semibold">
                  {formatPrice(anchor.price, language)}
                </span>
              </div>
            </div>
          </article>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                  {language === 'ar' ? 'القطع المكملة' : 'COMPLEMENTARY PIECES'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'اختر حتى ثلاث قطع' : 'Choose up to three'}
                </h2>
              </div>
              <span className="text-xs text-[#242220]/45">
                {selectedIds.length > 0 ? selectedIds.length : 3}/3
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {recommendations.map((item) => {
                const selected =
                  selectedIds.length === 0
                    ? recommendations.slice(0, 3).some((entry) => entry.product.id === item.product.id)
                    : selectedIds.includes(item.product.id);

                return (
                  <button
                    key={item.product.id}
                    type="button"
                    onClick={() => toggleRecommendation(item.product.id)}
                    className="group text-start"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={language === 'ar' ? item.product.nameAr : item.product.nameEn}
                        fill
                        sizes="(max-width: 640px) 50vw, 22vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <span
                        className={
                          selected
                            ? 'absolute end-3 top-3 flex h-8 w-8 items-center justify-center bg-[#111111] text-white'
                            : 'absolute end-3 top-3 flex h-8 w-8 items-center justify-center bg-white/90 text-[#111111]'
                        }
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                    <span className="mt-2 block line-clamp-2 text-xs font-bold leading-5 text-[#111111]">
                      {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                    </span>
                    <span className="mt-1 block text-[9px] leading-4 text-[#242220]/48">
                      {language === 'ar' ? item.reasonAr : item.reasonEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 border-t border-[#242220]/10 pt-8 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#242220]/42">
              {language === 'ar' ? 'إجمالي التحرير الحالي' : 'CURRENT EDIT TOTAL'}
            </span>
            <span className="mt-1 block text-3xl font-bold text-[#111111]">
              {formatPrice(total, language)}
            </span>
          </div>

          <button
            type="button"
            onClick={saveLook}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#111111] hover:bg-[#EEE8DE]"
          >
            {allSaved ? <Check className="h-4 w-4 text-[#511D24]" /> : <Heart className="h-4 w-4" />}
            <span>{allSaved ? (language === 'ar' ? 'محفوظة' : 'Saved') : (language === 'ar' ? 'احفظ الإطلالة' : 'Save look')}</span>
          </button>

          <button
            type="button"
            onClick={addLook}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#511D24]"
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            <span>{added ? (language === 'ar' ? 'تمت الإضافة' : 'Added') : (language === 'ar' ? 'أضف التحرير للحقيبة' : 'Add edit to bag')}</span>
          </button>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/studio"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
          >
            <Sparkles className="h-4 w-4 text-[#511D24]" />
            <span>{language === 'ar' ? 'ارجع إلى استوديو رِفْعة' : 'Return to RIFAA Studio'}</span>
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
