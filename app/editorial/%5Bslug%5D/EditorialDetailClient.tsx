'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { JournalStory } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

interface EditorialDetailClientProps {
  story: JournalStory;
  otherStories: JournalStory[];
}

export function EditorialDetailClient({ story, otherStories }: EditorialDetailClientProps) {
  const { language, isRtl } = useLanguage();

  const title = language === 'ar' ? story.titleAr : story.titleEn;
  const category = language === 'ar' ? story.categoryAr : story.categoryEn;
  const readTime = language === 'ar' ? story.readTimeAr : story.readTimeEn;
  const author = language === 'ar' ? (story.authorAr || 'دار رِفْعة') : (story.authorEn || 'RIFAA Editorial');
  const paragraphs = language === 'ar' ? (story.paragraphsAr || [story.excerptAr]) : (story.paragraphsEn || [story.excerptEn]);

  return (
    <article className="pt-24 sm:pt-28 pb-20 bg-[#F7F4EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#242220]/50 mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/editorial" className="hover:text-[#111111] transition-colors">
            {language === 'ar' ? 'المجلة والتحرير' : 'Journal'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#242220]/60">
            <span className="uppercase text-[#511D24] font-semibold tracking-wider">{category}</span>
            <span>·</span>
            <span>{story.date}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] leading-tight">
            {title}
          </h1>

          <div className="pt-2 flex items-center gap-3 text-xs text-[#242220]/70 border-b border-[#242220]/10 pb-6">
            <span>{language === 'ar' ? 'بقلم:' : 'By:'}</span>
            <span className="font-semibold text-[#111111]">{author}</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0] shadow-sm mb-12">
          <ImageWithFallback
            src={story.image}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-center"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-neutral max-w-none text-[#242220]/85 text-base sm:text-lg leading-relaxed font-light space-y-6">
          {paragraphs.map((p, idx) => (
            <p key={idx} className={idx === 0 ? 'text-lg sm:text-xl font-normal leading-relaxed text-[#111111]' : ''}>
              {p}
            </p>
          ))}
        </div>

        {/* Saudi Architectural Divider */}
        <div className="my-16">
          <SaudiMotif />
        </div>

        {/* More Stories */}
        {otherStories.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[#242220]/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                {language === 'ar' ? 'مقالات وقراءات أخرى' : 'Further Readings'}
              </h2>
              <Link
                href="/editorial"
                className="text-xs font-semibold tracking-wider uppercase text-[#511D24] hover:underline"
              >
                {language === 'ar' ? 'كافة المنشورات' : 'View All'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherStories.map((other) => {
                const otherTitle = language === 'ar' ? other.titleAr : other.titleEn;
                const otherCategory = language === 'ar' ? other.categoryAr : other.categoryEn;

                return (
                  <Link
                    key={other.id}
                    href={`/editorial/${other.slug}`}
                    className="group block space-y-3 bg-white/60 p-4 border border-[#242220]/10 hover:border-[#111111] transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0]">
                      <ImageWithFallback
                        src={other.image}
                        alt={otherTitle}
                        fill
                        className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#511D24] font-semibold block">
                      {otherCategory}
                    </span>
                    <h3 className="font-bold text-[#111111] group-hover:text-[#511D24] transition-colors leading-snug">
                      {otherTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="pt-12 text-center">
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#111111] hover:bg-[#511D24] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{language === 'ar' ? 'العودة إلى المجلة' : 'Back to Journal'}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
