'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useAccount } from '@/context/AccountContext';
import { useStylePassport } from '@/context/StylePassportContext';
import { getJourneyPlan } from '@/lib/journey';

export function ConciergePreview() {
  const { language, isRtl } = useLanguage();
  const { bagCount } = useBag();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { recentlyViewedIds, orders } = useAccount();
  const { isConfigured, curatorHref } = useStylePassport();

  const plan = getJourneyPlan({
    passportConfigured: isConfigured,
    viewedCount: recentlyViewedIds.length,
    wishlistCount,
    compareCount,
    bagCount,
    orderCount: orders.length,
  });

  const actionHref =
    plan.nextAction.href === '/discover' ? curatorHref : plan.nextAction.href;

  return (
    <section className="bg-[#EEE8DE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden border border-[#242220]/10 bg-[#FFFDFC] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-10">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <Compass className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
                  {language === 'ar' ? 'كونسيرج رِفْعة' : 'RIFAA CONCIERGE'}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-[1.07] tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
                {language === 'ar'
                  ? plan.nextAction.titleAr
                  : plan.nextAction.titleEn}
              </h2>
              <p className="mt-4 max-w-lg text-sm font-light leading-7 text-[#242220]/62">
                {language === 'ar'
                  ? 'بدلاً من عرض كل أدوات رِفْعة مرة واحدة، يختار الكونسيرج الخطوة الأقرب لرحلتك الحالية.'
                  : 'Instead of showing every RIFAA tool at once, Concierge surfaces the step closest to your current journey.'}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#242220]/42">
                    {language === 'ar' ? 'تقدم الرحلة' : 'JOURNEY PROGRESS'}
                  </span>
                  <span className="mt-1 block font-editorial text-4xl font-semibold text-[#111111]">
                    {plan.progress}%
                  </span>
                </div>
                <span className="text-[10px] text-[#242220]/42">{plan.completedCount}/5</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden bg-[#242220]/10">
                <div
                  className="h-full origin-start bg-[#511D24]"
                  style={{ transform: 'scaleX(' + plan.progress / 100 + ')' }}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={actionHref}
                  className="group inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#511D24]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{language === 'ar' ? plan.nextAction.labelAr : plan.nextAction.labelEn}</span>
                </Link>
                <Link
                  href="/concierge"
                  className="group inline-flex items-center gap-2 border-b border-[#111111]/35 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]"
                >
                  <span>{language === 'ar' ? 'افتح الرحلة كاملة' : 'Open full journey'}</span>
                  {isRtl ? (
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid min-h-[520px] grid-cols-5 gap-px bg-[#242220]/10">
            {plan.milestones.map((milestone, index) => (
              <div
                key={milestone.key}
                className={
                  milestone.complete
                    ? 'relative flex flex-col justify-between bg-[#171615] p-4 text-white sm:p-5'
                    : 'relative flex flex-col justify-between bg-[#F7F4EF] p-4 text-[#111111] sm:p-5'
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={milestone.complete ? 'font-editorial text-sm text-[#D9D0C4]' : 'font-editorial text-sm text-[#B59A73]'}>
                    0{index + 1}
                  </span>
                  {milestone.complete && <Check className="h-3.5 w-3.5 text-[#B59A73]" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                    {language === 'ar' ? milestone.labelAr : milestone.labelEn}
                  </span>
                  <p className={milestone.complete ? 'mt-2 hidden text-[9px] leading-5 text-white/42 sm:block' : 'mt-2 hidden text-[9px] leading-5 text-[#242220]/42 sm:block'}>
                    {language === 'ar' ? milestone.noteAr : milestone.noteEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
