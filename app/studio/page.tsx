'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Columns3,
  Eye,
  Grid2X2,
  Heart,
  WandSparkles,
  Layers3,
  Sparkles,
  IdCard,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAccount } from '@/context/AccountContext';
import { useAuth } from '@/context/AuthContext';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useStylePassport } from '@/context/StylePassportContext';
import { useBag } from '@/context/BagContext';
import { getJourneyPlan } from '@/lib/journey';

export default function StudioPage() {
  const { language, isRtl } = useLanguage();
  const { compareCount } = useCompare();
  const { wishlistCount } = useWishlist();
  const { recentlyViewedIds, cloudSyncState } = useAccount();
  const { user } = useAuth();
  const { passport, isConfigured, curatorHref, capsuleHref } = useStylePassport();
  const { bagCount } = useBag();
  const journey = getJourneyPlan({
    passportConfigured: isConfigured,
    viewedCount: recentlyViewedIds.length,
    wishlistCount,
    compareCount,
    bagCount,
    orderCount: 0,
  });

  const tools = [
    {
      href: curatorHref,
      icon: Sparkles,
      index: '01',
      ar: 'منسّق رِفْعة',
      en: 'RIFAA Curator',
      descAr: 'رتّب القطع حسب القسم والمناسبة وأولوية الخامة أو التفصيل.',
      descEn: 'Rank pieces by department, moment and your material or tailoring priority.',
      imageId: 'w-02',
    },
    {
      href: '/atelier',
      icon: Layers3,
      index: '02',
      ar: 'مشغل رِفْعة',
      en: 'RIFAA Atelier',
      descAr: 'كوّن إطلالة كاملة، عدّل اللون والمقاس، وأضف التحرير كله للحقيبة.',
      descEn: 'Compose a full look, refine color and size, then bag the complete edit.',
      imageId: 'm-05',
    },
    {
      href: '/pairing',
      icon: WandSparkles,
      index: '03',
      ar: 'استوديو التنسيق',
      en: 'Pairing Studio',
      descAr: 'ابدأ من أي قطعة وابنِ حولها اختيارات مكملة ديناميكياً.',
      descEn: 'Start from any piece and dynamically build complementary selections around it.',
      imageId: 'w-01',
    },
    {
      href: '/compare',
      icon: Columns3,
      index: '04',
      ar: 'استوديو المقارنة',
      en: 'Compare Studio',
      descAr: 'قارن حتى ثلاث قطع في الخامة والتفصيل والعناية والسعر والمقاسات.',
      descEn: 'Compare up to three pieces across fabric, tailoring, care, price and sizing.',
      imageId: 'w-03',
    },
    {
      href: capsuleHref,
      icon: Grid2X2,
      index: '05',
      ar: 'استوديو الكابسولة',
      en: 'Capsule Studio',
      descAr: 'ابنِ خمس قطع بوظائف مختلفة حسب المناسبة وطابع الألوان.',
      descEn: 'Build a five-role wardrobe capsule by moment and palette.',
      imageId: 'w-10',
    },
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
            {language === 'ar' ? 'استوديو رِفْعة' : 'RIFAA Studio'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#511D24]">
              {language === 'ar' ? 'مساحة القرار والإبداع' : 'DECISION & CREATIVE WORKSPACE'}
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-[#111111] sm:text-5xl lg:text-7xl">
              {language === 'ar'
                ? 'أربع أدوات، وجواز أسلوب يجعل البداية أقرب لك.'
                : 'Four tools, plus a Style Passport that starts closer to you.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'بدلاً من تشتيت أدوات الاكتشاف والتنسيق والمقارنة في أنحاء المتجر، يجمعها استوديو رِفْعة في مساحة واحدة مترابطة.'
              : 'Instead of scattering discovery, styling and comparison tools across the store, RIFAA Studio brings them into one connected workspace.'}
          </p>
        </header>

        <section className="mt-8 overflow-hidden border border-[#511D24]/15 bg-[#511D24]/[0.035]">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <Compass className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                  {language === 'ar' ? 'كونسيرج رِفْعة · الخطوة التالية' : 'RIFAA CONCIERGE · NEXT BEST ACTION'}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-[#111111] sm:text-3xl">
                {language === 'ar' ? journey.nextAction.titleAr : journey.nextAction.titleEn}
              </h2>
              <p className="mt-2 max-w-2xl text-xs font-light leading-6 text-[#242220]/55">
                {language === 'ar' ? journey.nextAction.bodyAr : journey.nextAction.bodyEn}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                href="/concierge"
                className="inline-flex min-h-11 items-center gap-2 bg-[#111111] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-[#511D24]"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>{language === 'ar' ? 'افتح الكونسيرج' : 'Open Concierge'}</span>
              </Link>
              <Link
                href={journey.nextAction.href === '/discover' ? curatorHref : journey.nextAction.href}
                className="inline-flex min-h-11 items-center gap-2 border border-[#242220]/15 bg-[#FFFDFC] px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#111111]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#511D24]" />
                <span>{language === 'ar' ? journey.nextAction.labelAr : journey.nextAction.labelEn}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden border border-[#242220]/10 bg-[#171615] text-white">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-[#B59A73]">
                <IdCard className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                  {language === 'ar' ? 'جواز أسلوب رِفْعة' : 'RIFAA STYLE PASSPORT'}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                {isConfigured
                  ? language === 'ar'
                    ? 'تفضيلاتك جاهزة لتخصيص أدوات الاستوديو.'
                    : 'Your preferences are ready to personalize the Studio.'
                  : language === 'ar'
                    ? 'ابدأ بتعريف أربع تفضيلات فقط.'
                    : 'Start by defining just four preferences.'}
              </h2>
              <p className="mt-2 max-w-2xl text-xs font-light leading-6 text-white/55">
                {language === 'ar'
                  ? 'الجمهور، المناسبة، طابع الألوان، وأولوية الاختيار — محفوظة على هذا الجهاز فقط، بدون قياسات جسم أو بيانات حساسة.'
                  : 'Audience, moment, palette and decision priority stay on this device only, with no body measurements or sensitive data.'}
              </p>
              {passport && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {[passport.audience, passport.moment, passport.palette, passport.priority].map((value) => (
                    <span key={value} className="border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.13em] text-white/60">
                      {value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link
                href="/passport"
                className="inline-flex min-h-11 items-center gap-2 bg-white px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#111111]"
              >
                <IdCard className="h-3.5 w-3.5" />
                <span>{isConfigured ? (language === 'ar' ? 'عدّل الجواز' : 'Edit passport') : (language === 'ar' ? 'أنشئ الجواز' : 'Create passport')}</span>
              </Link>
              {isConfigured && (
                <Link
                  href={curatorHref}
                  className="inline-flex min-h-11 items-center gap-2 border border-white/25 px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#B59A73]" />
                  <span>{language === 'ar' ? 'ابدأ من تفضيلاتي' : 'Start from my preferences'}</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#FFFDFC] p-5">
            <Heart className="h-4 w-4 text-[#511D24]" />
            <span className="mt-3 block text-2xl font-bold text-[#111111]">{wishlistCount}</span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#242220]/45">
              {language === 'ar' ? 'قطع محفوظة' : 'saved pieces'}
            </span>
          </div>
          <div className="bg-[#FFFDFC] p-5">
            <Columns3 className="h-4 w-4 text-[#511D24]" />
            <span className="mt-3 block text-2xl font-bold text-[#111111]">{compareCount}</span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#242220]/45">
              {language === 'ar' ? 'في المقارنة' : 'in compare'}
            </span>
          </div>
          <div className="bg-[#FFFDFC] p-5">
            <Eye className="h-4 w-4 text-[#511D24]" />
            <span className="mt-3 block text-2xl font-bold text-[#111111]">{recentlyViewedIds.length}</span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#242220]/45">
              {language === 'ar' ? 'شوهدت مؤخراً' : 'recently viewed'}
            </span>
          </div>
          <div className="bg-[#FFFDFC] p-5">
            <Cloud className="h-4 w-4 text-[#511D24]" />
            <span className="mt-3 block text-sm font-bold text-[#111111]">
              {user && cloudSyncState === 'synced'
                ? language === 'ar'
                  ? 'متزامن'
                  : 'Synced'
                : language === 'ar'
                  ? 'وضع محلي'
                  : 'Local mode'}
            </span>
            <span className="mt-2 block text-[9px] uppercase tracking-[0.15em] text-[#242220]/45">
              {language === 'ar' ? 'حالة الرحلة' : 'journey state'}
            </span>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const product = DEMO_PRODUCTS.find((item) => item.id === tool.imageId);

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group grid min-h-[420px] overflow-hidden border border-[#242220]/10 bg-[#FFFDFC] sm:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-[300px] overflow-hidden bg-[#E7E0D4] sm:min-h-full">
                  {product && (
                    <ImageWithFallback
                      src={product.image}
                      alt={language === 'ar' ? product.nameAr : product.nameEn}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.045]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
                  <span className="absolute start-4 top-4 bg-[#111111]/82 px-2 py-1 font-editorial text-xs text-white backdrop-blur-sm">
                    {tool.index}
                  </span>
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-7">
                  <div>
                    <Icon className="h-5 w-5 text-[#511D24]" />
                    <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#111111]">
                      {language === 'ar' ? tool.ar : tool.en}
                    </h2>
                    <p className="mt-3 text-xs font-light leading-6 text-[#242220]/60">
                      {language === 'ar' ? tool.descAr : tool.descEn}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-[#242220]/10 pt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#511D24]">
                      {language === 'ar' ? 'ابدأ الآن' : 'Open tool'}
                    </span>
                    {isRtl ? (
                      <ArrowLeft className="h-4 w-4 text-[#242220]/40 transition-transform group-hover:-translate-x-1 group-hover:text-[#511D24]" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-[#242220]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#511D24]" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-12 overflow-hidden bg-[#171615] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#B59A73]">
                {language === 'ar' ? 'مسار مقترح' : 'RECOMMENDED FLOW'}
              </span>
              <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'ar'
                  ? 'اكتشف → نسّق القطعة → كوّن الإطلالة → قارن → ابنِ الكابسولة.'
                  : 'Discover → Pair → Compose → Compare → Build the capsule.'}
              </h2>
            </div>
            <p className="max-w-xl text-xs font-light leading-6 text-white/55 lg:justify-self-end">
              {language === 'ar'
                ? 'كل أداة تحل مرحلة مختلفة من قرار الشراء، لذلك لا تحتاج لاستخدامها كلها في كل زيارة.'
                : 'Each tool solves a different part of the purchase decision, so you only use what the moment requires.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
