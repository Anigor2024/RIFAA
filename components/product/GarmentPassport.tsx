'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Palette,
  Ruler,
  ScanText,
  Shirt,
  Sparkles,
  WashingMachine,
} from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export function GarmentPassport({ product }: { product: Product }) {
  const { language, isRtl } = useLanguage();

  const rows = [
    {
      icon: Shirt,
      ar: 'الخامة',
      en: 'Fabric',
      value: language === 'ar' ? product.fabricAr : product.fabricEn,
    },
    {
      icon: ScanText,
      ar: 'التفصيل',
      en: 'Tailoring',
      value: language === 'ar' ? product.tailoringAr : product.tailoringEn,
    },
    {
      icon: Ruler,
      ar: 'القصّة',
      en: 'Fit',
      value: language === 'ar' ? product.fitAr : product.fitEn,
    },
    {
      icon: WashingMachine,
      ar: 'العناية',
      en: 'Care',
      value: language === 'ar' ? product.careAr : product.careEn,
    },
  ].filter((row) => Boolean(row.value));

  return (
    <section className="overflow-hidden border border-[#242220]/10 bg-[#FFFDFC]">
      <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
        <div className="bg-[#171615] p-6 text-white sm:p-8">
          <div className="flex items-center gap-2 text-[#B59A73]">
            <BadgeCheck className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">
              {language === 'ar' ? 'جواز القطعة الرقمي' : 'DIGITAL GARMENT PASSPORT'}
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-[1.08]">
            {language === 'ar'
              ? 'كل ما تحتاج معرفته قبل أن تصبح القطعة جزءاً من خزانتك.'
              : 'Everything worth knowing before the piece enters your wardrobe.'}
          </h2>

          <p className="mt-4 text-xs font-light leading-6 text-white/58">
            {language === 'ar'
              ? 'يعرض هذا الجواز بيانات القطعة الموجودة داخل رِفْعة فقط: الخامة، التفصيل، القصّة، العناية، الألوان والمقاسات — بدون ادعاءات خارج سجل المنتج.'
              : 'This passport surfaces only the product data already held by RIFAA: fabrication, tailoring, fit, care, colors and sizes — without external claims.'}
          </p>

          <div className="mt-7 border-t border-white/12 pt-5">
            <span className="text-[9px] uppercase tracking-[0.15em] text-white/38">
              {language === 'ar' ? 'التشكيلة' : 'COLLECTION'}
            </span>
            <span className="mt-1 block text-sm font-semibold text-white">{product.collection}</span>

            {(language === 'ar' ? product.originAr : product.originEn) && (
              <>
                <span className="mt-5 block text-[9px] uppercase tracking-[0.15em] text-white/38">
                  {language === 'ar' ? 'الحرفة / المنشأ' : 'CRAFT / ORIGIN'}
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/62">
                  {language === 'ar' ? product.originAr : product.originEn}
                </span>
              </>
            )}
          </div>

          <Link
            href={'/pairing?anchor=' + product.id}
            className="group mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
          >
            <Sparkles className="h-4 w-4 text-[#B59A73]" />
            <span className="border-b border-white/30 pb-1">
              {language === 'ar' ? 'ابنِ إطلالة حول هذه القطعة' : 'Build around this piece'}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-2">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.en} className="bg-[#F7F4EF] p-5">
                  <Icon className="h-4 w-4 text-[#511D24]" />
                  <span className="mt-3 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#242220]/42">
                    {language === 'ar' ? row.ar : row.en}
                  </span>
                  <p className="mt-2 text-xs font-light leading-6 text-[#242220]/68">
                    {row.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <Palette className="h-4 w-4" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">
                  {language === 'ar' ? 'الألوان المتاحة' : 'AVAILABLE COLORS'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color.nameEn}
                    className="inline-flex items-center gap-2 border border-[#242220]/10 bg-white px-2.5 py-2"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] text-[#242220]/65">
                      {language === 'ar' ? color.nameAr : color.nameEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#511D24]">
                {language === 'ar' ? 'المقاسات المتاحة' : 'AVAILABLE SIZES'}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="min-w-9 border border-[#242220]/10 bg-white px-2.5 py-2 text-center text-[10px] font-semibold text-[#111111]"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
