'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function Hero() {
  const { language, isRtl, t } = useLanguage();
  const heroMedia = MEDIA_MANIFEST.heroCampaign;

  return (
    <section className="relative w-full h-[100svh] min-h-[640px] max-h-[1100px] overflow-hidden bg-[#161514]">
      {/* Background Campaign Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroMedia.src}
          alt={language === 'ar' ? heroMedia.altAr : heroMedia.altEn}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Editorial Gradients for Legibility & Contrast (WCAG AA compliant) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-black/20" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#111111]/15 to-[#111111]/55" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Season Kicker (Quiet inline text, Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.25em] text-[#D9D0C4] uppercase">
            <span>{t.hero.season}</span>
            <span aria-hidden="true" className="text-[#B59A73]">·</span>
            <span>{language === 'ar' ? 'الرياض' : 'RIYADH'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] text-balance">
            {t.hero.headline}
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base md:text-lg text-white/85 font-light leading-relaxed max-w-xl text-balance">
            {t.hero.subtitle}
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/collections"
              className="py-3.5 sm:py-4 px-6 sm:px-8 bg-white hover:bg-[#F7F4EF] text-[#111111] text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 shadow-md cursor-pointer group"
            >
              <span>{t.hero.primaryCta}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>

            <Link
              href="/new"
              className="py-3.5 sm:py-4 px-6 sm:px-8 border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300 backdrop-blur-xs cursor-pointer"
            >
              <span>{t.hero.secondaryCta}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden md:flex absolute bottom-8 end-8 z-10 items-center gap-2 text-white/60 text-[11px] tracking-widest uppercase pointer-events-none">
        <span className="w-8 h-[1px] bg-white/40" />
        <span>{language === 'ar' ? 'استكشف التشكيلة' : 'SCROLL TO EXPLORE'}</span>
      </div>
    </section>
  );
}
