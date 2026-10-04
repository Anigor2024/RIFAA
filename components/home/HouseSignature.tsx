'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, MoveUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function HouseSignature() {
  const { language, isRtl } = useLanguage();
  const media = MEDIA_MANIFEST.shopTheLookEnsemble;

  const facts = [
    { value: '36', ar: 'قطعة موثقة محلياً', en: 'locally curated pieces' },
    { value: '03', ar: 'أقسام مترابطة', en: 'connected departments' },
    { value: '9×', ar: 'فحص بصري للنسيج', en: 'textile inspection' },
    { value: '2', ar: 'لغتان · RTL / LTR', en: 'languages · RTL / LTR' },
  ];

  return (
    <section className="bg-[#F7F4EF] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[680px] overflow-hidden bg-[#1C1A18] lg:min-h-[760px]">
          <ImageWithFallback
            src={media.src}
            alt={language === 'ar' ? media.altAr : media.altEn}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

          <div className="relative z-10 flex min-h-[680px] flex-col justify-between p-6 text-white sm:p-10 lg:min-h-[760px] lg:p-14">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9D0C4]">
                {language === 'ar' ? 'توقيع الدار الرقمي' : 'THE DIGITAL HOUSE SIGNATURE'}
              </span>
              <MoveUpRight className="h-5 w-5 text-white/50" />
            </div>

            <div className="max-w-2xl">
              <span className="font-editorial text-sm uppercase tracking-[0.22em] text-[#B59A73]">
                {language === 'ar' ? 'تفاصيل صغيرة. أثر كبير.' : 'SMALL DETAILS. LARGE EFFECT.'}
              </span>
              <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
                {language === 'ar'
                  ? 'تجربة تبدو كدار أزياء، وتعمل كمنتج رقمي متكامل.'
                  : 'An experience that feels like a fashion house and behaves like a digital product.'}
              </h2>
              <p className="mt-5 max-w-xl text-sm font-light leading-7 text-white/72 sm:text-base">
                {language === 'ar'
                  ? 'بحث ذكي، حسابات سحابية، مفضلة متزامنة، تكبير نسيج عميق، إتمام طلب دقيق، ومحتوى تحريري — في نظام بصري واحد متماسك.'
                  : 'Intelligent discovery, cloud accounts, synced wishlist, deep textile zoom, precise checkout and editorial storytelling — inside one coherent visual system.'}
              </p>

              <Link
                href="/discover"
                className="group mt-7 inline-flex items-center gap-2.5 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#111111] transition-colors hover:bg-[#F7F4EF]"
              >
                <span>{language === 'ar' ? 'جرّب منسّق رِفْعة' : 'Try the RIFAA Curator'}</span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-px border border-white/15 bg-white/15 md:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.en} className="bg-black/40 p-4 backdrop-blur-md sm:p-5">
                  <span className="font-editorial text-2xl font-semibold text-white sm:text-3xl">{fact.value}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-white/50">
                    {language === 'ar' ? fact.ar : fact.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
