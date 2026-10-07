'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { MegaNavConfig } from '@/data/navigation';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';

export function MegaMenu({
  config,
  onNavigate,
}: {
  config: MegaNavConfig;
  onNavigate: () => void;
}) {
  const { language, isRtl } = useLanguage();
  const featuredProduct = config.featuredProductId
    ? DEMO_PRODUCTS.find((product) => product.id === config.featuredProductId)
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden border border-[#242220]/10 bg-[#F7F4EF] shadow-[0_24px_70px_rgba(17,17,17,0.18)] lg:grid-cols-[0.9fr_1.35fr_0.75fr]">
        <div className="flex flex-col justify-between border-b border-[#242220]/10 p-6 lg:border-b-0 lg:border-e lg:p-7">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                {language === 'ar' ? config.eyebrowAr : config.eyebrowEn}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#111111]">
              {language === 'ar' ? config.labelAr : config.labelEn}
            </h2>
            <p className="mt-3 max-w-sm text-xs font-light leading-6 text-[#242220]/60">
              {language === 'ar' ? config.descriptionAr : config.descriptionEn}
            </p>
          </div>

          <Link
            href={config.href}
            onClick={onNavigate}
            className="group mt-7 inline-flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111]"
          >
            <span className="border-b border-[#111111]/35 pb-1">
              {language === 'ar' ? config.ctaAr : config.ctaEn}
            </span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>

        <div className="grid gap-7 p-6 sm:grid-cols-2 lg:p-7">
          {config.groups.map((group) => (
            <div key={group.titleEn}>
              <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#B59A73]">
                {language === 'ar' ? group.titleAr : group.titleEn}
              </span>
              <div className="mt-4 space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href + item.en}
                    href={item.href}
                    onClick={onNavigate}
                    className="group/link flex items-center justify-between gap-4 border-b border-[#242220]/[0.055] py-2.5 last:border-b-0"
                  >
                    <div>
                      <span className="block text-[13px] font-semibold text-[#111111] transition-colors group-hover/link:text-[#511D24]">
                        {language === 'ar' ? item.ar : item.en}
                      </span>
                      {(item.noteAr || item.noteEn) && (
                        <span className="mt-0.5 block text-[10px] text-[#242220]/42">
                          {language === 'ar' ? item.noteAr : item.noteEn}
                        </span>
                      )}
                    </div>
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-[#242220]/25 transition-all group-hover/link:-translate-x-1 group-hover/link:text-[#511D24]" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#242220]/25 transition-all group-hover/link:translate-x-1 group-hover/link:text-[#511D24]" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {featuredProduct && (
          <Link
            href={'/products/' + featuredProduct.slug}
            onClick={onNavigate}
            className="group relative hidden min-h-[300px] overflow-hidden bg-[#D9D0C4] lg:block"
          >
            <ImageWithFallback
              src={featuredProduct.image}
              alt={language === 'ar' ? featuredProduct.nameAr : featuredProduct.nameEn}
              fill
              sizes="280px"
              className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#D9D0C4]">
                {language === 'ar' ? 'اختيار رِفْعة' : 'RIFAA FEATURE'}
              </span>
              <h3 className="mt-1 text-sm font-bold leading-5">
                {language === 'ar' ? featuredProduct.nameAr : featuredProduct.nameEn}
              </h3>
              <span className="mt-2 block text-[10px] text-white/60">
                {formatPrice(featuredProduct.price, language)}
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
