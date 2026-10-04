'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  DiscoveryDepartment,
  DiscoveryMoment,
  DiscoveryPriority,
  getDiscoveryRecommendations,
} from '@/lib/discovery';

export function StyleConcierge() {
  const { language, isRtl } = useLanguage();
  const [department, setDepartment] = useState<DiscoveryDepartment>('all');
  const [moment, setMoment] = useState<DiscoveryMoment>('daily');
  const [priority, setPriority] = useState<DiscoveryPriority>('balanced');

  const recommendations = useMemo(
    () => getDiscoveryRecommendations({ department, moment, priority }, 4),
    [department, moment, priority]
  );

  const departmentOptions: { value: DiscoveryDepartment; ar: string; en: string }[] = [
    { value: 'all', ar: 'الكل', en: 'All' },
    { value: 'women', ar: 'النساء', en: 'Women' },
    { value: 'men', ar: 'الرجال', en: 'Men' },
    { value: 'kids', ar: 'الأطفال', en: 'Kids' },
  ];

  const momentOptions: { value: DiscoveryMoment; ar: string; en: string }[] = [
    { value: 'daily', ar: 'يومي', en: 'Everyday' },
    { value: 'work', ar: 'عمل', en: 'Work' },
    { value: 'evening', ar: 'مساء', en: 'Evening' },
    { value: 'eid', ar: 'عيد', en: 'Eid' },
    { value: 'travel', ar: 'سفر', en: 'Travel' },
  ];

  const priorityOptions: { value: DiscoveryPriority; ar: string; en: string }[] = [
    { value: 'balanced', ar: 'متوازن', en: 'Balanced' },
    { value: 'breathable', ar: 'خفيف ومريح', en: 'Breathable' },
    { value: 'statement', ar: 'لافت', en: 'Statement' },
    { value: 'tailored', ar: 'تفصيل دقيق', en: 'Tailored' },
  ];

  function Segments<T extends string>({
    value,
    options,
    onChange,
    label,
  }: {
    value: T;
    options: { value: T; ar: string; en: string }[];
    onChange: (next: T) => void;
    label: string;
  }) {
    return (
      <div>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242220]/45">{label}</span>
        <div className="flex flex-wrap gap-1.5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                value === option.value
                  ? 'border border-[#111111] bg-[#111111] px-3 py-2 text-[11px] font-semibold text-white shadow-sm transition-all sm:px-4'
                  : 'border border-[#242220]/12 bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold text-[#242220]/65 transition-all hover:border-[#511D24]/40 hover:text-[#511D24] sm:px-4'
              }
            >
              {language === 'ar' ? option.ar : option.en}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#EEE8DE] py-18 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-[#242220]/10 bg-[#F7F4EF] p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
          <div className="flex flex-col justify-between gap-8 border-b border-[#242220]/10 pb-8 lg:border-b-0 lg:border-e lg:pb-0 lg:pe-10">
            <div>
              <div className="flex items-center gap-2 text-[#511D24]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
                  {language === 'ar' ? 'ميزة حصرية · منسّق رِفْعة' : 'EXCLUSIVE · RIFAA CURATOR'}
                </span>
              </div>
              <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
                {language === 'ar' ? 'اختيارات أقرب إلى ذوقك، لا مجرد فلترة.' : 'A wardrobe edit that feels considered, not filtered.'}
              </h2>
              <p className="mt-4 max-w-lg text-sm font-light leading-7 text-[#242220]/70">
                {language === 'ar'
                  ? 'اختر القسم، المناسبة، وما يهمك أكثر. محرّك رِفْعة يرتّب القطع فورياً وفق الخامة، التفصيل، التشكيلة، وطبيعة الاستخدام.'
                  : 'Choose a department, occasion and priority. The RIFAA engine ranks pieces instantly using fabrication, tailoring, collection and use-case signals.'}
              </p>
            </div>

            <div className="space-y-5">
              <Segments
                value={department}
                options={departmentOptions}
                onChange={setDepartment}
                label={language === 'ar' ? 'القسم' : 'DEPARTMENT'}
              />
              <Segments
                value={moment}
                options={momentOptions}
                onChange={setMoment}
                label={language === 'ar' ? 'المناسبة' : 'MOMENT'}
              />
              <Segments
                value={priority}
                options={priorityOptions}
                onChange={setPriority}
                label={language === 'ar' ? 'الأولوية' : 'PRIORITY'}
              />
            </div>

            <Link
              href="/discover"
              className="group inline-flex w-fit items-center gap-2 border-b border-[#111111] pb-1 text-xs font-bold uppercase tracking-wider text-[#111111] transition-colors hover:border-[#511D24] hover:text-[#511D24]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{language === 'ar' ? 'افتح تجربة التنسيق الكاملة' : 'Open the full styling experience'}</span>
              {isRtl ? (
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              )}
            </Link>
          </div>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                  {language === 'ar' ? 'النتيجة المباشرة' : 'LIVE EDIT'}
                </span>
                <h3 className="mt-1 text-xl font-bold text-[#111111]">
                  {language === 'ar' ? 'أربع قطع مقترحة الآن' : 'Four pieces selected for you'}
                </h3>
              </div>
              <span className="text-[11px] text-[#242220]/45">{recommendations.length}/4</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {recommendations.map(({ product }) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
