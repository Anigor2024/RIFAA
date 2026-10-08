'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Copy, Gift, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';
import {
  DEFAULT_GIFT_PREFERENCES,
  GiftPreferences,
  findGiftRecommendations,
  giftPreferencesFromParams,
  giftPreferencesToQuery,
} from '@/lib/gifts';

const recipients = [
  { value: 'women', ar: 'لها', en: 'For her' },
  { value: 'men', ar: 'له', en: 'For him' },
  { value: 'kids', ar: 'للصغار', en: 'For little ones' },
] as const;

const occasions = [
  { value: 'eid', ar: 'العيد', en: 'Eid' },
  { value: 'celebration', ar: 'مناسبة خاصة', en: 'Celebration' },
  { value: 'gratitude', ar: 'شكر وتقدير', en: 'Thank you' },
  { value: 'everyday', ar: 'لفتة جميلة', en: 'Just because' },
] as const;

const moods = [
  { value: 'understated', ar: 'أناقة هادئة', en: 'Understated' },
  { value: 'statement', ar: 'حضور لافت', en: 'Statement' },
  { value: 'practical', ar: 'عملي ومريح', en: 'Practical' },
] as const;

const budgets = [
  { value: '1000', ar: 'حتى ١٬٠٠٠ ر.س', en: 'Up to SAR 1,000' },
  { value: '2000', ar: 'حتى ٢٬٠٠٠ ر.س', en: 'Up to SAR 2,000' },
  { value: '3500', ar: 'حتى ٣٬٥٠٠ ر.س', en: 'Up to SAR 3,500' },
  { value: 'any', ar: 'بدون سقف', en: 'No maximum' },
] as const;

type Option = { value: string; ar: string; en: string };

function ChoiceGroup({
  title,
  value,
  options,
  language,
  onChoose,
}: {
  title: string;
  value: string;
  options: readonly Option[];
  language: 'ar' | 'en';
  onChoose: (value: string) => void;
}) {
  return (
    <fieldset className="border-t border-[#242220]/10 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#242220]/70">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            aria-pressed={value === option.value}
            onClick={() => onChoose(option.value)}
            className={
              value === option.value
                ? 'min-h-11 border border-[#511D24] bg-[#511D24] px-4 py-2 text-xs font-semibold text-white'
                : 'min-h-11 border border-[#242220]/15 bg-white px-4 py-2 text-xs font-semibold text-[#242220] transition-colors hover:border-[#511D24]'
            }
          >
            {language === 'ar' ? option.ar : option.en}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function GiftAtelierPage() {
  const { language, isRtl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preferences, setPreferences] = useState<GiftPreferences>(() =>
    giftPreferencesFromParams(new URLSearchParams(searchParams.toString()))
  );
  const [copied, setCopied] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [noteCopied, setNoteCopied] = useState(false);
  const { addManyToWishlist, wishlistIds } = useWishlist();

  const recommendations = useMemo(
    () => findGiftRecommendations(preferences, 6),
    [preferences]
  );
  const spotlight = recommendations[0];
  const allSaved = recommendations.length > 0 &&
    recommendations.every(({ product }) => wishlistIds.includes(product.id));

  function update<K extends keyof GiftPreferences>(key: K, value: GiftPreferences[K]) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    router.replace('/gifts?' + giftPreferencesToQuery(next), { scroll: false });
    setCopied(false);
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + '/gifts?' + giftPreferencesToQuery(preferences)
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function copyGiftNote() {
    if (!giftNote.trim()) return;
    try {
      await navigator.clipboard.writeText(giftNote.trim());
      setNoteCopied(true);
    } catch {
      setNoteCopied(false);
    }
  }

  const nextBudget = preferences.budget === '1000' ? '2000' :
    preferences.budget === '2000' ? '3500' : 'any';

  return (
    <main className="min-h-screen bg-[#F7F4EF] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-[#242220]/55">
          <Link href="/" className="hover:text-[#511D24]">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          <Link href="/studio" className="hover:text-[#511D24]">{language === 'ar' ? 'الاستوديو' : 'Studio'}</Link>
          <span>/</span>
          <span className="font-semibold text-[#111111]">{language === 'ar' ? 'مشغل الهدايا' : 'Gift Atelier'}</span>
        </nav>

        <header className="grid gap-7 border-b border-[#242220]/10 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#511D24]">
              <Gift className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {language === 'ar' ? 'رِفْعة · فن الإهداء' : 'RIFAA · THE ART OF GIVING'}
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'هدية تشبه صاحبها، وتستحق أن تُتذكَّر.'
                : 'A gift that feels personal, and deserves to be remembered.'}
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#242220]/70">
            {language === 'ar'
              ? 'ارسم ملامح المناسبة والشخص والميزانية. سنعرض قطعًا من تشكيلة رِفْعة الفعلية مع سبب كل ترشيح وسعر واضح — بدون تخمينات أو عروض وهمية.'
              : 'Define the recipient, moment, and budget. Explore real RIFAA catalog pieces with clear prices and an explanation for each recommendation.'}
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="h-fit border border-[#242220]/10 bg-[#EEE8DE]/65 p-5 sm:p-7 lg:sticky lg:top-28">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#511D24]">
                  {language === 'ar' ? 'اصنع لحظة الإهداء' : 'DESIGN THE MOMENT'}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'أربع اختيارات بسيطة' : 'Four thoughtful choices'}
                </h2>
              </div>
              <Sparkles className="h-5 w-5 text-[#B59A73]" />
            </div>

            <ChoiceGroup
              title={language === 'ar' ? '01 · لمن الهدية؟' : '01 · RECIPIENT'}
              value={preferences.recipient} options={recipients} language={language}
              onChoose={(value) => update('recipient', value as GiftPreferences['recipient'])}
            />
            <ChoiceGroup
              title={language === 'ar' ? '02 · المناسبة' : '02 · OCCASION'}
              value={preferences.occasion} options={occasions} language={language}
              onChoose={(value) => update('occasion', value as GiftPreferences['occasion'])}
            />
            <ChoiceGroup
              title={language === 'ar' ? '03 · شخصية الهدية' : '03 · STYLE MOOD'}
              value={preferences.mood} options={moods} language={language}
              onChoose={(value) => update('mood', value as GiftPreferences['mood'])}
            />
            <ChoiceGroup
              title={language === 'ar' ? '04 · سقف الميزانية للقطعة' : '04 · PER-ITEM BUDGET'}
              value={preferences.budget} options={budgets} language={language}
              onChoose={(value) => update('budget', value as GiftPreferences['budget'])}
            />

            <div className="flex flex-wrap gap-4 border-t border-[#242220]/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  setPreferences(DEFAULT_GIFT_PREFERENCES);
                  router.replace('/gifts', { scroll: false });
                  setCopied(false);
                }}
                className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#242220]/65 hover:text-[#511D24]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {language === 'ar' ? 'إعادة الضبط' : 'Reset'}
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#511D24]"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? (language === 'ar' ? 'تم نسخ الرابط' : 'Link copied') :
                  (language === 'ar' ? 'شارك اختياراتك' : 'Share this edit')}
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            {spotlight ? (
              <section className="grid overflow-hidden bg-[#171615] text-white md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[390px] md:min-h-[520px]">
                  <ImageWithFallback src={spotlight.product.image}
                    alt={language === 'ar' ? spotlight.product.nameAr : spotlight.product.nameEn}
                    fill sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute start-4 top-4 bg-[#111111]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                    {language === 'ar' ? 'ترشيح رِفْعة الأول' : 'FIRST RIFAA SELECTION'}
                  </span>
                </div>
                <div className="flex flex-col justify-between p-6 sm:p-9">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B59A73]">
                      {language === 'ar' ? 'اختيار يتوافق مع لحظتك' : 'A THOUGHTFUL MATCH'}
                    </span>
                    <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                      {language === 'ar' ? spotlight.product.nameAr : spotlight.product.nameEn}
                    </h2>
                    <p className="mt-5 border-s-2 border-[#B59A73] ps-4 text-sm leading-7 text-white/75">
                      {language === 'ar' ? spotlight.reasonAr : spotlight.reasonEn}
                    </p>
                    <p className="mt-5 text-sm text-white/65">
                      {language === 'ar' ? spotlight.product.fabricAr : spotlight.product.fabricEn}
                    </p>
                  </div>
                  <div className="mt-8">
                    <p className="mb-4 text-2xl font-semibold">{formatPrice(spotlight.product.price, language)}</p>
                    <Link href={'/products/' + spotlight.product.slug}
                      className="group inline-flex min-h-12 items-center gap-3 bg-white px-6 py-3 text-xs font-bold text-[#111111] transition-colors hover:bg-[#EEE8DE]"
                    >
                      {language === 'ar' ? 'اكتشف تفاصيل الهدية' : 'Explore this piece'}
                      {isRtl ? <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> :
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </Link>
                  </div>
                </div>
              </section>
            ) : (
              <div className="border border-[#242220]/10 bg-white p-8 text-center sm:p-12">
                <Gift className="mx-auto h-8 w-8 text-[#B59A73]" />
                <h2 className="mt-4 text-2xl font-bold text-[#111111]">
                  {language === 'ar' ? 'لا توجد قطع ضمن الميزانية المختارة' : 'No pieces match this budget'}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#242220]/65">
                  {language === 'ar'
                    ? 'الترشيحات لا تتجاوز ميزانيتك. جرّب رفع السقف لرؤية اختيارات أكثر.'
                    : 'Recommendations never exceed your budget. Raise the limit to explore more options.'}
                </p>
                <button type="button" onClick={() => update('budget', nextBudget)}
                  className="mt-6 min-h-11 bg-[#111111] px-6 text-xs font-bold text-white hover:bg-[#511D24]"
                >
                  {language === 'ar' ? 'اعرض ميزانية أعلى' : 'Increase the budget'}
                </button>
              </div>
            )}

            {recommendations.length > 0 && (
              <section className="mt-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#242220]/10 pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#511D24]">
                      {language === 'ar' ? 'مختارات مدروسة' : 'CURATED SELECTIONS'}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-[#111111]">
                      {language === 'ar' ? 'قطع تحكي قصة مناسبة' : 'Pieces with a purpose'}
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-[#242220]/55" aria-live="polite">
                    {recommendations.length} {language === 'ar' ? 'اختيارات' : 'selections'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3">
                  {recommendations.map(({ product, reasonAr, reasonEn }) => (
                    <article key={product.id}>
                      <ProductCard product={product} />
                      <div className="mt-3 border-t border-[#242220]/10 pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#511D24]">
                          {language === 'ar' ? 'سبب الاختيار' : 'WHY IT FITS'}
                        </span>
                        <p className="mt-1 text-xs leading-5 text-[#242220]/65">
                          {language === 'ar' ? reasonAr : reasonEn}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <button type="button"
                  onClick={() => addManyToWishlist(recommendations.map(({ product }) => product.id))}
                  disabled={allSaved}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 border border-[#111111] px-6 text-xs font-bold text-[#111111] transition-colors hover:bg-[#111111] hover:text-white disabled:opacity-55"
                >
                  {allSaved ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                  {allSaved
                    ? (language === 'ar' ? 'كل المختارات محفوظة' : 'All selections saved')
                    : (language === 'ar' ? 'احفظ المختارات للمفضلة' : 'Save the selections')}
                </button>
              </section>
            )}
          </div>
        </div>

        <section className="mt-16 grid gap-8 border border-[#242220]/10 bg-[#EEE8DE]/55 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#511D24]">
              {language === 'ar' ? 'لمسة شخصية' : 'A PERSONAL TOUCH'}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
              {language === 'ar' ? 'الكلمات الجميلة جزء من الهدية.' : 'The right words are part of the gift.'}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#242220]/65">
              {language === 'ar'
                ? 'اكتب رسالة إهداء وانسخها لاستخدامها بالطريقة التي تناسبك. هذه مسودة شخصية فقط؛ لا تُرسل للمتجر ولا تُضاف تلقائيًا للطلب.'
                : 'Write and copy a personal gift note for your own use. This is a private draft only: it is not sent to the store or attached to checkout.'}
            </p>
          </div>
          <div>
            <label htmlFor="gift-note" className="mb-2 block text-xs font-semibold text-[#242220]">
              {language === 'ar' ? 'رسالة الإهداء' : 'Your gift note'}
            </label>
            <textarea
              id="gift-note" maxLength={240} rows={4} value={giftNote}
              onChange={(event) => { setGiftNote(event.target.value); setNoteCopied(false); }}
              placeholder={language === 'ar' ? 'لك كل التقدير... لأن التفاصيل الجميلة تستحق أن تُشارك.' : 'For you, with appreciation and a little something special…'}
              className="w-full resize-y border border-[#242220]/15 bg-white p-4 text-sm leading-7 text-[#111111] outline-none focus:border-[#511D24]"
            />
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-xs text-[#242220]/45">{giftNote.length}/240</span>
              <button type="button" onClick={copyGiftNote} disabled={!giftNote.trim()}
                className="inline-flex min-h-11 items-center gap-2 bg-[#111111] px-5 text-xs font-semibold text-white hover:bg-[#511D24] disabled:opacity-40"
              >
                {noteCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {noteCopied ? (language === 'ar' ? 'تم نسخ الرسالة' : 'Note copied') :
                  (language === 'ar' ? 'انسخ رسالة الإهداء' : 'Copy gift note')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
