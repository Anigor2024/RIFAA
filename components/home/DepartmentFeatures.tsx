'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function DepartmentFeatures() {
  const { language, isRtl, t } = useLanguage();

  return (
    <div className="space-y-16 md:space-y-28 py-12 md:py-20 bg-[#F7F4EF]">
      {/* 1. WOMEN FEATURE: Dramatic Architectural Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative group overflow-hidden bg-[#E2DBD0] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
            <ImageWithFallback
              src={MEDIA_MANIFEST.featureWomenCoat.src}
              alt={language === 'ar' ? MEDIA_MANIFEST.featureWomenCoat.altAr : MEDIA_MANIFEST.featureWomenCoat.altEn}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 start-6 text-white/90 text-xs tracking-widest uppercase">
              {language === 'ar' ? 'تصاميم معاصرة للمرأة · الدرعية' : 'CONTEMPORARY MODEST SILHOUETTES · DIRIYAH'}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block">
                {t.features.women.label}
              </span>
              <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] text-[#242220]/60 uppercase block">
                {t.features.women.subtitle}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.15] text-balance">
              {t.features.women.title}
            </h2>

            <p className="text-sm sm:text-base text-[#242220]/80 font-light leading-relaxed text-balance">
              {t.features.women.description}
            </p>

            <div className="pt-2">
              <Link
                href="/women"
                className="inline-flex items-center gap-2.5 py-3.5 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <span>{t.features.women.cta}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MEN FEATURE: Architectural Horizontal Framing (Inverted Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block">
                {t.features.men.label}
              </span>
              <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] text-[#242220]/60 uppercase block">
                {t.features.men.subtitle}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.15] text-balance">
              {t.features.men.title}
            </h2>

            <p className="text-sm sm:text-base text-[#242220]/80 font-light leading-relaxed text-balance">
              {t.features.men.description}
            </p>

            <div className="pt-2">
              <Link
                href="/men"
                className="inline-flex items-center gap-2.5 py-3.5 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <span>{t.features.men.cta}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 relative group overflow-hidden bg-[#D8D2C6] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5]">
            <ImageWithFallback
              src={MEDIA_MANIFEST.featureMenBisht.src}
              alt={language === 'ar' ? MEDIA_MANIFEST.featureMenBisht.altAr : MEDIA_MANIFEST.featureMenBisht.altEn}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 start-6 text-white/90 text-xs tracking-widest uppercase">
              {language === 'ar' ? 'بشت مناسبات وثوب تفصيل · الرياض' : 'CEREMONIAL BISHT & BESPOKE THOBE · RIYADH'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. KIDS FEATURE: Warm Natural Light & Organic Movement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#ECE6DB] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5 z-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block">
                {t.features.kids.label}
              </span>
              <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] text-[#242220]/60 uppercase block">
                {t.features.kids.subtitle}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-tight text-balance">
                {t.features.kids.title}
              </h2>
              <p className="text-sm sm:text-base text-[#242220]/80 font-light leading-relaxed max-w-lg text-balance">
                {t.features.kids.description}
              </p>
              <div className="pt-2">
                <Link
                  href="/kids"
                  className="inline-flex items-center gap-2.5 py-3.5 px-8 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-sm"
                >
                  <span>{t.features.kids.cta}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#D8D0C2]">
              <ImageWithFallback
                src={MEDIA_MANIFEST.featureKidsPlay.src}
                alt={language === 'ar' ? MEDIA_MANIFEST.featureKidsPlay.altAr : MEDIA_MANIFEST.featureKidsPlay.altEn}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
