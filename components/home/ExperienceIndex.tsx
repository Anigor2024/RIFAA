'use client';

import Link from 'next/link';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function ExperienceIndex() {
  const { language } = useLanguage();

  const links = [
    { href: '#collections', ar: 'التشكيلات', en: 'Collections' },
    { href: '#new-arrivals', ar: 'وصل حديثاً', en: 'New In' },
    { href: '#curator', ar: 'منسّق الإطلالة', en: 'Style Curator' },
    { href: '#atelier', ar: 'المشغل', en: 'Atelier' },
    { href: '#materials', ar: 'مكتبة الخامات', en: 'Material Library' },
    { href: '#wardrobe', ar: 'خزانتي', en: 'Wardrobe' },
    { href: '#journal', ar: 'المجلة', en: 'Journal' },
  ];

  return (
    <section className="relative z-20 -mt-px border-y border-[#242220]/10 bg-[#FFFDFC]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="hidden shrink-0 items-center gap-2 border-e border-[#242220]/10 pe-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#511D24] md:flex">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{language === 'ar' ? 'استكشف رِفْعة' : 'EXPLORE RIFAA'}</span>
        </div>
        <nav className="flex min-w-max flex-1 items-center justify-center gap-1 sm:gap-2" aria-label={language === 'ar' ? 'فهرس الصفحة الرئيسية' : 'Homepage index'}>
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-2 px-3 py-2 text-[11px] font-semibold tracking-wide text-[#242220]/65 transition-colors hover:text-[#511D24] sm:px-4 sm:text-xs"
            >
              <span className="font-editorial text-[12px] text-[#B59A73]">{String(index + 1).padStart(2, '0')}</span>
              <span>{language === 'ar' ? link.ar : link.en}</span>
            </Link>
          ))}
        </nav>
        <ArrowDown className="hidden h-3.5 w-3.5 shrink-0 text-[#242220]/35 lg:block" />
      </div>
    </section>
  );
}
