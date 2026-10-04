'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Layers3, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ATELIER_EDITS } from '@/data/atelier';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export function AtelierPreview() {
  const { language, isRtl } = useLanguage();

  const previews = ATELIER_EDITS.map((edit) => {
    const product = DEMO_PRODUCTS.find((item) => item.id === edit.productIds[0]);
    return { edit, product };
  }).filter((item) => Boolean(item.product));

  return (
    <section className="bg-[#EDE7DC] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 border-b border-[#242220]/10 pb-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Layers3 className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                {language === 'ar' ? 'مشغل رِفْعة الرقمي' : 'RIFAA DIGITAL ATELIER'}
              </span>
            </div>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-[#111111] sm:text-5xl">
              {language === 'ar'
                ? 'كوّن الإطلالة كمنظومة واحدة، لا كقطع منفصلة.'
                : 'Compose the look as one system, not isolated pieces.'}
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65">
              {language === 'ar'
                ? 'إطلالات منتقاة مع تحكم في اللون والمقاس، مقارنة للخامات والتفصيل، وإضافة المجموعة كاملة للحقيبة أو المفضلة من مكان واحد.'
                : 'Curated edits with color and size control, fabric and tailoring comparison, plus one-step saving or bagging of the full composition.'}
            </p>
            <Link
              href="/atelier"
              className="group mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
            >
              <Sparkles className="h-4 w-4 text-[#511D24]" />
              <span className="border-b border-[#111111]/35 pb-1">
                {language === 'ar' ? 'افتح المشغل الكامل' : 'Open the full atelier'}
              </span>
              {isRtl ? (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {previews.map(({ edit, product }, index) => {
            if (!product) return null;
            const name = language === 'ar' ? product.nameAr : product.nameEn;
            return (
              <Link
                key={edit.id}
                href={'/atelier?edit=' + edit.id}
                className="group relative min-h-[480px] overflow-hidden bg-[#D8D0C4] md:min-h-[560px]"
              >
                <ImageWithFallback
                  src={product.image}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/8 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <span className="font-editorial text-sm text-[#D9D0C4]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold">
                    {language === 'ar' ? edit.titleAr : edit.titleEn}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/55">
                    {language === 'ar' ? edit.subtitleAr : edit.subtitleEn}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
                    <span>{language === 'ar' ? 'نسّق الإطلالة' : 'Compose this edit'}</span>
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
