'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Bath, BedDouble, ChartNoAxesColumnIncreasing, Check, CheckCheck, Heart, House, KeyRound, MapPin, Maximize2, RotateCcw, SlidersHorizontal, Sprout, Trees } from 'lucide-react';
import { money, properties } from '@/lib/atheeldar-data';
import { readJSON, readStoredIds, STORAGE_KEYS, subscribeStoredIds, toggleStoredId, writeJSON } from '@/lib/browser-storage';
import { DEFAULT_PROPERTY_SEARCH, writePropertySearchParams, type PropertySearchState } from '@/lib/property-search';
import {
  DEFAULT_HOME_PREFERENCES, HOME_FINDER_STORAGE_KEY, explainNoHomeMatches,
  isHomePurposeEligible, parseHomeBudget, parseHomePreferences, rankHomeMatches,
  type HomePreferences, type HomePriority, type HomePurpose,
} from '@/lib/home-matching';
import './home-finder.css';

const cities = [...new Set(properties.map(property => property.city))];
const purposeOptions = [
  { value: 'buy' as const, label: 'شراء منزل', Icon: House },
  { value: 'rent' as const, label: 'استئجار منزل', Icon: KeyRound },
  { value: 'invest' as const, label: 'استثمار عقاري', Icon: ChartNoAxesColumnIncreasing },
];
const stepTitles = ['ما خطوتك القادمة؟', 'أي مدينة تشبه يومك؟', 'ما الميزانية المناسبة لك؟', 'ما الذي يهمك في العقار؟'];

function freshPreferences(): HomePreferences {
  return { ...DEFAULT_HOME_PREFERENCES, priorities: [] };
}

function resultsHref(preferences: HomePreferences): string {
  const search: PropertySearchState = {
    ...DEFAULT_PROPERTY_SEARCH,
    city: preferences.city as PropertySearchState['city'],
    purpose: preferences.purpose === 'rent' ? 'للإيجار' : 'للبيع',
    max: preferences.maxBudget,
    beds: preferences.minBeds,
    residentialOnly: preferences.purpose !== 'invest',
    quick: preferences.purpose === 'invest' ? 'استثماري' : 'الكل',
    sort: 'priceLow',
  };
  return `/properties?${writePropertySearchParams(search).toString()}`;
}

export function HomeFinder({ variant = 'embedded' }: { variant?: 'embedded' | 'page' }) {
  const instanceId = useId();
  const [draft, setDraft] = useState<HomePreferences>(freshPreferences);
  const [budgetInput, setBudgetInput] = useState(String(DEFAULT_HOME_PREFERENCES.maxBudget));
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<HomePreferences | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [storageStatus, setStorageStatus] = useState<'saved' | 'session' | 'restored' | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const Heading = variant === 'page' ? 'h1' : 'h2';

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = parseHomePreferences(readJSON<unknown>(HOME_FINDER_STORAGE_KEY, null), cities);
      if (saved) {
        setDraft(saved);
        setBudgetInput(String(saved.maxBudget));
        setCompleted(saved);
        setStorageStatus('restored');
      }
      setFavorites(readStoredIds(STORAGE_KEYS.favorites));
      setHydrated(true);
    }, 0);
    const unsubscribe = subscribeStoredIds(() => setFavorites(readStoredIds(STORAGE_KEYS.favorites)));
    return () => { window.clearTimeout(timer); unsubscribe(); };
  }, []);

  const matches = useMemo(() => completed ? rankHomeMatches(properties, completed) : [], [completed]);
  const noMatches = completed && !matches.length ? explainNoHomeMatches(properties, completed) : null;
  const purposeLabel = purposeOptions.find(option => option.value === (completed ?? draft).purpose)?.label;
  const rental = draft.purpose === 'rent';

  function goToStep(nextStep: number) {
    setCompleted(null);
    setStep(nextStep);
    setError('');
    setNotice('');
    window.setTimeout(() => stepHeading.current?.focus(), 0);
  }

  function changePurpose(purpose: HomePurpose) {
    if (purpose === draft.purpose) return;
    const maxBudget = purpose === 'rent' ? 180_000 : 4_000_000;
    setDraft(current => ({ ...current, purpose, maxBudget, minBeds: purpose === 'invest' ? 0 : 3 }));
    setBudgetInput(String(maxBudget));
  }

  function togglePriority(priority: HomePriority) {
    setDraft(current => ({ ...current, priorities: current.priorities.includes(priority)
      ? current.priorities.filter(item => item !== priority) : [...current.priorities, priority] }));
  }

  function saveResults(preferences: HomePreferences, message = '') {
    const result = writeJSON(HOME_FINDER_STORAGE_KEY, preferences);
    setDraft(preferences);
    setBudgetInput(String(preferences.maxBudget));
    setCompleted(preferences);
    setStorageStatus(result.persisted ? 'saved' : 'session');
    setNotice(message);
    window.setTimeout(() => resultsHeading.current?.focus(), 0);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 2) {
      const maxBudget = parseHomeBudget(budgetInput);
      if (maxBudget === null) {
        setError('اكتب مبلغًا صحيحًا أكبر من صفر وبحد أقصى مليار ريال.');
        return;
      }
      setDraft(current => ({ ...current, maxBudget }));
    }
    setError('');
    if (step < 3) {
      setStep(current => current + 1);
      window.setTimeout(() => stepHeading.current?.focus(), 0);
    } else {
      saveResults(draft);
    }
  }

  function restart() {
    const next = freshPreferences();
    writeJSON(HOME_FINDER_STORAGE_KEY, null);
    setDraft(next);
    setBudgetInput(String(next.maxBudget));
    setStorageStatus(null);
    goToStep(0);
  }

  function toggleFavorite(slug: string, title: string) {
    const result = toggleStoredId(STORAGE_KEYS.favorites, slug);
    setFavorites(result.items);
    setNotice(`${result.added ? 'حُفظ' : 'أُزيل'} ${title} ${result.added ? 'في' : 'من'} المفضلة.${result.persisted ? '' : ' الحفظ متاح لهذه الزيارة فقط.'}`);
  }

  return <section id="home-finder" className={`at-finder at-finder--${variant}`} aria-labelledby={`${instanceId}-title`}>
    {variant === 'page' && <nav className="at-finder-breadcrumb" aria-label="مسار الصفحة">
      <Link href="/">الرئيسية</Link><span aria-hidden="true">/</span><span>دليلك إلى المنزل</span>
    </nav>}
    <div className="at-finder-band">
      <div className="at-finder-inner">
        <div className="at-finder-intro">
          <span className="at-finder-eyebrow">دليلك إلى الاختيار</span>
          <Heading id={`${instanceId}-title`}>دعنا نبدأ بما يشبهك.</Heading>
          <p>أجب عن أربعة أسئلة، واكتشف خيارات تناسب يومك وميزانيتك.</p>
          {variant === 'page' && <div className="at-finder-intro-note"><CheckCheck size={18} aria-hidden="true" /> أسباب واضحة لكل اقتراح، وقرار الاختيار لك.</div>}
        </div>
        <div className="at-finder-panel" aria-busy={!hydrated}>
          {!hydrated ? <div className="at-finder-loading" role="status">
            <div className="at-finder-loading-line" aria-hidden="true" />
            <div className="at-finder-loading-options" aria-hidden="true"><i /><i /><i /></div>
            <span>نجهز خياراتك…</span>
          </div> : completed ? <div className="at-finder-summary">
            <div className="at-finder-summary-top"><span><CheckCheck size={18} aria-hidden="true" /> تفضيلاتك جاهزة</span><button type="button" onClick={restart}><RotateCcw size={15} aria-hidden="true" /> ابدأ من جديد</button></div>
            <h3>كل اختيار يقرّبك أكثر.</h3>
            <p>اضغط على أي إجابة لتعديلها.</p>
            <div className="at-finder-summary-chips">
              <button type="button" onClick={() => goToStep(0)} aria-label={`تعديل الهدف: ${purposeLabel}`}>{purposeLabel}</button>
              <button type="button" onClick={() => goToStep(1)} aria-label={`تعديل المدينة: ${completed.city}`}><MapPin size={14} aria-hidden="true" /> {completed.city}</button>
              <button type="button" onClick={() => goToStep(2)} aria-label="تعديل الحد الأقصى للميزانية">حتى {money(completed.maxBudget)} ر.س{completed.purpose === 'rent' ? ' / سنة' : ''}</button>
              <button type="button" onClick={() => goToStep(3)} aria-label="تعديل عدد الغرف والأولويات">{completed.minBeds ? `${money(completed.minBeds)} غرف فأكثر` : 'عدد الغرف مرن'}{completed.priorities.length ? ' + تفضيلات' : ''}</button>
            </div>
            <small className="at-finder-storage-note">{storageStatus === 'session' ? 'تفضيلاتك متاحة لهذه الزيارة؛ تعذّر حفظها على الجهاز.' : storageStatus === 'restored' ? 'استعدنا آخر تفضيلاتك، ويمكنك تحديثها في أي وقت.' : 'حُفظت تفضيلاتك على هذا الجهاز.'}</small>
          </div> : <form onSubmit={submit} aria-labelledby={`${instanceId}-step-title`} noValidate>
            <div className="at-finder-step" key={step}>
              <h3 id={`${instanceId}-step-title`} tabIndex={-1} ref={stepHeading}>{stepTitles[step]}</h3>
              {step === 0 && <>
                <fieldset className="at-finder-options at-finder-purpose-options">
                  <legend className="at-finder-sr-only">اختر هدفك من البحث</legend>
                  {purposeOptions.map(({ value, label, Icon }) => <label className="at-finder-choice" key={value}>
                    <input type="radio" name={`${instanceId}-purpose`} value={value} checked={draft.purpose === value} onChange={() => changePurpose(value)} />
                    <span><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><b>{label}</b></span>
                  </label>)}
                </fieldset>
                {draft.purpose === 'invest' && <p className="at-finder-help">شراء أصل استثماري؛ يشمل الأراضي والمكاتب المصنفة للاستثمار والمعروضة للبيع.</p>}
              </>}
              {step === 1 && <fieldset className="at-finder-options at-finder-city-options">
                <legend className="at-finder-sr-only">اختر المدينة</legend>
                {cities.map(city => {
                  const count = properties.filter(property => property.city === city && isHomePurposeEligible(property, draft.purpose)).length;
                  return <label className="at-finder-choice" key={city}>
                    <input type="radio" name={`${instanceId}-city`} value={city} checked={draft.city === city} onChange={() => setDraft(current => ({ ...current, city }))} />
                    <span><b><MapPin size={16} aria-hidden="true" />{city}</b><small>{count ? `خيارات لهذا الهدف: ${money(count)}` : 'لا توجد خيارات لهذا الهدف حاليًا'}</small></span>
                  </label>;
                })}
              </fieldset>}
              {step === 2 && <div className="at-finder-budget">
                <label htmlFor={`${instanceId}-budget`}>{rental ? 'الحد الأقصى للإيجار السنوي' : 'الحد الأقصى لسعر الشراء'}</label>
                <div className={`at-finder-input-wrap${error ? ' at-finder-input-error' : ''}`}>
                  <input id={`${instanceId}-budget`} type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={budgetInput} maxLength={20}
                    aria-invalid={Boolean(error)} aria-describedby={`${instanceId}-budget-help${error ? ` ${instanceId}-error` : ''}`}
                    onChange={event => { setBudgetInput(event.target.value); setError(''); }} />
                  <span>ر.س{rental ? ' / سنة' : ''}</span>
                </div>
                <div className="at-finder-budget-presets" aria-label="ميزانيات مقترحة">
                  {(rental ? [100_000, 180_000, 300_000] : [2_000_000, 4_000_000, 7_000_000]).map(amount => <button type="button" key={amount} aria-pressed={parseHomeBudget(budgetInput) === amount} onClick={() => { setBudgetInput(String(amount)); setError(''); }}>{money(amount)} ر.س</button>)}
                </div>
                <p className="at-finder-help" id={`${instanceId}-budget-help`}>{rental ? 'المبلغ لسنة كاملة، حتى تقارن الإيجارات على أساس واحد.' : 'نقارن بالسعر المعلن للعقار؛ لا يشمل هذا الحد تكاليف الشراء الإضافية.'}</p>
              </div>}
              {step === 3 && <div className="at-finder-needs">
                <div className="at-finder-bedroom-row"><label htmlFor={`${instanceId}-beds`}><BedDouble size={19} aria-hidden="true" /> الحد الأدنى لغرف النوم</label>
                  <select id={`${instanceId}-beds`} value={draft.minBeds} onChange={event => setDraft(current => ({ ...current, minBeds: Number(event.target.value) }))}>
                    <option value={0}>لا يشترط</option>{Array.from({ length: 10 }, (_, index) => index + 1).map(beds => <option key={beds} value={beds}>{money(beds)} غرف فأكثر</option>)}
                  </select>
                </div>
                {draft.purpose === 'invest' && <p className="at-finder-help">لاختيار أرض أو مكتب، اترك عدد غرف النوم «لا يشترط».</p>}
                <fieldset className="at-finder-priorities">
                  <legend>وما التفاصيل التي تفضّلها؟ <small>اختياري</small></legend>
                  <label className="at-finder-choice"><input type="checkbox" checked={draft.priorities.includes('newBuild')} onChange={() => togglePriority('newBuild')} /><span><Sprout size={20} aria-hidden="true" /><b>بناء جديد</b><Check size={16} className="at-finder-choice-check" aria-hidden="true" /></span></label>
                  <label className="at-finder-choice"><input type="checkbox" checked={draft.priorities.includes('privacy')} onChange={() => togglePriority('privacy')} /><span><Trees size={20} aria-hidden="true" /><b>مساحات للخصوصية</b><Check size={16} className="at-finder-choice-check" aria-hidden="true" /></span></label>
                </fieldset>
                <p className="at-finder-help">نقدّم هذه التفضيلات في الترتيب عندما تذكرها بيانات العقار؛ تبقى المدينة والميزانية والغرف شروطًا أساسية.</p>
              </div>}
            </div>
            {error && <p className="at-finder-error" id={`${instanceId}-error`} role="alert">{error}</p>}
            <div className="at-finder-form-footer">
              <div className="at-finder-progress" role="progressbar" aria-label="التقدم في اختيار العقار" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-valuetext={`الخطوة ${step + 1} من 4: ${stepTitles[step]}`}>
                <span>{step + 1} من 4</span><div className="at-finder-progress-track" aria-hidden="true"><i style={{ width: `${(step + 1) * 25}%` }} /></div>
              </div>
              <div className="at-finder-step-actions">
                {step > 0 && <button type="button" className="at-finder-back" onClick={() => goToStep(step - 1)} aria-label="العودة إلى السؤال السابق"><ArrowRight size={18} aria-hidden="true" /><span>السابق</span></button>}
                <button type="submit" className="at-finder-primary">{step === 3 ? 'اكتشف خياراتي' : 'التالي'}<ArrowLeft size={18} aria-hidden="true" /></button>
              </div>
            </div>
          </form>}
        </div>
      </div>
    </div>
    <div className="at-finder-announcement at-finder-sr-only" role="status" aria-live="polite">{notice}</div>
    {completed && <div className="at-finder-results">
      <div className="at-finder-results-inner">
        <div className="at-finder-results-head">
          <div><span className="at-finder-eyebrow">بناءً على إجاباتك</span><h2 tabIndex={-1} ref={resultsHeading}>{matches.length ? 'خيارات تحقق شروطك.' : 'لنوسّع البحث، على طريقتك.'}</h2>
            {matches.length > 0 && <p>وجدنا {money(matches.length)} من العقارات المعروضة. قدّمنا ما يحقق تفضيلاتك، ثم السعر الأقل.</p>}</div>
          <button type="button" className="at-finder-text-button" onClick={() => goToStep(0)}><SlidersHorizontal size={17} aria-hidden="true" /> تعديل إجاباتي</button>
        </div>
        {notice && <p className="at-finder-visible-notice">{notice}</p>}
        {matches.length > 0 ? <>
          <div className="at-finder-result-grid">
            {matches.slice(0, 3).map(({ property, reasons }) => <article className="at-finder-result-card" key={property.slug} aria-labelledby={`${instanceId}-${property.slug}`}>
              <div className="at-finder-result-media"><Link href={`/properties/${property.slug}`}><img src={property.image} alt={property.title} loading="lazy" decoding="async" /></Link>
                <span>{property.purpose}</span><button type="button" onClick={() => toggleFavorite(property.slug, property.title)} aria-pressed={favorites.includes(property.slug)} aria-label={`${favorites.includes(property.slug) ? 'إزالة' : 'حفظ'} ${property.title} ${favorites.includes(property.slug) ? 'من' : 'في'} المفضلة`}><Heart size={19} fill={favorites.includes(property.slug) ? 'currentColor' : 'none'} aria-hidden="true" /></button>
              </div>
              <div className="at-finder-result-body"><h3 id={`${instanceId}-${property.slug}`}><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3><p className="at-finder-result-location"><MapPin size={15} aria-hidden="true" />{property.city} · {property.district} · {property.type}</p>
                <div className="at-finder-result-specs">{property.beds > 0 && <span><BedDouble size={16} aria-hidden="true" />{money(property.beds)} غرف</span>}{property.baths > 0 && <span><Bath size={16} aria-hidden="true" />{money(property.baths)} حمامات</span>}<span><Maximize2 size={15} aria-hidden="true" />{money(property.area)} م²</span></div>
                <div className="at-finder-reasons"><b>لماذا هذا العقار؟</b><ul>{reasons.map(reason => <li key={reason}><Check size={14} aria-hidden="true" />{reason}</li>)}</ul></div>
                <div className="at-finder-result-bottom"><strong>{money(property.price)} ر.س<small>{property.purpose === 'للإيجار' ? ' / سنة' : ''}</small></strong><Link href={`/properties/${property.slug}`}>التفاصيل<ArrowLeft size={16} aria-hidden="true" /></Link></div>
              </div>
            </article>)}
          </div>
          <div className="at-finder-results-footer"><Link className="at-finder-primary" href={resultsHref(completed)}>افتح البحث بهذه الشروط<ArrowLeft size={17} aria-hidden="true" /></Link><Link href="/account#favorites" className="at-finder-text-button"><Heart size={16} aria-hidden="true" /> عرض المفضلة</Link></div>
          <p className="at-finder-catalogue-note">تستند الاقتراحات إلى تفاصيل العقارات المعروضة. تظهر الأولويات في أسباب الاقتراح عندما تتوافر معلومات تؤيدها.</p>
        </> : noMatches && <div className="at-finder-empty">
          <div className="at-finder-empty-icon"><House size={32} strokeWidth={1.3} aria-hidden="true" /></div><p>{noMatches.message}</p>
          <div className="at-finder-relaxations">
            {noMatches.suggestedBudget !== undefined && <button type="button" onClick={() => saveResults({ ...completed, maxBudget: noMatches.suggestedBudget! }, `عُدّلت الميزانية باختيارك إلى ${money(noMatches.suggestedBudget!)} ر.س${completed.purpose === 'rent' ? ' سنويًا' : ''}.`)}>ارفع الميزانية إلى {money(noMatches.suggestedBudget)} ر.س{completed.purpose === 'rent' ? ' / سنة' : ''}<ArrowLeft size={16} aria-hidden="true" /></button>}
            {noMatches.suggestedMinBeds !== undefined && <button type="button" onClick={() => saveResults({ ...completed, minBeds: noMatches.suggestedMinBeds! }, noMatches.suggestedMinBeds === 0 ? 'أُلغي شرط عدد الغرف باختيارك.' : `عُدّل الحد الأدنى باختيارك إلى ${money(noMatches.suggestedMinBeds!)} غرف.`)}>{noMatches.suggestedMinBeds === 0 ? 'جرّب دون شرط عدد الغرف' : `جرّب ${money(noMatches.suggestedMinBeds)} غرف بدلًا من ${money(completed.minBeds)}`}<ArrowLeft size={16} aria-hidden="true" /></button>}
          </div>
          <div className="at-finder-empty-actions"><button type="button" className="at-finder-text-button" onClick={() => goToStep(1)}>تعديل المدينة</button><button type="button" className="at-finder-text-button" onClick={() => goToStep(2)}>تعديل الميزانية</button><button type="button" className="at-finder-text-button" onClick={() => goToStep(3)}>تعديل الغرف والتفضيلات</button></div>
        </div>}
      </div>
    </div>}
  </section>;
}
