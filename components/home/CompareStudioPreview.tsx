'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Columns3, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompare } from '@/context/CompareContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

const DEFAULT_IDS = ['w-02', 'w-03', 'w-04'];

export function CompareStudioPreview() {
  const { language, isRtl } = useLanguage();
  const { compareItems, compareCount, addManyToCompare } = useCompare();

  const defaults = DEFAULT_IDS
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const products = compareItems.length > 0 ? compareItems : defaults;
  const usingPersonalBoard = compareItems.length > 0;

  return (
    <section className="bg-[#FFFDFC] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-[#242220]/10">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col justify-between bg-[#171615] p-6 text-white sm:p-9 lg:p-10">
              <div>
                <div className="flex items-center gap-2 text-[#B59A73]">
                  <Columns3 className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">
                    {language === 'ar' ? 'استوديو المقارنة' : 'RIFAA COMPARE STUDIO'}
                  </span>
                </div>
                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                  {usingPersonalBoard
                    ? language === 'ar'
                      ? 'مقارنتك الحالية جاهزة للقرار.'
                      : 'Your current comparison is ready for a closer decision.'
                    : language === 'ar'
                      ? 'حين تتشابه الصور، التفاصيل هي التي تحسم القرار.'
                      : 'When the images feel close, the details should decide.'}
                </h2>
                <p className="mt-4 max-w-lg text-sm font-light leading-7 text-white/62">
                  {language === 'ar'
                    ? 'قارن حتى ثلاث قطع في الخامة، التفصيل، القصّة، العناية، الألوان، المقاسات والسعر — بدون فتح تبويبات متعددة.'
                    : 'Compare up to three pieces across fabrication, tailoring, fit, care, colors, sizes and price — without juggling multiple tabs.'}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {!usingPersonalBoard && (
                  <button
                    type="button"
                    onClick={() => addManyToCompare(DEFAULT_IDS)}
                    className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{language === 'ar' ? 'حمّل مقارنة مقترحة' : 'Load a curated comparison'}</span>
                  </button>
                )}

                <Link
                  href="/compare"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white"
                >
                  <Sparkles className="h-4 w-4 text-[#B59A73]" />
                  <span className="border-b border-white/35 pb-1">
                    {language === 'ar'
                      ? compareCount > 0
                        ? 'افتح مقارنتي'
                        : 'افتح استوديو المقارنة'
                      : compareCount > 0
                        ? 'Open my comparison'
                        : 'Open Compare Studio'}
                  </span>
                  {isRtl ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>

            <div className="grid min-h-[520px] grid-cols-3 gap-px bg-[#242220]/10">
              {products.slice(0, 3).map((product, index) => (
                <Link
                  key={product.id}
                  href={'/products/' + product.slug}
                  className="group relative overflow-hidden bg-[#E7E0D4]"
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    fill
                    sizes="(max-width: 1024px) 33vw, 22vw"
                    className="object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                    <span className="font-editorial text-xs text-[#D9D0C4]">
                      0{index + 1}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold leading-4 sm:text-sm">
                      {language === 'ar' ? product.nameAr : product.nameEn}
                    </span>
                    <span className="mt-2 hidden text-[9px] uppercase tracking-[0.13em] text-white/50 sm:block">
                      {language === 'ar' ? product.fabricAr : product.fabricEn}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
