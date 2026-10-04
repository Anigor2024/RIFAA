'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Grid2X2,
  IdCard,
  LockKeyhole,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  DEFAULT_STYLE_PASSPORT,
  StylePassport,
  useStylePassport,
} from '@/context/StylePassportContext';

export default function PassportPage() {
  const { language, isRtl } = useLanguage();
  const {
    passport,
    isConfigured,
    savePassport,
    clearPassport,
    curatorHref,
    capsuleHref,
  } = useStylePassport();
  const [copied, setCopied] = useState(false);

  const current = passport ?? DEFAULT_STYLE_PASSPORT;

  const update = <K extends keyof StylePassport>(key: K, value: StylePassport[K]) => {
    savePassport({ ...current, [key]: value });
  };

  const copyProfileLink = async () => {
    const params = new URLSearchParams({
      audience: current.audience,
      moment: current.moment,
      palette: current.palette,
      priority: current.priority,
    });

    try {
      await navigator.clipboard.writeText(
        window.location.origin + '/passport?' + params.toString()
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const audiences = [
    { value: 'women' as const, ar: 'النساء', en: 'Women', noteAr: 'عبايات، تفصيل، إكسسوارات', noteEn: 'Abayas, tailoring, accessories' },
    { value: 'men' as const, ar: 'الرجال', en: 'Men', noteAr: 'ثياب، طبقات، جلد', noteEn: 'Thobes, layers, leather' },
    { value: 'girls' as const, ar: 'البنات', en: 'Girls', noteAr: 'مناسبات، طبقات ناعمة', noteEn: 'Occasion and soft layers' },
    { value: 'boys' as const, ar: 'الأولاد', en: 'Boys', noteAr: 'ثياب، بليزر، قطع يومية', noteEn: 'Thobes, blazers, everyday pieces' },
  ];

  const moments = [
    { value: 'daily' as const, ar: 'يومي', en: 'Everyday' },
    { value: 'work' as const, ar: 'عمل', en: 'Work' },
    { value: 'evening' as const, ar: 'مساء', en: 'Evening' },
    { value: 'eid' as const, ar: 'عيد', en: 'Eid' },
    { value: 'travel' as const, ar: 'سفر', en: 'Travel' },
  ];

  const palettes = [
    { value: 'neutral' as const, ar: 'محايد', en: 'Neutral', swatches: ['#111111', '#D7CDC0', '#F3EFE8'] },
    { value: 'warm' as const, ar: 'دافئ', en: 'Warm', swatches: ['#6F4E37', '#B59A73', '#D6CEBF'] },
    { value: 'deep' as const, ar: 'عميق', en: 'Deep', swatches: ['#1C1B1A', '#2B2E26', '#511D24'] },
  ];

  const priorities = [
    { value: 'balanced' as const, ar: 'توازن', en: 'Balanced', noteAr: 'عملية + حضور', noteEn: 'Utility + presence' },
    { value: 'breathable' as const, ar: 'راحة وتهوية', en: 'Breathable', noteAr: 'خامات أخف', noteEn: 'Lighter fabrication' },
    { value: 'statement' as const, ar: 'تفصيل لافت', en: 'Statement', noteAr: 'أثر بصري محسوب', noteEn: 'Controlled visual impact' },
    { value: 'tailored' as const, ar: 'دقة التفصيل', en: 'Tailored', noteAr: 'بنية وقصّة', noteEn: 'Structure + cut' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-7 flex items-center gap-2 text-xs text-[#242220]/45" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#111111]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/studio" className="hover:text-[#111111]">
            {language === 'ar' ? 'الاستوديو' : 'Studio'}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">
            {language === 'ar' ? 'جواز الأسلوب' : 'Style Passport'}
          </span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-9 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <IdCard className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.27em]">
                {language === 'ar' ? 'طبقة التخصيص' : 'PERSONALIZATION LAYER'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'عرّف رِفْعة على ذوقك، بدون أن تعطيها بيانات لا تحتاجها.'
                : 'Teach RIFAA your taste without giving it data it does not need.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#242220]/65 lg:justify-self-end">
            {language === 'ar'
              ? 'أربع تفضيلات غير حساسة تُحفظ على هذا الجهاز فقط: لمن تتسوق، المناسبة، لوحة الألوان، وأولوية الاختيار.'
              : 'Four non-sensitive preferences stay on this device only: who you shop for, the moment, palette and selection priority.'}
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <section className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-7">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-editorial text-sm text-[#B59A73]">01</span>
                <h2 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'لمن تتسوّق غالباً؟' : 'Who do you usually shop for?'}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {audiences.map((option) => {
                  const active = current.audience === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update('audience', option.value)}
                      className={
                        active
                          ? 'min-h-[92px] border border-[#111111] bg-[#111111] p-3 text-start text-white'
                          : 'min-h-[92px] border border-[#242220]/12 p-3 text-start text-[#111111] hover:border-[#511D24]/40'
                      }
                    >
                      <span className="text-xs font-bold">{language === 'ar' ? option.ar : option.en}</span>
                      <span className={active ? 'mt-1.5 block text-[9px] leading-4 text-white/50' : 'mt-1.5 block text-[9px] leading-4 text-[#242220]/45'}>
                        {language === 'ar' ? option.noteAr : option.noteEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-7">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-editorial text-sm text-[#B59A73]">02</span>
                <h2 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'ما المناسبة الأكثر شيوعاً؟' : 'Which moment appears most often?'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {moments.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update('moment', option.value)}
                    className={
                      current.moment === option.value
                        ? 'border border-[#111111] bg-[#111111] px-5 py-3 text-[11px] font-semibold text-white'
                        : 'border border-[#242220]/12 px-5 py-3 text-[11px] font-semibold text-[#242220]/65 hover:border-[#511D24]/40'
                    }
                  >
                    {language === 'ar' ? option.ar : option.en}
                  </button>
                ))}
              </div>
            </section>

            <section className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-7">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-editorial text-sm text-[#B59A73]">03</span>
                <h2 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'أي لوحة لونية أقرب لك؟' : 'Which palette feels closest?'}
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {palettes.map((option) => {
                  const active = current.palette === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update('palette', option.value)}
                      className={
                        active
                          ? 'border border-[#111111] bg-[#111111] p-3 text-white'
                          : 'border border-[#242220]/12 p-3 text-[#111111] hover:border-[#511D24]/40'
                      }
                    >
                      <div className="mb-3 flex gap-1">
                        {option.swatches.map((swatch) => (
                          <span
                            key={swatch}
                            className="h-5 flex-1 border border-black/10"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold">{language === 'ar' ? option.ar : option.en}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="border border-[#242220]/10 bg-[#FFFDFC] p-5 sm:p-7">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-editorial text-sm text-[#B59A73]">04</span>
                <h2 className="text-base font-bold text-[#111111]">
                  {language === 'ar' ? 'ما الذي يحسم قرارك؟' : 'What usually decides the piece?'}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {priorities.map((option) => {
                  const active = current.priority === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update('priority', option.value)}
                      className={
                        active
                          ? 'min-h-[86px] border border-[#111111] bg-[#111111] p-3 text-start text-white'
                          : 'min-h-[86px] border border-[#242220]/12 p-3 text-start text-[#111111] hover:border-[#511D24]/40'
                      }
                    >
                      <span className="text-[11px] font-bold">{language === 'ar' ? option.ar : option.en}</span>
                      <span className={active ? 'mt-1 block text-[9px] text-white/50' : 'mt-1 block text-[9px] text-[#242220]/45'}>
                        {language === 'ar' ? option.noteAr : option.noteEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="h-fit border border-[#242220]/10 bg-[#171615] p-6 text-white lg:sticky lg:top-28">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B59A73]">
              {isConfigured
                ? language === 'ar'
                  ? 'جوازك الحالي'
                  : 'YOUR CURRENT PASSPORT'
                : language === 'ar'
                  ? 'معاينة الجواز'
                  : 'PASSPORT PREVIEW'}
            </span>

            <div className="mt-5 border-y border-white/10 py-5">
              <IdCard className="h-7 w-7 text-[#D9D0C4]" />
              <h2 className="mt-4 text-2xl font-bold">
                {language === 'ar' ? 'أسلوب رِفْعة الشخصي' : 'Personal RIFAA Style'}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {[current.audience, current.moment, current.palette, current.priority].map((value) => (
                  <span key={value} className="border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.13em] text-white/65">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Link
                href={curatorHref}
                className="group flex min-h-11 items-center justify-between bg-white px-4 text-[11px] font-bold uppercase tracking-[0.11em] text-[#111111]"
              >
                <span>{language === 'ar' ? 'افتح المنسّق بتفضيلاتي' : 'Open Curator with my profile'}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <Link
                href={capsuleHref}
                className="group flex min-h-11 items-center justify-between border border-white/20 px-4 text-[11px] font-bold uppercase tracking-[0.11em] text-white"
              >
                <span>{language === 'ar' ? 'ابنِ كابسولتي' : 'Build my capsule'}</span>
                <Grid2X2 className="h-4 w-4 text-[#B59A73]" />
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-start gap-2">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#B59A73]" />
                <p className="text-[10px] font-light leading-5 text-white/50">
                  {language === 'ar'
                    ? 'لا نخزن قياسات جسم أو بيانات دفع أو معلومات حساسة هنا. جواز الأسلوب محفوظ على هذا المتصفح فقط.'
                    : 'No body measurements, payment data or sensitive information are stored here. Your passport stays in this browser.'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyProfileLink}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/70 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ ملف التفضيلات' : 'Copy preference link')}</span>
              </button>
              {isConfigured && (
                <button
                  type="button"
                  onClick={clearPassport}
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/45 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-12 grid gap-px border border-[#242220]/10 bg-[#242220]/10 sm:grid-cols-3">
          {[
            {
              icon: Compass,
              ar: 'ابدأ أقرب إلى ذوقك',
              en: 'Start closer to your taste',
              descAr: 'المنسّق يفتح بالقسم والمناسبة وأولوية الاختيار التي حفظتها.',
              descEn: 'Curator opens with your saved department, moment and decision priority.',
            },
            {
              icon: Grid2X2,
              ar: 'كابسولة أسرع',
              en: 'Faster capsule building',
              descAr: 'الجمهور والمناسبة وطابع الألوان ينتقلون مباشرة إلى Capsule Studio.',
              descEn: 'Audience, moment and palette flow directly into Capsule Studio.',
            },
            {
              icon: LockKeyhole,
              ar: 'تخصيص بلا مبالغة في جمع البيانات',
              en: 'Personalization without over-collection',
              descAr: 'أربع تفضيلات فقط، ولا توجد بيانات جسدية أو حساسة.',
              descEn: 'Only four preferences; no body or sensitive data is collected.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.en} className="bg-[#F7F4EF] p-6">
                <Icon className="h-4 w-4 text-[#511D24]" />
                <h3 className="mt-4 text-sm font-bold text-[#111111]">{language === 'ar' ? item.ar : item.en}</h3>
                <p className="mt-2 text-xs font-light leading-6 text-[#242220]/55">{language === 'ar' ? item.descAr : item.descEn}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
