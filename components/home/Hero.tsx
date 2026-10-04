'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function Hero() {
  const { language, isRtl, t } = useLanguage();
  const heroMedia = MEDIA_MANIFEST.heroCampaign;

  return (
    <section className="relative h-[100svh] min-h-[680px] max-h-[1120px] w-full overflow-hidden bg-[#161514]">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroMedia.src}
          alt={language === 'ar' ? heroMedia.altAr : heroMedia.altEn}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B]/95 via-[#111111]/28 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,transparent_0%,rgba(10,9,9,0.08)_32%,rgba(10,9,9,0.58)_100%)]" />
        <div className="absolute inset-y-0 start-0 w-[52%] bg-gradient-to-e from-transparent to-black/35" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block">
        <div className="absolute inset-y-0 start-[8.333%] w-px bg-white/[0.055]" />
        <div className="absolute inset-y-0 start-1/2 w-px bg-white/[0.04]" />
        <div className="absolute inset-y-0 end-[8.333%] w-px bg-white/[0.055]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_330px] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#B59A73] rifaa-line-motion" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9D0C4] sm:text-xs">
                {t.hero.season}
              </span>
              <span aria-hidden="true" className="text-[#B59A73]">·</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9D0C4] sm:text-xs">
                {language === 'ar' ? 'الرياض' : 'RIYADH'}
              </span>
            </div>

            <h1 className="max-w-[900px] text-balance text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-[5.7rem]">
              {t.hero.headline}
            </h1>

            <p className="mt-5 max-w-xl text-balance text-sm font-light leading-7 text-white/78 sm:text-base md:text-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/collections"
                className="group inline-flex items-center gap-2.5 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#111111] shadow-md transition-all duration-300 hover:bg-[#F7F4EF] sm:px-8 sm:py-4"
              >
                <span>{t.hero.primaryCta}</span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>

              <Link
                href="/discover"
                className="group inline-flex items-center gap-2.5 border border-white/45 bg-black/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10 sm:px-8 sm:py-4"
              >
                <Sparkles className="h-4 w-4 text-[#D9D0C4]" />
                <span>{language === 'ar' ? 'منسّق رِفْعة' : 'RIFAA Curator'}</span>
              </Link>
            </div>
          </div>

          <aside className="hidden border border-white/16 bg-black/22 p-5 text-white backdrop-blur-md lg:block">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B59A73]">
                {language === 'ar' ? 'فهرس التجربة' : 'EXPERIENCE INDEX'}
              </span>
              <ScanSearch className="h-4 w-4 text-white/45" />
            </div>

            <div className="mt-5 divide-y divide-white/10">
              {[
                ['01', language === 'ar' ? '36 قطعة بتفاصيل كاملة' : '36 fully detailed pieces'],
                ['02', language === 'ar' ? 'منسّق ذكي حسب المناسبة' : 'Occasion-aware smart curator'],
                ['03', language === 'ar' ? 'فحص نسيج حتى 9×' : 'Up to 9× textile inspection'],
                ['04', language === 'ar' ? 'حسابات سحابية ومفضلة متزامنة' : 'Cloud accounts & synced wishlist'],
              ].map(([number, label]) => (
                <div key={number} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                  <span className="font-editorial text-sm text-[#B59A73]">{number}</span>
                  <span className="text-[11px] leading-5 text-white/68">{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <Link
        href="#collections"
        aria-label={language === 'ar' ? 'انتقل إلى التشكيلات' : 'Jump to collections'}
        className="absolute bottom-6 end-5 z-20 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white md:flex lg:end-8"
      >
        <span>{language === 'ar' ? 'ابدأ الاستكشاف' : 'BEGIN EXPLORING'}</span>
        <ArrowDown className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
