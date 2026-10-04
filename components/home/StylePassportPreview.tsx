'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, IdCard, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEFAULT_STYLE_PASSPORT, useStylePassport } from '@/context/StylePassportContext';
import { getDiscoveryRecommendations } from '@/lib/discovery';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function StylePassportPreview() {
  const { language, isRtl } = useLanguage();
  const { passport, isConfigured, curatorHref, capsuleHref } = useStylePassport();
  const current = passport ?? DEFAULT_STYLE_PASSPORT;
  const department =
    current.audience === 'women' || current.audience === 'men'
      ? current.audience
      : 'kids';

  const recommendations = getDiscoveryRecommendations(
    {
      department,
      moment: current.moment,
      priority: current.priority,
    },
    3
  );

  return (
    <section className="bg-[#EEE8DE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden border border-[#242220]/10 bg-[#FFFDFC] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-10">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <IdCard className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
                  {language === 'ar' ? 'جواز أسلوب رِفْعة' : 'RIFAA STYLE PASSPORT'}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-[1.07] tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
                {isConfigured
                  ? language === 'ar'
                    ? 'تفضيلاتك أصبحت نقطة بداية، لا سؤالاً يتكرر.'
                    : 'Your preferences are now a starting point, not a repeated question.'
                  : language === 'ar'
                    ? 'تخصيص أذكى بأربع تفضيلات فقط.'
                    : 'Smarter personalization with only four preferences.'}
              </h2>
              <p className="mt-4 max-w-lg text-sm font-light leading-7 text-[#242220]/62">
                {language === 'ar'
                  ? 'احفظ الجمهور والمناسبة ولوحة الألوان وأولوية الاختيار محلياً، ثم افتح المنسّق والكابسولة على إعدادات أقرب لك.'
                  : 'Save audience, moment, palette and decision priority locally, then open Curator and Capsule closer to your taste.'}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {[current.audience, current.moment, current.palette, current.priority].map((value) => (
                  <span key={value} className="border border-[#242220]/10 bg-[#F7F4EF] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#242220]/55">
                    {value}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/passport"
                  className="group inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#511D24]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isConfigured ? (language === 'ar' ? 'عدّل جوازك' : 'Edit passport') : (language === 'ar' ? 'أنشئ جوازك' : 'Create passport')}</span>
                </Link>
                <Link
                  href={isConfigured ? curatorHref : capsuleHref}
                  className="group inline-flex items-center gap-2 border-b border-[#111111]/35 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]"
                >
                  <span>{language === 'ar' ? 'جرّب التخصيص الآن' : 'Try personalization now'}</span>
                  {isRtl ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid min-h-[520px] grid-cols-3 gap-px bg-[#242220]/10">
            {recommendations.map(({ product }, index) => (
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
                  className="object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.045]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                  <span className="font-editorial text-xs text-[#D9D0C4]">0{index + 1}</span>
                  <span className="mt-1 block text-[10px] font-semibold leading-4 sm:text-xs">
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
