'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, ArrowLeft, Globe, UserRound } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { language, isRtl, toggleLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const links = [
    { href: '/women', labelAr: 'النساء', labelEn: 'Women', subAr: 'عبايات، تفصيل، فساتين', subEn: 'Abayas, Tailoring, Silhouettes' },
    { href: '/men', labelAr: 'الرجال', labelEn: 'Men', subAr: 'أوفرشيرت، كتان، تفصيل', subEn: 'Overshirts, Linen, Tailoring' },
    { href: '/kids', labelAr: 'الأطفال', labelEn: 'Kids', subAr: 'قطن عضوي، أطقم، مناسبات', subEn: 'Organic Sets, Occasions' },
    { href: '/new', labelAr: 'وصل حديثاً', labelEn: 'New In', subAr: 'أحدث القطع لهذا الأسبوع', subEn: 'Curated weekly arrivals' },
    { href: '/collections', labelAr: 'التشكيلات', labelEn: 'Collections', subAr: 'تحرير العيد، أساسيات رِفْعة', subEn: 'The Eid Edit, Essentials' },
    { href: '/discover', labelAr: 'منسّق رِفْعة', labelEn: 'RIFAA Curator', subAr: 'اختيارات ذكية حسب المناسبة والخامة', subEn: 'Intelligent edits by moment and material' },
    { href: '/atelier', labelAr: 'مشغل رِفْعة', labelEn: 'RIFAA Atelier', subAr: 'كوّن الإطلالة وقارن الخامات', subEn: 'Compose looks and compare materials' },
    { href: '/compare', labelAr: 'استوديو المقارنة', labelEn: 'Compare Studio', subAr: 'قارن الخامات والتفصيل والسعر', subEn: 'Compare fabric, tailoring and price' },
    { href: '/capsule', labelAr: 'استوديو الكابسولة', labelEn: 'Capsule Studio', subAr: 'خمس قطع بوظائف وألوان متناسقة', subEn: 'Five-role wardrobe capsules by moment and palette' },
    { href: '/editorial', labelAr: 'الإطلالات', labelEn: 'Editorial', subAr: 'بعد الغروب، إطلالات منسقة', subEn: 'City After Sunset Looks' },
    { href: '/sale', labelAr: 'التخفيضات', labelEn: 'Sale', subAr: 'قطع مختارة بعناية', subEn: 'Archival seasonal reductions' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111111]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} w-full max-w-sm bg-[#F7F4EF] shadow-2xl flex flex-col justify-between`}>
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#242220]/10 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold tracking-tight text-[#111111]">{t.brandName}</span>
              <span className="font-editorial text-lg font-semibold tracking-[0.2em] text-[#511D24]">RIFAA</span>
            </div>
            <span className="text-[10px] tracking-widest text-[#242220]/60 uppercase">
              {t.brandSentiment}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={t.actions.close}
            className="p-2 text-[#242220]/70 hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#242220]/05">
          {links.map((link) => {
            const title = language === 'ar' ? link.labelAr : link.labelEn;
            const subtitle = language === 'ar' ? link.subAr : link.subEn;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="py-4 flex items-center justify-between group"
              >
                <div>
                  <span className="text-lg font-medium text-[#111111] group-hover:text-[#511D24] transition-colors block">
                    {title}
                  </span>
                  <span className="text-xs text-[#242220]/50 block mt-0.5">
                    {subtitle}
                  </span>
                </div>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 text-[#242220]/30 group-hover:text-[#511D24] group-hover:-translate-x-1 transition-all" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#242220]/30 group-hover:text-[#511D24] group-hover:translate-x-1 transition-all" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="px-6 pb-2">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center justify-between border border-[#242220]/10 bg-[#FFFDFC] px-4 py-3.5 text-sm font-semibold text-[#111111]"
          >
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-[#511D24]" />
              <span>{language === 'ar' ? 'مساحة العميل' : 'Client Space'}</span>
            </span>
            {isRtl ? <ArrowLeft className="h-4 w-4 text-[#242220]/40" /> : <ArrowRight className="h-4 w-4 text-[#242220]/40" />}
          </Link>
        </div>

        {/* Bottom Panel & Language Selector */}
        <div className="p-6 border-t border-[#242220]/10 bg-[#FFFDFC]/80 space-y-4">
          {/* Language Switcher */}
          <div className="flex items-center justify-between py-2 border-b border-[#242220]/08">
            <span className="text-xs text-[#242220]/70 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'اللغة' : 'Language'}</span>
            </span>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-[#111111] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#511D24] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}
            </button>
          </div>

          {/* Quick Info */}
          <div className="flex justify-between items-center text-xs text-[#242220]/60 pt-1">
            <span>{t.actions.country}</span>
            <span>{t.actions.sar}</span>
          </div>

          <p className="text-[11px] text-[#242220]/50 text-center">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}
