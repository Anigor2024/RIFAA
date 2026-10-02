'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, User, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { JournalStory } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SaudiMotif } from '@/components/common/SaudiMotif';

interface EditorialDetailClientProps {
  story: JournalStory;
  otherStories: JournalStory[];
}

export function EditorialDetailClient({
  story,
  otherStories,
}: EditorialDetailClientProps) {
  const { language, isRtl, t } = useLanguage();

  const title = language === 'ar' ? story.titleAr : story.titleEn;
  const category = language === 'ar' ? story.categoryAr : story.categoryEn;
  const readTime = language === 'ar' ? story.readTimeAr : story.readTimeEn;
  const author = (language === 'ar' ? story.authorAr : story.authorEn) || (language === 'ar' ? 'فريق رِفْعة التحريري' : 'RIFAA Editorial Desk');
  const paragraphs = (language === 'ar' ? story.paragraphsAr : story.paragraphsEn) || [];
  const excerpt = language === 'ar' ? story.excerptAr : story.excerptEn;

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
            {language === 'ar' ? 'المجلة والتحرير' : 'Editorial'}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-medium truncate max-w-[200px] sm:max-w-xs">
            {title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2.5 text-xs text-[#511D24] font-medium tracking-widest uppercase">
            <span>{category}</span>
            <span>·</span>
            <span className="text-[#242220]/60 normal-case tracking-normal">{readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111111] leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-[#242220]/80 font-light leading-relaxed pt-2">
            {excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#242220]/60 pt-4 border-t border-[#242220]/10">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#511D24]" />
              {author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#511D24]" />
              {story.date}
            </span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#E2DBD0] mb-12 shadow-xs">
          <ImageWithFallback
            src={story.image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Story Body */}
        <div className="space-y-6 text-[#242220]/90 text-base sm:text-lg leading-relaxed font-light mb-16">
          {paragraphs.map((para, i) => (
            <p key={i} className="leading-loose">
              {para}
            </p>
          ))}
        </div>

        {/* Divider Motif */}
        <div className="py-8 flex justify-center">
          <SaudiMotif className="w-8 h-8 text-[#511D24]/40" />
        </div>

        {/* Other Stories */}
        {otherStories.length > 0 && (
          <section className="pt-12 border-t border-[#242220]/10">
            <h2 className="text-xl font-bold text-[#111111] mb-6">
              {language === 'ar' ? 'مقالات أخرى من المجلة' : 'More Stories from The Journal'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherStories.map((other) => {
                const otherTitle = language === 'ar' ? other.titleAr : other.titleEn;
                const otherCategory = language === 'ar' ? other.categoryAr : other.categoryEn;
                return (
                  <Link
                    key={other.id}
                    href={`/editorial/${other.slug}`}
                    className="group block p-4 bg-[#FFFDFC] border border-[#242220]/10 hover:border-[#511D24] transition-colors"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[#511D24] font-medium block mb-1">
                      {otherCategory}
                    </span>
                    <h3 className="text-base font-semibold text-[#111111] group-hover:text-[#511D24] transition-colors line-clamp-2">
                      {otherTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#511D24] hover:text-[#111111] transition-colors"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{language === 'ar' ? 'العودة إلى المجلة' : 'Back to All Stories'}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
