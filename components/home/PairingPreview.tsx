'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers3, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { getPairingRecommendations } from '@/lib/pairing';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function PairingPreview() {
  const { language, isRtl } = useLanguage();
  const anchor = DEMO_PRODUCTS.find((product) => product.id === 'w-01') || DEMO_PRODUCTS[0];
  const recommendations = getPairingRecommendations(anchor, 3);
  const pieces = [anchor, ...recommendations.map((item) => item.product)];

  return (
    <section className="bg-[#F7F4EF] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div className="flex flex-col justify-between border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <Layers3 className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">
                  {language === 'ar' ? 'ذكاء التنسيق الديناميكي' : 'RIFAA PAIRING INTELLIGENCE'}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.06] tracking-tight text-[#111111] sm:text-5xl">
                {language === 'ar'
                  ? 'كل قطعة يمكن أن تصبح نقطة بداية.'
                  : 'Every piece can become the starting point.'}
              </h2>
              <p className="mt-5 max-w-lg text-sm font-light leading-7 text-[#242220]/62">
                {language === 'ar'
                  ? 'اختر أي منتج، وسيبني رِفْعة حوله اقتراحات مكملة من نفس القسم حسب نوع القطعة، التشكيلة وتقارب الألوان.'
                  : 'Choose any product and RIFAA builds complementary suggestions around it using product role, collection and color harmony.'}
              </p>
            </div>

            <Link
              href={'/pairing?anchor=' + anchor.id}
              className="group mt-8 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
            >
              <Sparkles className="h-4 w-4 text-[#511D24]" />
              <span className="border-b border-[#111111]/30 pb-1">
                {language === 'ar' ? 'جرّب استوديو التنسيق' : 'Try Pairing Studio'}
              </span>
              {isRtl ? (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>

          <div className="grid min-h-[620px] grid-cols-2 gap-px bg-[#242220]/10 sm:grid-cols-4">
            {pieces.map((product, index) => (
              <Link
                key={product.id}
                href={'/products/' + product.slug}
                className="group relative overflow-hidden bg-[#E7E0D4]"
              >
                <ImageWithFallback
                  src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.nameEn}
                  fill
                  sizes="(max-width: 640px) 50vw, 22vw"
                  className="object-cover object-center transition-transform duration-[1000ms] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                <span className="absolute start-3 top-3 bg-[#111111]/82 px-2 py-1 font-editorial text-[10px] text-white">
                  0{index + 1}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-[11px] font-semibold leading-4 text-white">
                  {language === 'ar' ? product.nameAr : product.nameEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
