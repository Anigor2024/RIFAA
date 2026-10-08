'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

const featuredIds = ['w-03', 'm-05', 'k-07'];

export function GiftAtelierPreview() {
  const { language, isRtl } = useLanguage();
  const items = featuredIds
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product));

  return (
    <section className="bg-[#E8E0D5] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden border border-[#242220]/10 bg-[#1A1917] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between p-7 text-white sm:p-10 lg:p-12">
            <div>
              <div className="flex items-center gap-2 text-[#B59A73]">
                <Gift className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-[0.23em]">
                  {language === 'ar' ? 'مشغل هدايا رِفْعة' : 'RIFAA GIFT ATELIER'}
                </span>
              </div>
              <h2 className="mt-6 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
                {language === 'ar' ? 'الهدية الأجمل تبدأ بفهم صاحبها.' : 'The finest gift begins with the person.'}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
                {language === 'ar'
                  ? 'رحلة من أربعة اختيارات: لمن الهدية؟ ما المناسبة؟ ما أسلوبها؟ وما ميزانيتك؟ ثم مختارات حقيقية من رِفْعة مع تفسير سبب الترشيح.'
                  : 'Four thoughtful choices — recipient, occasion, mood and budget — followed by real pieces from RIFAA, with reasons behind every edit.'}
              </p>
            </div>
            <div className="mt-9">
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  language === 'ar' ? 'المناسبة' : 'Occasion',
                  language === 'ar' ? 'الميزانية' : 'Budget',
                  language === 'ar' ? 'الأسلوب' : 'Mood',
                ].map((label) => (
                  <span key={label} className="border border-white/20 px-3 py-2 text-[10px] font-semibold text-white/70">
                    {label}
                  </span>
                ))}
              </div>
              <Link href="/gifts"
                className="group inline-flex min-h-12 items-center gap-3 bg-white px-6 text-xs font-bold text-[#111111] transition-colors hover:bg-[#E8E0D5]"
              >
                <Sparkles className="h-4 w-4 text-[#511D24]" />
                {language === 'ar' ? 'ابدأ اختيار الهدية' : 'Find the perfect gift'}
                {isRtl ? <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> :
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Link>
            </div>
          </div>
          <div className="grid min-h-[440px] grid-cols-3 gap-1 bg-[#2B2825] p-1 sm:min-h-[590px]">
            {items.map((product, index) => (
              <Link key={product.id} href={'/products/' + product.slug}
                className={'group relative overflow-hidden bg-[#D0C5B5] ' + (index === 1 ? 'mt-8 mb-8' : 'my-0')}
              >
                <ImageWithFallback src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.nameEn}
                  fill sizes="(max-width: 1024px) 33vw, 18vw"
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                  <span className="font-editorial text-xs text-[#D9D0C4]">0{index + 1}</span>
                  <span className="mt-1 block text-[10px] font-bold leading-4 sm:text-sm">
                    {language === 'ar' ? product.nameAr : product.nameEn}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
