'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function ShopTheEdit() {
  const { language, isRtl, t } = useLanguage();

  return (
    <section className="py-16 md:py-28 bg-[#201E1C] text-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Editorial Campaign Imagery (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full overflow-hidden bg-[#2D2A27]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
                alt="City After Sunset - RIFAA Editorial"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#201E1C]/60 via-transparent to-transparent" />
            </div>

            {/* Subtle Editorial Caption Stamp */}
            <div className="absolute -bottom-4 end-4 sm:end-8 bg-[#161514] py-2 px-4 border-t border-[#B59A73]/30 text-[10px] tracking-widest text-[#B59A73] uppercase hidden sm:block">
              {language === 'ar' ? 'العدد الأول · ليالي نجد' : 'ISSUE 01 · NAJD EVENINGS'}
            </div>
          </div>

          {/* Editorial Narrative Typography (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:ps-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#B59A73] font-medium block">
                {t.shopTheEdit.label}
              </span>
              <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] text-[#D9D0C4] uppercase block">
                {t.shopTheEdit.subtitle}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {t.shopTheEdit.title}
            </h2>

            <p className="text-sm sm:text-base text-[#D9D0C4]/85 font-light leading-relaxed text-balance">
              {t.shopTheEdit.description}
            </p>

            <div className="pt-4 border-t border-[#FAF8F5]/10 space-y-4">
              <p className="text-xs text-[#FAF8F5]/60 font-light leading-relaxed">
                {language === 'ar'
                  ? 'مجموعة منتقاة تحتفي بالتباين بين الألوان الحيادية الدافئة والأسود المعتم، بحضور يعكس وقار ليالي العاصمة.'
                  : 'A curated wardrobe balancing warm neutral sandstones against deep matte obsidian, conceived for understated metropolitan poise.'}
              </p>

              <div>
                <Link
                  href="/editorial"
                  className="inline-flex items-center gap-2.5 py-3.5 px-7 bg-[#B59A73] hover:bg-[#C8AE87] text-[#111111] text-xs font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer"
                >
                  <span>{t.shopTheEdit.cta}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
