'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { JOURNAL_STORIES } from '@/data/stories';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function JournalSection() {
  const { language, isRtl, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-[#FFFDFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#242220]/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#511D24] font-medium block mb-1">
              {t.journal.label}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111111]">
              {t.journal.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#242220]/70 max-w-md font-light leading-relaxed">
            {t.journal.subtitle}
          </p>
        </div>

        {/* 3 Magazine-Style Editorial Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {JOURNAL_STORIES.map((story) => {
            const title = language === 'ar' ? story.titleAr : story.titleEn;
            const category = language === 'ar' ? story.categoryAr : story.categoryEn;
            const readTime = language === 'ar' ? story.readTimeAr : story.readTimeEn;
            const excerpt = language === 'ar' ? story.excerptAr : story.excerptEn;

            return (
              <article key={story.id} className="group flex flex-col space-y-4">
                {/* Large Editorial Photo */}
                <Link
                  href="/editorial"
                  className="relative aspect-[16/11] overflow-hidden bg-[#E8E2D7] block"
                >
                  <ImageWithFallback
                    src={story.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center gap-2 text-xs text-[#242220]/50 tracking-wider">
                  <span className="uppercase text-[#511D24] font-medium">{category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{readTime}</span>
                </div>

                {/* Story Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#511D24] transition-colors leading-snug">
                  <Link href="/editorial">{title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-[#242220]/75 font-light leading-relaxed line-clamp-2">
                  {excerpt}
                </p>

                {/* Editorial Read Link */}
                <div className="pt-2">
                  <Link
                    href="/editorial"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#511D24] transition-colors group/link"
                  >
                    <span className="border-b border-[#111111] group-hover/link:border-[#511D24] pb-0.5">
                      {t.journal.readStory}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    )}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
