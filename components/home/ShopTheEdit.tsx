'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MEDIA_MANIFEST } from '@/data/media';

export function ShopTheEdit() {
  const { language, isRtl } = useLanguage();

  const stories = [
    {
      media: MEDIA_MANIFEST.editorialModernWardrobe,
      index: '01',
      ar: 'خزانة معاصرة',
      en: 'Modern Wardrobe',
    },
    {
      media: MEDIA_MANIFEST.editorialLayering,
      index: '02',
      ar: 'ذكاء الطبقات',
      en: 'Layering Intelligence',
    },
    {
      media: MEDIA_MANIFEST.editorialEidReflections,
      index: '03',
      ar: 'انعكاسات العيد',
      en: 'Eid Reflections',
    },
  ];

  return (
    <section className="overflow-hidden bg-[#181715] py-20 text-[#FAF8F5] md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#B59A73]">
              <BookOpenText className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                {language === 'ar' ? 'تحرير رِفْعة · العدد الجديد' : 'THE RIFAA EDIT · NEW ISSUE'}
              </span>
            </div>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'المدينة، الخامة، والضوء — بثلاثة فصول بصرية.'
                : 'City, textile and light — told in three visual chapters.'}
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-sm font-light leading-7 text-white/62">
              {language === 'ar'
                ? 'أعدنا بناء هذا الفصل التحريري بالكامل ليصبح أقرب إلى مجلة أزياء رقمية: لقطات متباينة، قصص خامات، ومسارات مباشرة نحو القطع والتنسيقات.'
                : 'Rebuilt as a digital fashion editorial: contrasting imagery, material stories and direct paths into the pieces and styling experiences.'}
            </p>
            <Link
              href="/editorial"
              className="group mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
            >
              <span className="border-b border-white/35 pb-1">
                {language === 'ar' ? 'افتح المجلة كاملة' : 'Open the full journal'}
              </span>
              {isRtl ? (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[340px_340px]">
          <article className="group relative min-h-[560px] overflow-hidden border border-white/10 bg-[#272522] sm:min-h-[660px] lg:col-span-7 lg:row-span-2 lg:min-h-0">
            <ImageWithFallback
              src={stories[0].media.src}
              alt={language === 'ar' ? stories[0].media.altAr : stories[0].media.altEn}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <span className="font-editorial text-sm text-[#B59A73]">{stories[0].index}</span>
                  <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {language === 'ar' ? stories[0].ar : stories[0].en}
                  </h3>
                  <p className="mt-2 max-w-lg text-xs leading-6 text-white/65">
                    {language === 'ar'
                      ? 'نسب هادئة، طبقات محسوبة، واختيارات يمكن أن تنتقل من النهار إلى المساء دون تغيير هوية الإطلالة.'
                      : 'Quiet proportions, considered layers and pieces designed to move from day into evening without losing identity.'}
                  </p>
                </div>
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center border border-white/25 bg-black/20 backdrop-blur-sm sm:flex">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </article>

          <article className="group relative min-h-[360px] overflow-hidden border border-white/10 bg-[#272522] sm:min-h-[420px] lg:col-span-5 lg:min-h-0">
            <ImageWithFallback
              src={stories[1].media.src}
              alt={language === 'ar' ? stories[1].media.altAr : stories[1].media.altEn}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/10" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <span className="font-editorial text-sm text-[#B59A73]">{stories[1].index}</span>
                <h3 className="mt-1 text-xl font-bold">
                  {language === 'ar' ? stories[1].ar : stories[1].en}
                </h3>
              </div>
              <ScanSearch className="h-4 w-4 text-white/65" />
            </div>
          </article>

          <article className="group relative min-h-[360px] overflow-hidden border border-white/10 bg-[#272522] sm:min-h-[420px] lg:col-span-5 lg:min-h-0">
            <ImageWithFallback
              src={stories[2].media.src}
              alt={language === 'ar' ? stories[2].media.altAr : stories[2].media.altEn}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="font-editorial text-sm text-[#B59A73]">{stories[2].index}</span>
              <h3 className="mt-1 text-xl font-bold">
                {language === 'ar' ? stories[2].ar : stories[2].en}
              </h3>
              <Link
                href="/discover"
                className="group/link mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 hover:text-white"
              >
                <span>{language === 'ar' ? 'حوّل الإلهام إلى اختيار' : 'Turn inspiration into an edit'}</span>
                {isRtl ? (
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                )}
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            {
              ar: 'سرد بصري متجدد',
              en: 'Evolving visual narratives',
              subAr: 'صور مختلفة عن القسم السابق بالكامل',
              subEn: 'A completely refreshed visual chapter',
            },
            {
              ar: 'الخامة في المقدمة',
              en: 'Material-first storytelling',
              subAr: 'التفاصيل والعناية مرتبطة بالمنتج',
              subEn: 'Detail and care connect back to product',
            },
            {
              ar: 'من الإلهام إلى الشراء',
              en: 'Inspiration to action',
              subAr: 'مسارات واضحة للتنسيق والمجلة والمنتجات',
              subEn: 'Clear routes into styling, journal and product',
            },
          ].map((item) => (
            <div key={item.en} className="bg-[#181715] p-5">
              <span className="text-xs font-semibold text-white">
                {language === 'ar' ? item.ar : item.en}
              </span>
              <span className="mt-1 block text-[10px] leading-5 text-white/40">
                {language === 'ar' ? item.subAr : item.subEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
