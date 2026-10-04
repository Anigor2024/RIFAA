'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  DiscoveryDepartment,
  DiscoveryMoment,
  DiscoveryPriority,
  getDiscoveryRecommendations,
} from '@/lib/discovery';

interface SelectorOption<T extends string> {
  value: T;
  ar: string;
  en: string;
  noteAr: string;
  noteEn: string;
}

function DiscoverySelector<T extends string>({
  titleAr,
  titleEn,
  value,
  options,
  onChange,
  index,
  language,
}: {
  titleAr: string;
  titleEn: string;
  value: T;
  options: SelectorOption<T>[];
  onChange: (next: T) => void;
  index: string;
  language: 'ar' | 'en';
}) {
  return (
    <section className="border-t border-[#242220]/10 py-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-editorial text-sm text-[#B59A73]">{index}</span>
        <h2 className="text-sm font-bold text-[#111111]">{language === 'ar' ? titleAr : titleEn}</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                active
                  ? 'relative min-h-[82px] border border-[#111111] bg-[#111111] p-3 text-start text-white shadow-md transition-all'
                  : 'relative min-h-[82px] border border-[#242220]/12 bg-[#FFFDFC] p-3 text-start text-[#111111] transition-all hover:border-[#511D24]/40'
              }
            >
              {active && <Check className="absolute end-3 top-3 h-3.5 w-3.5 text-[#B59A73]" />}
              <span className="block pe-5 text-xs font-bold">{language === 'ar' ? option.ar : option.en}</span>
              <span className={active ? 'mt-1 block text-[10px] leading-4 text-white/55' : 'mt-1 block text-[10px] leading-4 text-[#242220]/45'}>
                {language === 'ar' ? option.noteAr : option.noteEn}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function DiscoverPage() {
  const { language, isRtl } = useLanguage();
  const [department, setDepartment] = useState<DiscoveryDepartment>('all');
  const [moment, setMoment] = useState<DiscoveryMoment>('daily');
  const [priority, setPriority] = useState<DiscoveryPriority>('balanced');

  const recommendations = useMemo(
    () => getDiscoveryRecommendations({ department, moment, priority }, 8),
    [department, moment, priority]
  );

  const departmentOptions: SelectorOption<DiscoveryDepartment>[] = [
    { value: 'all', ar: 'كل الأقسام', en: 'All departments', noteAr: 'اختيار مفتوح', noteEn: 'Open edit' },
    { value: 'women', ar: 'النساء', en: 'Women', noteAr: 'عبايات وتفصيل', noteEn: 'Abayas & tailoring' },
    { value: 'men', ar: 'الرجال', en: 'Men', noteAr: 'ثياب وقطع معاصرة', noteEn: 'Thobes & modern layers' },
    { value: 'kids', ar: 'الأطفال', en: 'Kids', noteAr: 'راحة ومناسبات', noteEn: 'Comfort & occasions' },
  ];

  const momentOptions: SelectorOption<DiscoveryMoment>[] = [
    { value: 'daily', ar: 'كل يوم', en: 'Everyday', noteAr: 'مرونة وعملية', noteEn: 'Versatile & practical' },
    { value: 'work', ar: 'العمل', en: 'Work', noteAr: 'بنية وحضور', noteEn: 'Structure & presence' },
    { value: 'evening', ar: 'المساء', en: 'Evening', noteAr: 'خامات أعمق', noteEn: 'Richer materials' },
    { value: 'eid', ar: 'العيد', en: 'Eid', noteAr: 'مناسبة واختيار خاص', noteEn: 'Occasion-led edit' },
    { value: 'travel', ar: 'السفر', en: 'Travel', noteAr: 'خفة وتهوية', noteEn: 'Light & breathable' },
  ];

  const priorityOptions: SelectorOption<DiscoveryPriority>[] = [
    { value: 'balanced', ar: 'اختيار متوازن', en: 'Balanced', noteAr: 'الحضور + العملية', noteEn: 'Presence + utility' },
    { value: 'breathable', ar: 'التهوية والراحة', en: 'Breathable', noteAr: 'خامات أخف', noteEn: 'Lighter fabrics' },
    { value: 'statement', ar: 'تفصيل لافت', en: 'Statement', noteAr: 'أثر بصري محسوب', noteEn: 'Controlled visual impact' },
    { value: 'tailored', ar: 'دقة التفصيل', en: 'Tailored', noteAr: 'بنية وقصّة', noteEn: 'Structure & cut' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45">
          <Link href="/" className="transition-colors hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'منسّق رِفْعة' : 'RIFAA Curator'}
          </span>
        </nav>

        <header className="mb-10 grid gap-6 border-b border-[#242220]/10 pb-9 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Compass className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">
                {language === 'ar' ? 'تجربة اكتشاف ذكية' : 'INTELLIGENT DISCOVERY'}
              </span>
            </div>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar' ? 'منسّق رِفْعة يختصر الطريق إلى القطعة المناسبة.' : 'The RIFAA Curator shortens the path to the right piece.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'ليست توصية عشوائية: كل نتيجة تُرتّب بحسب القسم والمناسبة والخامة والتفصيل والتشكيلة الحالية. غيّر أي اختيار وشاهد التحرير يتبدّل فوراً.'
              : 'Not a random recommendation: every result is ranked using department, occasion, fabrication, tailoring and collection signals. Change any choice and the edit responds instantly.'}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[410px_1fr]">
          <aside className="h-fit border border-[#242220]/10 bg-[#EEE8DE]/70 p-5 sm:p-6 lg:sticky lg:top-28">
            <div className="mb-6 flex items-center justify-between border-b border-[#242220]/10 pb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#511D24]">
                  {language === 'ar' ? 'بناء الاختيار' : 'BUILD YOUR EDIT'}
                </span>
                <p className="mt-1 text-xs text-[#242220]/55">
                  {language === 'ar' ? 'ثلاثة قرارات فقط.' : 'Three decisions only.'}
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-[#B59A73]" />
            </div>

            <DiscoverySelector
              titleAr="لمن تبحث؟"
              titleEn="Who are you shopping for?"
              value={department}
              options={departmentOptions}
              onChange={setDepartment}
              index="01"
              language={language}
            />
            <DiscoverySelector
              titleAr="ما المناسبة؟"
              titleEn="What is the moment?"
              value={moment}
              options={momentOptions}
              onChange={setMoment}
              index="02"
              language={language}
            />
            <DiscoverySelector
              titleAr="ما الأولوية؟"
              titleEn="What matters most?"
              value={priority}
              options={priorityOptions}
              onChange={setPriority}
              index="03"
              language={language}
            />

            <button
              type="button"
              onClick={() => {
                setDepartment('all');
                setMoment('daily');
                setPriority('balanced');
              }}
              className="mt-2 inline-flex items-center gap-2 text-[11px] font-semibold text-[#242220]/55 transition-colors hover:text-[#511D24]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'إعادة ضبط الاختيارات' : 'Reset selections'}</span>
            </button>
          </aside>

          <main>
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#242220]/10 pb-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B59A73]">
                  {language === 'ar' ? 'تحريرك الحالي' : 'YOUR CURRENT EDIT'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'القطع الأعلى توافقاً' : 'Highest-match pieces'}
                </h2>
              </div>
              <span className="text-xs text-[#242220]/45">
                {language === 'ar'
                  ? recommendations.length + ' اختيارات مرتبة حسب التوافق'
                  : recommendations.length + ' selections ranked by fit'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3">
              {recommendations.map(({ product, reasonsAr, reasonsEn }) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  <div className="mt-2 border-t border-[#242220]/08 pt-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#511D24]">
                      {language === 'ar' ? 'سبب الترشيح' : 'WHY IT MATCHES'}
                    </span>
                    <p className="mt-1 text-[10px] leading-4 text-[#242220]/50">
                      {(language === 'ar' ? reasonsAr : reasonsEn).join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border border-[#242220]/10 bg-[#FFFDFC] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <h3 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'تفضّل التصفح الحر؟' : 'Prefer open browsing?'}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#242220]/55">
                  {language === 'ar'
                    ? 'يمكنك الانتقال إلى التشكيلات الكاملة مع الاحتفاظ بهذه التجربة كاختصار ذكي.'
                    : 'Move into the full collections and keep this curator as your fast path back.'}
                </p>
              </div>
              <Link
                href="/collections"
                className="group mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] sm:mt-0"
              >
                <span>{language === 'ar' ? 'كل التشكيلات' : 'All collections'}</span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
