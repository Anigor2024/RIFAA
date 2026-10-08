'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { language, isRtl, toggleLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#191817] text-[#FAF8F5] pt-16 pb-12 border-t border-[#242220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Editorial Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#FAF8F5]/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold tracking-tight text-white">
                {t.brandName}
              </span>
              <span className="font-editorial text-lg tracking-[0.25em] text-[#B59A73]">
                RIFAA
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#A79C90]">
              {t.brandSentiment}
            </p>
            <p className="text-sm text-[#FAF8F5]/70 font-light leading-relaxed max-w-md pt-2">
              {t.brandDescription}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-[#A79C90]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B59A73]" />
                {t.actions.country}
              </span>
              <span>·</span>
              <span>{t.actions.currency}</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            {/* Shop Column */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white tracking-wider uppercase text-xs">
                {t.footer.shopHeading}
              </h3>
              <ul className="space-y-2.5 text-[#FAF8F5]/70 font-light">
                <li>
                  <Link href="/women" className="hover:text-white transition-colors">
                    {t.footer.links.women}
                  </Link>
                </li>
                <li>
                  <Link href="/men" className="hover:text-white transition-colors">
                    {t.footer.links.men}
                  </Link>
                </li>
                <li>
                  <Link href="/kids" className="hover:text-white transition-colors">
                    {t.footer.links.kids}
                  </Link>
                </li>
                <li>
                  <Link href="/new" className="hover:text-white transition-colors">
                    {t.footer.links.newIn}
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-white transition-colors">
                    {t.footer.links.collections}
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'استوديو رِفْعة' : 'RIFAA Studio'}
                  </Link>
                </li>
                <li>
                  <Link href="/gifts" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'مشغل الهدايا' : 'Gift Atelier'}
                  </Link>
                </li>
                <li>
                  <Link href="/concierge" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'كونسيرج رِفْعة' : 'RIFAA Concierge'}
                  </Link>
                </li>
                <li>
                  <Link href="/passport" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'جواز الأسلوب' : 'Style Passport'}
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'منسّق رِفْعة' : 'RIFAA Curator'}
                  </Link>
                </li>
                <li>
                  <Link href="/atelier" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'مشغل رِفْعة' : 'RIFAA Atelier'}
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'استوديو المقارنة' : 'Compare Studio'}
                  </Link>
                </li>
                <li>
                  <Link href="/capsule" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'استوديو الكابسولة' : 'Capsule Studio'}
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-[#B59A73] transition-colors">
                    {t.footer.links.eidEdit}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white tracking-wider uppercase text-xs">
                {t.footer.careHeading}
              </h3>
              <ul className="space-y-2.5 text-[#FAF8F5]/70 font-light">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t.footer.links.contact}
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-white transition-colors">
                    {t.footer.links.deliveryInfo}
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="hover:text-white transition-colors">
                    {t.footer.links.returnsPolicy}
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-white transition-colors">
                    {t.footer.links.sizeGuide}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    {t.footer.links.faq}
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white transition-colors">
                    {language === 'ar' ? 'مساحة العميل' : 'Client Space'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* About RIFAA */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white tracking-wider uppercase text-xs">
                {t.footer.aboutHeading}
              </h3>
              <ul className="space-y-2.5 text-[#FAF8F5]/70 font-light">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t.footer.links.ourStory}
                  </Link>
                </li>
                <li>
                  <Link href="/editorial" className="hover:text-white transition-colors">
                    {t.footer.links.journal}
                  </Link>
                </li>
                <li>
                  <Link href="/stores" className="hover:text-white transition-colors">
                    {t.footer.links.stores}
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className="hover:text-white transition-colors">
                    {t.footer.links.sustainability}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    {t.footer.links.careers}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/50">
          <div className="flex flex-wrap items-center gap-4">
            <span>{t.footer.copyright}</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t.footer.links.privacy}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t.footer.links.terms}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs text-[#FAF8F5]/80 hover:text-white transition-colors cursor-pointer py-1 px-2 border border-[#FAF8F5]/20"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
            </button>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-2 border border-[#FAF8F5]/20 hover:border-white text-[#FAF8F5]/70 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
