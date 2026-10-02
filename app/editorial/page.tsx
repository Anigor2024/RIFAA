'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { JOURNAL_STORIES } from '@/data/stories';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export default function EditorialPage() {
  const { language, isRtl, t } = useLanguage();

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#242220]/50 mb-6">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">
            {language === 'ar' ? 'الإطلالات والمجلة' : 'Editorial & Journal'}
          </span>
        </div>

        {/* Page Hero */}
        <div className="pb-8 mb-12 border-b border-[#242220]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {language === 'ar' ? 'منشورات الدار' : 'RIFAA PUBLISHING'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? 'تحرير رِفْعة والمجلة' : 'Editorial & Journal'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {language === 'ar'
              ? 'مساحة بصرية وفكرية تستكشف أبعاد الأناقة المعاصرة، حوارات الأقمشة، وتفاصيل الإطلالات في مدن المملكة.'
              : 'A visual and sartorial exploration of modern aesthetics, noble textiles, and lifestyle across the Kingdom.'}
          </p>
        </div>

        {/* Stories List */}
        <div className="space-y-16">
          {JOURNAL_STORIES.map((story, idx) => {
            const title = language === 'ar' ? story.titleAr : story.titleEn;
            const category = language === 'ar' ? story.categoryAr : story.categoryEn;
            const readTime = language === 'ar' ? story.readTimeAr : story.readTimeEn;
            const excerpt = language === 'ar' ? story.excerptAr : story.excerptEn;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={story.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0]">
                    <ImageWithFallback
                      src={story.image}
                      alt={title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                <div className={`lg:col-span-5 space-y-4 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-2 text-xs text-[#242220]/60">
                    <span className="uppercase text-[#511D24] font-medium">{category}</span>
                    <span>·</span>
                    <span>{story.date}</span>
                    <span>·</span>
                    <span>{readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] leading-snug">
                    {title}
                  </h2>

                  <p className="text-sm text-[#242220]/80 font-light leading-relaxed">
                    {excerpt}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#511D24] border-b border-[#511D24] pb-0.5">
                      {t.journal.readStory}
                      {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
