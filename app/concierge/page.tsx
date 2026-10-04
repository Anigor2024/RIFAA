'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Cloud,
  Columns3,
  Compass,
  Eye,
  Heart,
  IdCard,
  LockKeyhole,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAccount } from '@/context/AccountContext';
import { useAuth } from '@/context/AuthContext';
import { useStylePassport } from '@/context/StylePassportContext';
import { getJourneyPlan } from '@/lib/journey';
import { getDiscoveryRecommendations } from '@/lib/discovery';
import { DEMO_PRODUCTS } from '@/data/products';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/commerce';

export default function ConciergePage() {
  const { language, isRtl } = useLanguage();
  const { bagCount, subtotal } = useBag();
  const { wishlistCount, wishlistItems } = useWishlist();
  const { compareCount, compareItems } = useCompare();
  const { recentlyViewedIds, orders, cloudSyncState } = useAccount();
  const { user } = useAuth();
  const { passport, isConfigured, curatorHref } = useStylePassport();

  const plan = getJourneyPlan({
    passportConfigured: isConfigured,
    viewedCount: recentlyViewedIds.length,
    wishlistCount,
    compareCount,
    bagCount,
    orderCount: orders.length,
  });

  const department =
    passport?.audience === 'women' || passport?.audience === 'men'
      ? passport.audience
      : passport
        ? 'kids'
        : 'all';

  const recommendations = getDiscoveryRecommendations(
    {
      department,
      moment: passport?.moment ?? 'daily',
      priority: passport?.priority ?? 'balanced',
    },
    4
  );

  const recentProducts = recentlyViewedIds
    .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof DEMO_PRODUCTS)[number] => Boolean(product))
    .slice(0, 3);

  const signals = [
    {
      icon: IdCard,
      value: isConfigured ? (language === 'ar' ? 'جاهز' : 'Ready') : '—',
      ar: 'جواز الأسلوب',
      en: 'Style Passport',
    },
    {
      icon: Eye,
      value: String(recentlyViewedIds.length),
      ar: 'شوهدت مؤخراً',
      en: 'Recently viewed',
    },
    {
      icon: Heart,
      value: String(wishlistCount),
      ar: 'محفوظة',
      en: 'Saved',
    },
    {
      icon: Columns3,
      value: String(compareCount),
      ar: 'في المقارنة',
      en: 'In compare',
    },
    {
      icon: ShoppingBag,
      value: String(bagCount),
      ar: 'في الحقيبة',
      en: 'In bag',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45">
          <Link href="/" className="hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/studio" className="hover:text-[#111111]">
            {language === 'ar' ? 'الاستوديو' : 'Studio'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'كونسيرج رِفْعة' : 'RIFAA Concierge'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-10 lg:grid-cols-[1fr_0.74fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Compass className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                {language === 'ar' ? 'رحلة عميل موجهة' : 'GUIDED CLIENT JOURNEY'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-[#111111] sm:text-5xl lg:text-7xl">
              {language === 'ar'
                ? 'لا تحتاج أن تتذكر أين توقفت. رِفْعة تكمل معك من هناك.'
                : 'You should not have to remember where you stopped. RIFAA resumes from there.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'الكونسيرج يقرأ فقط إشارات رحلتك داخل المتجر — التفضيلات، المشاهدة، المفضلة، المقارنة والحقيبة — ثم يقترح خطوة تالية واضحة.'
              : 'Concierge reads only your storefront journey signals — preferences, views, wishlist, compare and bag — then suggests one clear next action.'}
          </p>
        </header>

        <section className="mt-8 overflow-hidden border border-[#242220]/10 bg-[#171615] text-white">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:p-10">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#B59A73]">
                {language === 'ar' ? plan.nextAction.eyebrowAr : plan.nextAction.eyebrowEn}
              </span>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">
                {language === 'ar' ? plan.nextAction.titleAr : plan.nextAction.titleEn}
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-light leading-7 text-white/62">
                {language === 'ar' ? plan.nextAction.bodyAr : plan.nextAction.bodyEn}
              </p>
              <Link
                href={plan.nextAction.href === '/discover' ? curatorHref : plan.nextAction.href}
                className="group mt-7 inline-flex min-h-12 items-center gap-2 bg-white px-6 text-xs font-bold uppercase tracking-[0.13em] text-[#111111] transition-colors hover:bg-[#EEE8DE]"
              >
                <Sparkles className="h-4 w-4 text-[#511D24]" />
                <span>{language === 'ar' ? plan.nextAction.labelAr : plan.nextAction.labelEn}</span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>

            <div className="border border-white/12 bg-white/[0.035] p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/40">
                    {language === 'ar' ? 'تقدم الرحلة' : 'JOURNEY PROGRESS'}
                  </span>
                  <span className="mt-1 block font-editorial text-4xl font-semibold text-white">
                    {plan.progress}%
                  </span>
                </div>
                <span className="text-[10px] text-white/45">
                  {plan.completedCount}/5
                </span>
              </div>
              <div className="mt-4 h-1 overflow-hidden bg-white/10">
                <div
                  className="h-full origin-start bg-[#B59A73] transition-transform duration-700"
                  style={{ transform: 'scaleX(' + plan.progress / 100 + ')' }}
                />
              </div>
              <p className="mt-4 text-[10px] leading-5 text-white/42">
                {language === 'ar'
                  ? 'النسبة تصف اكتمال خطوات الرحلة داخل المتجر فقط؛ ليست تقييماً لذوقك أو جاهزية المقاس.'
                  : 'This percentage describes storefront journey completion only; it is not a score of taste or fit readiness.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-5">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div key={signal.en} className="bg-[#FFFDFC] p-4 sm:p-5">
                <Icon className="h-4 w-4 text-[#511D24]" />
                <span className="mt-3 block text-xl font-bold text-[#111111]">{signal.value}</span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-[#242220]/45">
                  {language === 'ar' ? signal.ar : signal.en}
                </span>
              </div>
            );
          })}
        </section>

        <section className="mt-14">
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-[#242220]/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                {language === 'ar' ? 'مسار الرحلة' : 'JOURNEY MAP'}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#111111] sm:text-3xl">
                {language === 'ar' ? 'خمس مراحل، بدون خطوات زائدة.' : 'Five stages, without unnecessary steps.'}
              </h2>
            </div>
            <span className="text-xs text-[#242220]/45">
              {language === 'ar'
                ? plan.completedCount + ' مراحل مكتملة'
                : plan.completedCount + ' stages complete'}
            </span>
          </div>

          <div className="grid gap-px border border-[#242220]/10 bg-[#242220]/10 md:grid-cols-5">
            {plan.milestones.map((milestone, index) => (
              <div
                key={milestone.key}
                className={
                  milestone.complete
                    ? 'bg-[#111111] p-5 text-white'
                    : 'bg-[#FFFDFC] p-5 text-[#111111]'
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={milestone.complete ? 'font-editorial text-sm text-[#D9D0C4]' : 'font-editorial text-sm text-[#B59A73]'}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {milestone.complete ? (
                    <Check className="h-4 w-4 text-[#B59A73]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-25 rtl:rotate-180" />
                  )}
                </div>
                <h3 className="mt-8 text-sm font-bold">
                  {language === 'ar' ? milestone.labelAr : milestone.labelEn}
                </h3>
                <p className={milestone.complete ? 'mt-2 text-[10px] leading-5 text-white/48' : 'mt-2 text-[10px] leading-5 text-[#242220]/48'}>
                  {language === 'ar' ? milestone.noteAr : milestone.noteEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {(recentProducts.length > 0 || wishlistItems.length > 0 || compareItems.length > 0) && (
          <section className="mt-14">
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                {language === 'ar' ? 'استأنف من إشاراتك' : 'RESUME FROM YOUR SIGNALS'}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                {language === 'ar' ? 'الأشياء التي تستحق الرجوع لها الآن.' : 'What is worth returning to now.'}
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {[
                {
                  titleAr: 'شوهدت مؤخراً',
                  titleEn: 'Recently viewed',
                  href: '/account',
                  products: recentProducts,
                  icon: Eye,
                },
                {
                  titleAr: 'القائمة القصيرة',
                  titleEn: 'Shortlist',
                  href: '/wishlist',
                  products: wishlistItems.slice(0, 3),
                  icon: Heart,
                },
                {
                  titleAr: 'المقارنة الحالية',
                  titleEn: 'Current compare',
                  href: '/compare',
                  products: compareItems.slice(0, 3),
                  icon: Columns3,
                },
              ].map((group) => {
                const Icon = group.icon;
                return (
                  <article key={group.titleEn} className="border border-[#242220]/10 bg-[#FFFDFC] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#511D24]">
                        <Icon className="h-4 w-4" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.12em]">
                          {language === 'ar' ? group.titleAr : group.titleEn}
                        </h3>
                      </div>
                      <span className="text-[10px] text-[#242220]/35">{group.products.length}</span>
                    </div>

                    {group.products.length > 0 ? (
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {group.products.map((product) => (
                          <Link key={product.id} href={'/products/' + product.slug} className="group">
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#E7E0D4]">
                              <ImageWithFallback
                                src={product.image}
                                alt={language === 'ar' ? product.nameAr : product.nameEn}
                                fill
                                sizes="120px"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                              />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 text-xs leading-6 text-[#242220]/42">
                        {language === 'ar' ? 'لا توجد إشارات في هذه المرحلة بعد.' : 'No signals in this stage yet.'}
                      </p>
                    )}

                    <Link
                      href={group.href}
                      className="group mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#111111]"
                    >
                      <span>{language === 'ar' ? 'افتح المرحلة' : 'Open stage'}</span>
                      {isRtl ? (
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-16">
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-[#242220]/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                {language === 'ar' ? 'تحرير شخصي' : 'PERSONAL EDIT'}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#111111] sm:text-3xl">
                {isConfigured
                  ? language === 'ar'
                    ? 'اختيارات تبدأ من جواز أسلوبك.'
                    : 'Selections that start from your Style Passport.'
                  : language === 'ar'
                    ? 'اختيارات متوازنة كبداية.'
                    : 'A balanced edit to begin with.'}
              </h2>
            </div>
            <Link
              href={curatorHref}
              className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#511D24]"
            >
              <span>{language === 'ar' ? 'افتح المنسّق' : 'Open Curator'}</span>
              {isRtl ? (
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {recommendations.map(({ product }) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-3">
          <div className="bg-[#FFFDFC] p-6">
            <LockKeyhole className="h-4 w-4 text-[#511D24]" />
            <h3 className="mt-4 text-sm font-bold text-[#111111]">
              {language === 'ar' ? 'خصوصية أولاً' : 'Privacy first'}
            </h3>
            <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
              {language === 'ar'
                ? 'الكونسيرج لا يطلب قياسات جسم أو بيانات حساسة، ولا ينشئ ملفاً خفياً عنك.'
                : 'Concierge asks for no body measurements or sensitive data and creates no hidden profile.'}
            </p>
          </div>
          <div className="bg-[#FFFDFC] p-6">
            <Cloud className="h-4 w-4 text-[#511D24]" />
            <h3 className="mt-4 text-sm font-bold text-[#111111]">
              {language === 'ar' ? 'حالة واضحة' : 'Clear state'}
            </h3>
            <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
              {user && cloudSyncState === 'synced'
                ? language === 'ar'
                  ? 'حسابك السحابي متصل، بينما جواز الأسلوب نفسه يبقى محلياً على الجهاز.'
                  : 'Your cloud account is connected while Style Passport itself remains local to this device.'
                : language === 'ar'
                  ? 'الرحلة الحالية تعمل محلياً، ويمكنك تسجيل الدخول لمزامنة بيانات الحساب المدعومة.'
                  : 'The current journey works locally; sign in when you want supported account data to sync.'}
            </p>
          </div>
          <div className="bg-[#FFFDFC] p-6">
            <ShoppingBag className="h-4 w-4 text-[#511D24]" />
            <h3 className="mt-4 text-sm font-bold text-[#111111]">
              {language === 'ar' ? 'الحقيبة الآن' : 'Current bag'}
            </h3>
            <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">
              {bagCount > 0
                ? language === 'ar'
                  ? bagCount + ' عناصر بقيمة ' + formatPrice(subtotal, language) + '.'
                  : bagCount + ' items totaling ' + formatPrice(subtotal, language) + '.'
                : language === 'ar'
                  ? 'لا توجد عناصر في الحقيبة حالياً.'
                  : 'There are no items in the bag yet.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
