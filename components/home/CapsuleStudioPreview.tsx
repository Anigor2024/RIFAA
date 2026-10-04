'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Grid2X2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCapsule, getCapsuleMetrics } from '@/lib/capsule';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

export function CapsuleStudioPreview() {
  const { language, isRtl } = useLanguage();
  const selections = getCapsule({
    audience: 'women',
    moment: 'daily',
    palette: 'neutral',
  });
  const metrics = getCapsuleMetrics(selections);

  return (
    <section className="bg-[#1A1917] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#B59A73]">
                <Grid2X2 className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                  {language === 'ar' ? 'استوديو الكابسولة' : 'RIFAA CAPSULE STUDIO'}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                {language === 'ar'
                  ? 'خزانة أصغر، قرارات أذكى، وتناسق أوضح.'
                  : 'A smaller wardrobe, smarter decisions, clearer cohesion.'}
              </h2>
              <p className="mt-5 max-w-lg text-sm font-light leading-7 text-white/62">
                {language === 'ar'
                  ? 'ابنِ خمس قطع بوظائف مختلفة حسب المناسبة وطابع الألوان، ثم احفظ الكابسولة أو أضفها كاملة للحقيبة.'
                  : 'Build five pieces with distinct roles by moment and palette, then save the capsule or add the complete edit to bag.'}
              </p>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-3 gap-px border border-white/12 bg-white/12">
                <div className="bg-black/25 p-4">
                  <span className="font-editorial text-2xl">{metrics.rolesFilled}/5</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-white/45">
                    {language === 'ar' ? 'وظائف' : 'roles'}
                  </span>
                </div>
                <div className="bg-black/25 p-4">
                  <span className="font-editorial text-2xl">{metrics.colorways}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-white/45">
                    {language === 'ar' ? 'ألوان' : 'colorways'}
                  </span>
                </div>
                <div className="bg-black/25 p-4">
                  <span className="font-editorial text-base">{formatPrice(metrics.total, language)}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-white/45">
                    {language === 'ar' ? 'الإجمالي' : 'total'}
                  </span>
                </div>
              </div>

              <Link
                href="/capsule"
                className="group mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                <Sparkles className="h-4 w-4 text-[#B59A73]" />
                <span className="border-b border-white/35 pb-1">
                  {language === 'ar' ? 'ابنِ كابسولتك' : 'Build your capsule'}
                </span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </div>

          <div className="grid min-h-[620px] grid-cols-6 grid-rows-6 gap-2 sm:gap-3">
            {selections.map(({ product }, index) => {
              const classes = [
                'col-span-4 row-span-4',
                'col-span-2 row-span-3',
                'col-span-2 row-span-3',
                'col-span-2 row-span-2',
                'col-span-2 row-span-2',
              ][index];

              return (
                <Link
                  key={product.id}
                  href={'/products/' + product.slug}
                  className={'group relative overflow-hidden bg-[#302E2A] ' + classes}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={language === 'ar' ? product.nameAr : product.nameEn}
                    fill
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    className="object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.045]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <span className="absolute start-3 bottom-3 font-editorial text-xs text-white/80">
                    0{index + 1}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
