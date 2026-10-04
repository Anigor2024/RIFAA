'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ScanSearch, Wind } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { DEMO_PRODUCTS } from '@/data/products';

const materialIds = ['w-02', 'm-02', 'k-11'];

export function MaterialLibrary() {
  const { language, isRtl } = useLanguage();
  const products = materialIds
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product));

  const climateNotes: Record<string, { ar: string; en: string }> = {
    'w-02': { ar: 'ملائم للأيام الدافئة والطبقات الخفيفة', en: 'Optimized for warm days and light layering' },
    'm-02': { ar: 'تنفّس مرتفع مع حضور رسمي هادئ', en: 'High breathability with quiet formal presence' },
    'k-11': { ar: 'ملمس لطيف ومرونة مريحة للحركة', en: 'Soft hand-feel with easy movement' },
  };

  return (
    <section className="overflow-hidden bg-[#161514] py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 border-b border-white/12 pb-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B59A73]">
              {language === 'ar' ? 'مكتبة الخامات' : 'MATERIAL INTELLIGENCE'}
            </span>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {language === 'ar' ? 'اختر القطعة من ملمسها وأدائها، لا من شكلها فقط.' : 'Choose by touch and performance, not appearance alone.'}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-white/60 lg:justify-self-end">
            {language === 'ar'
              ? 'قراءة مبسطة للخامة، الإحساس على الجسم، العناية، ومدى ملاءمتها لإيقاع المملكة — مع فحص بصري عميق حتى 9× داخل صفحات المنتجات.'
              : 'A concise read on fabrication, feel, care and Saudi-climate suitability — paired with up to 9× deep visual inspection on product pages.'}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {products.map((product, index) => {
            const name = language === 'ar' ? product.nameAr : product.nameEn;
            const fabric = language === 'ar' ? product.fabricAr : product.fabricEn;
            const care = language === 'ar' ? product.careAr : product.careEn;
            const note = climateNotes[product.id];

            return (
              <article key={product.id} className="group border border-white/12 bg-white/[0.035] p-3 transition-colors hover:bg-white/[0.06]">
                <Link href={'/products/' + product.slug} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#2B2926]">
                    <ImageWithFallback
                      src={product.image}
                      alt={name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <div>
                        <span className="font-editorial text-xs tracking-[0.2em] text-[#D9D0C4]">0{index + 1}</span>
                        <h3 className="mt-1 text-lg font-bold leading-snug text-white">{name}</h3>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/25 bg-black/25 backdrop-blur-sm">
                        <ScanSearch className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="space-y-4 px-2 pb-3 pt-5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                      {language === 'ar' ? 'تركيبة الخامة' : 'FABRICATION'}
                    </span>
                    <p className="mt-1.5 text-xs leading-6 text-white/70">{fabric}</p>
                  </div>
                  <div className="flex items-start gap-2 border-t border-white/10 pt-4">
                    <Wind className="mt-0.5 h-4 w-4 shrink-0 text-[#B59A73]" />
                    <p className="text-xs leading-5 text-white/60">{language === 'ar' ? note?.ar : note?.en}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      {language === 'ar' ? 'العناية' : 'CARE'}
                    </span>
                    <p className="mt-1 text-[11px] leading-5 text-white/55">{care}</p>
                  </div>
                  <Link
                    href={'/products/' + product.slug}
                    className="group/link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white"
                  >
                    <span className="border-b border-white/40 pb-0.5">
                      {language === 'ar' ? 'افحص النسيج بدقة' : 'Inspect the textile'}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-1" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    )}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
