'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Layers3,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';
import { PairingRecommendation } from '@/lib/pairing';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

export function CompleteTheLook({
  anchor,
  recommendations,
}: {
  anchor: Product;
  recommendations: PairingRecommendation[];
}) {
  const { language, isRtl } = useLanguage();
  const { addManyToBag } = useBag();
  const { addManyToWishlist, wishlistIds } = useWishlist();
  const [added, setAdded] = useState(false);

  const pieces = [anchor, ...recommendations.map((item) => item.product)].slice(0, 4);
  const total = pieces.reduce((sum, product) => sum + product.price, 0);
  const allSaved = pieces.every((product) => wishlistIds.includes(product.id));

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
    <section className="mt-16 overflow-hidden border border-[#242220]/10 bg-[#FFFDFC] md:mt-24">
      <div className="grid lg:grid-cols-[0.74fr_1.26fr]">
        <div className="flex flex-col justify-between bg-[#EEE8DE]/65 p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Layers3 className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                {language === 'ar' ? 'ذكاء تنسيق القطعة' : 'PAIRING INTELLIGENCE'}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
              {language === 'ar' ? 'أكمل الإطلالة حول هذه القطعة.' : 'Complete the look around this piece.'}
            </h2>

            <p className="mt-4 text-sm font-light leading-7 text-[#242220]/62">
              {language === 'ar'
                ? 'يختار المحرك أدواراً مكملة من نفس القسم اعتماداً على نوع القطعة، التشكيلة، تقارب الألوان، وحالة المنتج — وليس على صورة عشوائية.'
                : 'The engine selects complementary roles from the same department using category, collection, color harmony and availability signals — not random imagery.'}
            </p>
          </div>

          <div className="mt-8">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#242220]/42">
              {language === 'ar' ? 'إجمالي التحرير' : 'EDIT TOTAL'}
            </span>
            <span className="mt-1 block text-2xl font-bold text-[#111111]">
              {formatPrice(total, language)}
            </span>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button
                type="button"
                onClick={addLook}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#511D24]"
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                <span>
                  {added
                    ? language === 'ar'
                      ? 'تمت إضافة الإطلالة'
                      : 'Look added'
                    : language === 'ar'
                      ? 'أضف الإطلالة للحقيبة'
                      : 'Add full look to bag'}
                </span>
              </button>

              <button
                type="button"
                onClick={saveLook}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#111111] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#111111] hover:bg-[#FFFDFC]"
              >
                {allSaved ? <Check className="h-4 w-4 text-[#511D24]" /> : <Heart className="h-4 w-4" />}
                <span>
                  {allSaved
                    ? language === 'ar'
                      ? 'الإطلالة محفوظة'
                      : 'Look saved'
                    : language === 'ar'
                      ? 'احفظ الإطلالة'
                      : 'Save full look'}
                </span>
              </button>
            </div>

            <Link
              href={'/pairing?anchor=' + anchor.id}
              className="group mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#511D24]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="border-b border-[#511D24]/25 pb-1">
                {language === 'ar' ? 'افتح استوديو التنسيق' : 'Open Pairing Studio'}
              </span>
              {isRtl ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-[#242220]/10">
          {pieces.map((product, index) => {
            const recommendation =
              index === 0
                ? null
                : recommendations.find((item) => item.product.id === product.id);

            return (
              <Link
                key={product.id}
                href={'/products/' + product.slug}
                className="group bg-[#F7F4EF]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
                  <ImageWithFallback
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    fill
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    className="object-cover object-center transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/66 via-transparent to-transparent" />
                  <span className="absolute start-3 top-3 bg-[#111111]/82 px-2 py-1 font-editorial text-[10px] text-white">
                    0{index + 1}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                    <span className="text-[10px] font-semibold leading-4">
                      {language === 'ar' ? product.nameAr : product.nameEn}
                    </span>
                    {recommendation && (
                      <span className="mt-1 hidden text-[9px] leading-4 text-white/55 sm:block">
                        {language === 'ar' ? recommendation.reasonAr : recommendation.reasonEn}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
