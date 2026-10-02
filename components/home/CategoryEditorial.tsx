'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function CategoryEditorial() {
  const { language, isRtl, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-[#F7F4EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 pb-4 border-b border-[#242220]/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {language === 'ar' ? 'أقسام الدار' : 'DEPARTMENTS'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? 'التشكيلات الرئيسية' : 'Primary Collections'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {language === 'ar'
              ? 'ثلاثة مسارات إبداعية تتقاطع فيها الرصانة العصرية مع الحرفية الأصيلة في المملكة.'
              : 'Three distinct sartorial narratives bridging modern minimalism and noble Saudi craftsmanship.'}
          </p>
        </div>

        {/* Asymmetrical High-Impact Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* WOMEN: Dominant Large Feature (7 Columns on Desktop) */}
          <div className="md:col-span-7 relative group overflow-hidden bg-[#EAE4D9] min-h-[480px] md:min-h-[640px] flex flex-col justify-end p-6 sm:p-10">
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src={MEDIA_MANIFEST.categoryWomen.src}
                alt={language === 'ar' ? MEDIA_MANIFEST.categoryWomen.altAr : MEDIA_MANIFEST.categoryWomen.altEn}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/25 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3 max-w-lg">
              <span className="text-[11px] font-medium tracking-[0.25em] text-[#D9D0C4] uppercase">
                {language === 'ar' ? 'مجموعة المرأة' : 'WOMEN’S REPERTOIRE'}
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                {t.categories.womenTitle}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                {t.categories.womenSubtitle}
              </p>
              <div className="pt-2">
                <Link
                  href="/women"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white hover:text-[#D9D0C4] transition-colors group/cta"
                >
                  <span className="border-b border-white pb-0.5 group-hover/cta:border-[#D9D0C4]">
                    {t.actions.shopNow}
                  </span>
                  {isRtl ? (
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/cta:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: MEN & KIDS Stacked Asymmetrically (5 Columns on Desktop) */}
          <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* MEN: Architectural Secondary */}
            <div className="relative group overflow-hidden bg-[#EAE4D9] min-h-[300px] md:min-h-[320px] flex-1 flex flex-col justify-end p-6 sm:p-8">
              <div className="absolute inset-0 z-0">
                <ImageWithFallback
                  src={MEDIA_MANIFEST.categoryMen.src}
                  alt={language === 'ar' ? MEDIA_MANIFEST.categoryMen.altAr : MEDIA_MANIFEST.categoryMen.altEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent" />
              </div>

              <div className="relative z-10 space-y-2 max-w-sm">
                <span className="text-[11px] font-medium tracking-[0.25em] text-[#D9D0C4] uppercase">
                  {language === 'ar' ? 'مجموعة الرجل' : 'MEN’S REPERTOIRE'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {t.categories.menTitle}
                </h3>
                <p className="text-xs text-white/80 font-light leading-relaxed line-clamp-2">
                  {t.categories.menSubtitle}
                </p>
                <div className="pt-1">
                  <Link
                    href="/men"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white hover:text-[#D9D0C4] transition-colors group/cta"
                  >
                    <span className="border-b border-white pb-0.5 group-hover/cta:border-[#D9D0C4]">
                      {t.actions.shopNow}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/cta:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                    )}
                  </Link>
                </div>
              </div>
            </div>

            {/* KIDS: Refined, Warm, Lighter */}
            <div className="relative group overflow-hidden bg-[#EAE4D9] min-h-[260px] md:min-h-[280px] flex-1 flex flex-col justify-end p-6 sm:p-8">
              <div className="absolute inset-0 z-0">
                <ImageWithFallback
                  src={MEDIA_MANIFEST.categoryKids.src}
                  alt={language === 'ar' ? MEDIA_MANIFEST.categoryKids.altAr : MEDIA_MANIFEST.categoryKids.altEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/25 to-transparent" />
              </div>

              <div className="relative z-10 space-y-2 max-w-sm">
                <span className="text-[11px] font-medium tracking-[0.25em] text-[#D9D0C4] uppercase">
                  {language === 'ar' ? 'مجموعة الأطفال' : 'KIDS’ REPERTOIRE'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {t.categories.kidsTitle}
                </h3>
                <p className="text-xs text-white/80 font-light leading-relaxed line-clamp-2">
                  {t.categories.kidsSubtitle}
                </p>
                <div className="pt-1">
                  <Link
                    href="/kids"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white hover:text-[#D9D0C4] transition-colors group/cta"
                  >
                    <span className="border-b border-white pb-0.5 group-hover/cta:border-[#D9D0C4]">
                      {t.actions.shopNow}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/cta:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
