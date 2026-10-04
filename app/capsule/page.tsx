'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Grid2X2,
  Heart,
  Layers3,
  Share2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';
import {
  CapsuleAudience,
  CapsuleMoment,
  CapsulePalette,
  getCapsule,
  getCapsuleMetrics,
} from '@/lib/capsule';

function isAudience(value: string | null): value is CapsuleAudience {
  return value === 'women' || value === 'men' || value === 'boys' || value === 'girls';
}

function isMoment(value: string | null): value is CapsuleMoment {
  return value === 'daily' || value === 'work' || value === 'evening' || value === 'eid' || value === 'travel';
}

function isPalette(value: string | null): value is CapsulePalette {
  return value === 'neutral' || value === 'warm' || value === 'deep';
}

export default function CapsulePage() {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addManyToBag } = useBag();
  const { addManyToWishlist, wishlistIds } = useWishlist();

  const audienceParam = searchParams.get('audience');
  const momentParam = searchParams.get('moment');
  const paletteParam = searchParams.get('palette');

  const [audience, setAudience] = useState<CapsuleAudience>(
    isAudience(audienceParam) ? audienceParam : 'women'
  );
  const [moment, setMoment] = useState<CapsuleMoment>(
    isMoment(momentParam) ? momentParam : 'daily'
  );
  const [palette, setPalette] = useState<CapsulePalette>(
    isPalette(paletteParam) ? paletteParam : 'neutral'
  );
  const [copied, setCopied] = useState(false);

  const selections = useMemo(
    () => getCapsule({ audience, moment, palette }),
    [audience, moment, palette]
  );
  const metrics = useMemo(() => getCapsuleMetrics(selections), [selections]);

  const updateUrl = (
    nextAudience: CapsuleAudience,
    nextMoment: CapsuleMoment,
    nextPalette: CapsulePalette
  ) => {
    const params = new URLSearchParams({
      audience: nextAudience,
      moment: nextMoment,
      palette: nextPalette,
    });
    router.replace('/capsule?' + params.toString(), { scroll: false });
  };

  const changeAudience = (value: CapsuleAudience) => {
    setAudience(value);
    updateUrl(value, moment, palette);
  };

  const changeMoment = (value: CapsuleMoment) => {
    setMoment(value);
    updateUrl(audience, value, palette);
  };

  const changePalette = (value: CapsulePalette) => {
    setPalette(value);
    updateUrl(audience, moment, value);
  };

  const addCapsuleToBag = () => {
    addManyToBag(
      selections.map(({ product }) => ({
        product,
        color: product.colors[0],
        size: product.sizes[0] || 'M',
        quantity: 1,
      }))
    );
  };

  const saveCapsule = () => {
    addManyToWishlist(selections.map(({ product }) => product.id));
  };

  const allSaved =
    selections.length > 0 &&
    selections.every(({ product }) => wishlistIds.includes(product.id));

  const shareCapsule = async () => {
    const url =
      window.location.origin +
      '/capsule?audience=' +
      audience +
      '&moment=' +
      moment +
      '&palette=' +
      palette;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const audiences = [
    { value: 'women' as const, ar: 'النساء', en: 'Women' },
    { value: 'men' as const, ar: 'الرجال', en: 'Men' },
    { value: 'girls' as const, ar: 'البنات', en: 'Girls' },
    { value: 'boys' as const, ar: 'الأولاد', en: 'Boys' },
  ];

  const moments = [
    { value: 'daily' as const, ar: 'يومي', en: 'Everyday' },
    { value: 'work' as const, ar: 'عمل', en: 'Work' },
    { value: 'evening' as const, ar: 'مساء', en: 'Evening' },
    { value: 'eid' as const, ar: 'عيد', en: 'Eid' },
    { value: 'travel' as const, ar: 'سفر', en: 'Travel' },
  ];

  const palettes = [
    { value: 'neutral' as const, ar: 'محايد', en: 'Neutral' },
    { value: 'warm' as const, ar: 'دافئ', en: 'Warm' },
    { value: 'deep' as const, ar: 'عميق', en: 'Deep' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'استوديو الكابسولة' : 'Capsule Studio'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-9 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Grid2X2 className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                {language === 'ar' ? 'خزانة مصغّرة ذكية' : 'INTELLIGENT CAPSULE'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'خمس قطع. خمس وظائف. خزانة أكثر وضوحاً.'
                : 'Five pieces. Five roles. A clearer wardrobe.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'اختر لمن تشتري، المناسبة، وطابع الألوان. رِفْعة تبني كابسولة من خمس وظائف مختلفة باستخدام بيانات المنتجات الحالية فقط.'
              : 'Choose who you are shopping for, the moment and a palette. RIFAA builds a five-role capsule using only current product data.'}
          </p>
        </header>

        <section className="mt-8 grid gap-5 border border-[#242220]/10 bg-[#EEE8DE]/60 p-5 sm:p-7 lg:grid-cols-3">
          <div>
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242220]/45">
              {language === 'ar' ? '01 · لمن؟' : '01 · AUDIENCE'}
            </span>
            <div className="flex flex-wrap gap-2">
              {audiences.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeAudience(option.value)}
                  className={
                    audience === option.value
                      ? 'border border-[#111111] bg-[#111111] px-4 py-2.5 text-[11px] font-semibold text-white'
                      : 'border border-[#242220]/12 bg-[#FFFDFC] px-4 py-2.5 text-[11px] font-semibold text-[#242220]/65 hover:border-[#511D24]/40 hover:text-[#511D24]'
                  }
                >
                  {language === 'ar' ? option.ar : option.en}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242220]/45">
              {language === 'ar' ? '02 · المناسبة' : '02 · MOMENT'}
            </span>
            <div className="flex flex-wrap gap-2">
              {moments.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeMoment(option.value)}
                  className={
                    moment === option.value
                      ? 'border border-[#111111] bg-[#111111] px-4 py-2.5 text-[11px] font-semibold text-white'
                      : 'border border-[#242220]/12 bg-[#FFFDFC] px-4 py-2.5 text-[11px] font-semibold text-[#242220]/65 hover:border-[#511D24]/40 hover:text-[#511D24]'
                  }
                >
                  {language === 'ar' ? option.ar : option.en}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242220]/45">
              {language === 'ar' ? '03 · طابع الألوان' : '03 · PALETTE'}
            </span>
            <div className="flex flex-wrap gap-2">
              {palettes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changePalette(option.value)}
                  className={
                    palette === option.value
                      ? 'border border-[#111111] bg-[#111111] px-4 py-2.5 text-[11px] font-semibold text-white'
                      : 'border border-[#242220]/12 bg-[#FFFDFC] px-4 py-2.5 text-[11px] font-semibold text-[#242220]/65 hover:border-[#511D24]/40 hover:text-[#511D24]'
                  }
                >
                  {language === 'ar' ? option.ar : option.en}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#242220]/10 pb-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                {language === 'ar' ? 'الكابسولة الحالية' : 'CURRENT CAPSULE'}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                {language === 'ar' ? 'خمس وظائف متكاملة' : 'Five complementary roles'}
              </h2>
            </div>
            <button
              type="button"
              onClick={shareCapsule}
              className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#511D24]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span>
                {copied
                  ? language === 'ar'
                    ? 'تم نسخ الرابط'
                    : 'Link copied'
                  : language === 'ar'
                    ? 'شارك هذه الكابسولة'
                    : 'Share this capsule'}
              </span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {selections.map(({ product, roleAr, roleEn }, index) => (
              <article key={product.id} className="group">
                <Link href={'/products/' + product.slug} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
                    <ImageWithFallback
                      src={product.image}
                      alt={language === 'ar' ? product.nameAr : product.nameEn}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/5" />
                    <span className="absolute start-3 top-3 bg-[#111111]/80 px-2 py-1 font-editorial text-[10px] text-white backdrop-blur-sm">
                      0{index + 1}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D9D0C4]">
                        {language === 'ar' ? roleAr : roleEn}
                      </span>
                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {language === 'ar' ? product.nameAr : product.nameEn}
                      </h3>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between gap-3 pt-3">
                  <span className="text-xs font-semibold text-[#111111]">
                    {formatPrice(product.price, language)}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-[#242220]/42">
                    {product.colors.length} {language === 'ar' ? 'ألوان' : 'colors'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-4">
          {[
            {
              value: metrics.rolesFilled + '/5',
              ar: 'وظائف مكتملة',
              en: 'roles filled',
            },
            {
              value: String(metrics.colorways),
              ar: 'خيارات لونية',
              en: 'colorways',
            },
            {
              value: String(metrics.careProfiles),
              ar: 'أنماط عناية',
              en: 'care profiles',
            },
            {
              value: formatPrice(metrics.total, language),
              ar: 'إجمالي الكابسولة',
              en: 'capsule total',
            },
          ].map((metric) => (
            <div key={metric.en} className="bg-[#FFFDFC] p-5">
              <span className="font-editorial text-2xl font-semibold text-[#111111]">
                {metric.value}
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.15em] text-[#242220]/45">
                {language === 'ar' ? metric.ar : metric.en}
              </span>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Layers3 className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                {language === 'ar' ? 'قرار واحد لخمس قطع' : 'ONE DECISION, FIVE PIECES'}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-xs font-light leading-6 text-[#242220]/55">
              {language === 'ar'
                ? 'الإضافة للحقيبة تستخدم أول لون ومقاس متاح لكل قطعة كنقطة بداية، ويمكن تعديل كل اختيار لاحقاً من الحقيبة أو صفحة المنتج.'
                : 'Adding the capsule uses the first available color and size for each piece as a starting point; each selection can be refined later.'}
            </p>
          </div>

          <button
            type="button"
            onClick={saveCapsule}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#111111] hover:bg-[#EEE8DE]"
          >
            {allSaved ? <Check className="h-4 w-4 text-[#511D24]" /> : <Heart className="h-4 w-4" />}
            <span>
              {allSaved
                ? language === 'ar'
                  ? 'الكابسولة محفوظة'
                  : 'Capsule saved'
                : language === 'ar'
                  ? 'احفظ الكابسولة'
                  : 'Save capsule'}
            </span>
          </button>

          <button
            type="button"
            onClick={addCapsuleToBag}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#111111] px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#511D24]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{language === 'ar' ? 'أضف الكابسولة للحقيبة' : 'Add capsule to bag'}</span>
          </button>
        </section>

        <section className="mt-16 border-t border-[#242220]/10 pt-10">
          <div className="grid gap-px bg-[#242220]/10 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                ar: 'اختيار مبني على البيانات',
                en: 'Data-led selection',
                descAr: 'الترشيح يعتمد على التشكيلة والخامة والتفصيل والألوان الفعلية لكل منتج.',
                descEn: 'Selections use each product’s actual collection, fabrication, tailoring and color data.',
              },
              {
                icon: Grid2X2,
                ar: 'خمس وظائف مختلفة',
                en: 'Five distinct roles',
                descAr: 'المحرّك يتجنب تكرار نفس وظيفة القطعة قدر الإمكان داخل الكابسولة.',
                descEn: 'The engine avoids repeating the same wardrobe role wherever possible.',
              },
              {
                icon: Copy,
                ar: 'رابط قابل للمشاركة',
                en: 'Shareable configuration',
                descAr: 'اختيارات الجمهور والمناسبة والألوان تتحول إلى رابط يمكن الرجوع له.',
                descEn: 'Audience, moment and palette choices are encoded into a reusable link.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.en} className="bg-[#F7F4EF] p-6">
                  <Icon className="h-4 w-4 text-[#511D24]" />
                  <h3 className="mt-4 text-sm font-bold text-[#111111]">
                    {language === 'ar' ? item.ar : item.en}
                  </h3>
                  <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
                    {language === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link
            href="/atelier"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]"
          >
            <span>{language === 'ar' ? 'حوّل القطع إلى إطلالة في المشغل' : 'Move from capsule to the Atelier'}</span>
            {isRtl ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
