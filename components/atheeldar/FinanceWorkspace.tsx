'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowUpRight, Calculator, Check, ChevronDown, CircleHelp, Coins, Landmark, RotateCcw, Save, SlidersHorizontal, Trash2, Wallet } from 'lucide-react';
import { properties, type Property } from '@/lib/atheeldar-data';
import { readJSON, subscribeStoredIds, writeJSON } from '@/lib/browser-storage';
import {
  calculateFinance, DEFAULT_FINANCE_INPUTS, FINANCE_SCENARIOS_KEY, financeDraft,
  getFinancePropertyPrefill, parseFinanceNumber, parseFinanceScenarios, validateFinanceDraft,
  type FinanceCalculation, type FinanceDraft, type FinanceErrors, type FinanceField, type FinanceScenario,
} from '@/lib/finance-model';
import './finance-workspace.css';

const currency = (number: number) => new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(Math.round(number));
const decimal = (number: number) => new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 1 }).format(number);
const slotLabel = (slot: 'a' | 'b') => slot === 'a' ? 'أ' : 'ب';

function Amount({ value, small = false }: { value: number; small?: boolean }) {
  return <span className={`af-amount ${small ? 'af-amount-small' : ''}`}><bdi>{currency(value)}</bdi><small>ر.س</small></span>;
}

function NumberField({ id, name, label, unit = 'ر.س', draft, errors, onChange, hint }: {
  id: string; name: FinanceField; label: string; unit?: string; draft: FinanceDraft; errors: FinanceErrors;
  onChange: (name: FinanceField, value: string) => void; hint?: string;
}) {
  const inputId = `${id}-${name}`;
  const error = errors[name];
  return <div className={`af-field ${error ? 'af-field-invalid' : ''}`}>
    <label htmlFor={inputId}>{label}</label>
    <div className="af-number-input"><input id={inputId} name={name} type="text" inputMode={name === 'years' ? 'numeric' : 'decimal'} value={draft[name]} onChange={event => onChange(name, event.target.value)} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}/><span aria-hidden="true">{unit}</span></div>
    {error ? <p id={`${inputId}-error`} className="af-field-error">{error}</p> : hint ? <p id={`${inputId}-hint`} className="af-field-hint">{hint}</p> : null}
  </div>;
}

function FinanceSummary({ result }: { result: FinanceCalculation }) {
  const withinBudget = result.monthlyHousingCost + result.input.monthlyDebts <= result.budgetLimit;
  const target = result.affordablePrice === null ? null : Math.floor(result.affordablePrice);
  return <aside id="finance-result" className="af-result" aria-labelledby="af-result-title">
    <div className="af-payment-panel">
      <div className="af-result-eyebrow"><Landmark size={18}/><span>صورتك المالية</span></div>
      <h2 id="af-result-title">{result.principal > 0 ? 'القسط الشهري التقديري' : 'شراء دون تمويل'}</h2>
      <div className="af-payment"><Amount value={result.monthlyPayment}/><span>/ شهر</span></div>
      <p>{result.principal > 0 ? `${decimal(result.input.years)} سنة · نسبة اسمية ثابتة ${decimal(result.input.annualRate)}٪` : 'تغطي الدفعة الأولى كامل سعر العقار.'}</p>
      <div className="af-payment-parts"><span>مبلغ التمويل<b><Amount value={result.principal} small/></b></span><span>السيولة عند الشراء<b><Amount value={result.upfrontRequired} small/></b></span></div>
    </div>
    <div className="af-result-body">
      <dl className="af-result-lines"><div><dt>القسط + التشغيل والصيانة</dt><dd><Amount value={result.monthlyHousingCost} small/><small>/ شهر</small></dd></div><div><dt>إجمالي تكلفة التمويل</dt><dd><Amount value={result.totalFinanceCost} small/></dd></div><div><dt>إجمالي المصروفات المدخلة</dt><dd><Amount value={result.input.upfrontCosts + result.totalOwnershipCosts} small/></dd></div><div className="af-result-total"><dt>إجمالي الشراء والتمويل والمصروفات<small>خلال {decimal(result.input.years)} سنة</small></dt><dd><Amount value={result.allInCost} small/></dd></div></dl>
      <div className={`af-income ${result.allocationRatio !== null && !withinBudget ? 'af-income-over' : ''}`}>
        <div className="af-income-heading"><span>السكن والالتزامات من الدخل</span><strong>{result.allocationRatio === null ? '—' : `${decimal(result.allocationRatio)}٪`}</strong></div>
        {result.allocationRatio !== null ? <><div className="af-income-track" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.max(0, result.allocationRatio))}%` }}/><span style={{ insetInlineStart: `${result.input.budgetShare}%` }}/></div><p>{withinBudget ? 'ضمن النسبة التي خصصتها.' : 'يتجاوز النسبة التي خصصتها.'} حدك المختار {decimal(result.input.budgetShare)}٪.</p><div className="af-income-left"><span>{result.remainingIncome < 0 ? 'العجز الشهري' : 'المتبقي قبل المعيشة والادخار'}</span><Amount value={Math.abs(result.remainingIncome)} small/></div></> : <p>أدخل دخلًا أكبر من صفر لعرض نسبة الالتزامات والميزانية المستهدفة.</p>}
      </div>
      {target !== null && target > 0 ? <div className="af-target"><span>سعر مستهدف بالقسط الذي خصصته</span><strong><Amount value={target}/></strong><p>مع الدفعة الأولى نفسها: {currency(result.input.downPayment)} ر.س. {result.availablePayment === 0 ? 'لا يتبقى قسط ضمن حدك الحالي؛ يعتمد هذا السعر على الدفعة النقدية فقط.' : 'بعد طرح الأقساط الحالية والتشغيل من تخصيصك الشهري.'}{result.affordablePriceCapped && ' يظهر حد الحساب الأقصى: مليار ريال.'}</p><Link className="af-button" href={`/properties?purpose=sale&max=${target}&sort=priceLow`}>استكشف عقارات ضمن هذا السعر<ArrowLeft size={18}/></Link></div> : <Link className="af-button af-search-current" href={`/properties?purpose=sale&max=${Math.floor(result.input.price)}&sort=priceLow`}>ابحث ضمن سعر العقار الحالي<ArrowLeft size={18}/></Link>}
      <a href="#finance-scenarios" className="af-result-save"><Save size={17}/>احفظ خطتك وقارن خيارًا آخر<ArrowLeft size={16}/></a>
    </div>
  </aside>;
}

type ScenarioWithResult = FinanceScenario & { result: FinanceCalculation };

function ScenarioComparison({ scenarios, onLoad, onRemove }: { scenarios: FinanceScenario[]; onLoad: (scenario: FinanceScenario) => void; onRemove: (slot: 'a' | 'b') => void }) {
  const slots = (['a', 'b'] as const).map(slot => {
    const scenario = scenarios.find(item => item.slot === slot);
    if (!scenario) return null;
    const result = calculateFinance(scenario.input);
    return result.ok ? { ...scenario, result } as ScenarioWithResult : null;
  });
  const [first, second] = slots;
  const rows: { title: string; value: (scenario: ScenarioWithResult) => React.ReactNode }[] = [
    { title: 'سعر العقار', value: scenario => <Amount value={scenario.input.price} small/> },
    { title: 'الدفعة الأولى', value: scenario => <Amount value={scenario.input.downPayment} small/> },
    { title: 'المدة / النسبة الاسمية', value: scenario => `${decimal(scenario.input.years)} سنة / ${decimal(scenario.input.annualRate)}٪` },
    { title: 'القسط الشهري', value: scenario => <Amount value={scenario.result.monthlyPayment} small/> },
    { title: 'القسط والتشغيل شهريًا', value: scenario => <Amount value={scenario.result.monthlyHousingCost} small/> },
    { title: 'السيولة عند الشراء', value: scenario => <Amount value={scenario.result.upfrontRequired} small/> },
    { title: 'إجمالي تكلفة التمويل', value: scenario => <Amount value={scenario.result.totalFinanceCost} small/> },
    { title: 'إجمالي الشراء والتمويل والمصروفات', value: scenario => <Amount value={scenario.result.allInCost} small/> },
  ];
  if (!first && !second) return <div className="af-scenarios-empty"><span><SlidersHorizontal size={28}/></span><div><h3>قرار أوضح عندما ترى الخيارين معًا.</h3><p>احفظ السيناريو أ، غيّر الدفعة أو المدة، ثم احفظ السيناريو ب لترى أثر كل اختيار.</p></div></div>;
  const monthlyDifference = first && second ? first.result.monthlyHousingCost - second.result.monthlyHousingCost : 0;
  const totalDifference = first && second ? first.result.allInCost - second.result.allInCost : 0;
  return <>
    {first && second && <div className="af-comparison-insights"><p><Wallet size={21}/><span>{Math.abs(monthlyDifference) < 0.5 ? 'التكلفة الشهرية متساوية بين الخيارين.' : <>السيناريو <b>{monthlyDifference < 0 ? 'أ' : 'ب'}</b> أقل شهريًا بـ <b>{currency(Math.abs(monthlyDifference))} ر.س</b></>}</span></p><p><Coins size={21}/><span>{Math.abs(totalDifference) < 0.5 ? 'التكلفة الإجمالية متساوية بين الخيارين.' : <>السيناريو <b>{totalDifference < 0 ? 'أ' : 'ب'}</b> أقل إجمالًا بـ <b>{currency(Math.abs(totalDifference))} ر.س</b></>}</span></p></div>}
    <p className="af-mobile-table-hint"><ArrowLeftRight size={17}/>مرّر الجدول أفقيًا لرؤية الخيارين.</p>
    <div className="af-table-wrap" role="region" aria-label="جدول مقارنة سيناريوهَي التمويل" tabIndex={0}><table className="af-comparison-table"><caption className="af-sr-only">مقارنة خطتين بحسب مدخلاتك المحفوظة على هذا الجهاز</caption><thead><tr><th scope="col">تفاصيل المقارنة</th>{slots.map((scenario, index) => <th scope="col" key={index}><small>السيناريو {index === 0 ? 'أ' : 'ب'}</small><b>{scenario?.name ?? 'بانتظار خطتك'}</b>{scenario && <div className="af-scenario-actions"><button type="button" onClick={() => onLoad(scenario)}><RotateCcw size={15}/>تحميل للتعديل</button><button type="button" aria-label={`حذف السيناريو ${index === 0 ? 'أ' : 'ب'}`} onClick={() => onRemove(scenario.slot)}><Trash2 size={15}/></button></div>}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.title}><th scope="row">{row.title}</th>{slots.map((scenario, index) => <td key={index}>{scenario ? row.value(scenario) : '—'}</td>)}</tr>)}</tbody></table></div>
    <p className="af-table-note">قارن القسط والسيولة والتكلفة معًا. اختلاف مدة السيناريوهين يغيّر أيضًا عدد أشهر التشغيل والصيانة المحتسبة.</p>
  </>;
}

export function FinanceWorkspace({ property, propertyNotice }: { property?: Property; propertyNotice?: string }) {
  const initial = getFinancePropertyPrefill(property) ?? DEFAULT_FINANCE_INPUTS;
  const id = useId();
  const [draft, setDraft] = useState(() => financeDraft(initial));
  const [propertySlug, setPropertySlug] = useState<string | undefined>(property?.slug);
  const [scenarioName, setScenarioName] = useState(property ? `خطة ${property.title}` : 'خطتي الأولى');
  const [scenarios, setScenarios] = useState<FinanceScenario[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('');
  const calculatorHeading = useRef<HTMLHeadingElement>(null);
  const linkedProperty = properties.find(item => item.slug === propertySlug && item.purpose === 'للبيع');
  const validation = useMemo(() => validateFinanceDraft(draft), [draft]);
  const result = useMemo(() => validation.ok ? calculateFinance(validation.input) : validation, [validation]);
  const errors = result.ok ? {} : result.errors;
  const validPrice = parseFinanceNumber(draft.price);
  const downPercentage = result.ok ? result.input.downPayment / result.input.price * 100 : null;

  useEffect(() => {
    const read = () => setScenarios(parseFinanceScenarios(readJSON<unknown>(FINANCE_SCENARIOS_KEY, [])));
    const timer = window.setTimeout(() => { read(); setHydrated(true); }, 0);
    const unsubscribe = subscribeStoredIds(read);
    return () => { window.clearTimeout(timer); unsubscribe(); };
  }, []);

  function change(name: FinanceField, value: string) {
    setDraft(current => ({ ...current, [name]: value }));
  }

  function saveScenario(slot: 'a' | 'b') {
    if (!result.ok) return;
    const name = scenarioName.trim().slice(0, 50);
    if (!name) { setNotice('اكتب اسمًا قصيرًا للخطة قبل حفظها.'); return; }
    const scenario: FinanceScenario = {
      version: 1, slot, name, savedAt: new Date().toISOString(), input: result.input,
      ...(linkedProperty ? { propertySlug: linkedProperty.slug } : {}),
    };
    const current = parseFinanceScenarios(readJSON<unknown>(FINANCE_SCENARIOS_KEY, []));
    const next = parseFinanceScenarios([...current.filter(item => item.slot !== slot), scenario]);
    const saved = writeJSON(FINANCE_SCENARIOS_KEY, next);
    setScenarios(next);
    setNotice(saved.persisted ? `حُفظ السيناريو ${slotLabel(slot)} على هذا الجهاز. يمكنك تغيير الأرقام وحفظ خيار آخر.` : `حُفظ السيناريو ${slotLabel(slot)} لهذه الزيارة فقط؛ التخزين الدائم غير متاح في متصفحك.`);
  }

  function removeScenario(slot: 'a' | 'b') {
    const current = parseFinanceScenarios(readJSON<unknown>(FINANCE_SCENARIOS_KEY, []));
    const next = current.filter(item => item.slot !== slot);
    const saved = writeJSON(FINANCE_SCENARIOS_KEY, next);
    setScenarios(next);
    setNotice(saved.persisted ? `حُذف السيناريو ${slotLabel(slot)} من محفوظات هذا الجهاز.` : `حُذف السيناريو ${slotLabel(slot)} لهذه الزيارة. تعذّر تحديث التخزين الدائم.`);
  }

  function loadScenario(scenario: FinanceScenario) {
    setDraft(financeDraft(scenario.input));
    setPropertySlug(scenario.propertySlug);
    setScenarioName(scenario.name);
    setNotice(`تم تحميل «${scenario.name}» للتعديل. تبقى النسخة المحفوظة كما هي حتى تختار تحديثها.`);
    calculatorHeading.current?.focus();
    calculatorHeading.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  return <div className="af-workspace">
    <header className="af-page-header"><nav aria-label="مسار الصفحة"><Link href="/tools">أدوات القرار</Link><span>/</span><span aria-current="page">التمويل</span></nav><div className="af-page-heading"><div><p className="af-eyebrow"><Calculator size={17}/>مساحة التمويل</p><h1>احسبها على راحتك.</h1><p>شاهد أثر الدفعة والمدة على قسطك، وقارن خطتين قبل اختيار عقارك.</p></div><a href="#finance-scenarios" className="af-outline-button">مقارنة سيناريوهين<ArrowLeft size={18}/></a></div></header>
    {propertyNotice && <p className="af-property-notice" role="status"><CircleHelp size={19}/>{propertyNotice}</p>}
    <div className="af-main-grid">
      <section className="af-calculator" aria-labelledby="af-calculator-title">
        <div className="af-section-heading"><span className="af-section-number">01</span><div><h2 id="af-calculator-title" ref={calculatorHeading} tabIndex={-1}>أرقام خطتك</h2><p>كل تعديل ينعكس مباشرة على النتيجة.</p></div><button type="button" className="af-reset" onClick={() => { setDraft(financeDraft(initial)); setPropertySlug(property?.slug); setNotice('أُعيدت أرقام الحاسبة إلى نقطة البداية. محفوظاتك لم تتغير.'); }} aria-label="إعادة أرقام الحاسبة إلى البداية" title="إعادة الأرقام"><RotateCcw size={19}/></button></div>
        {linkedProperty ? <div className="af-linked-property"><Image src={linkedProperty.image} alt="" width={96} height={76}/><div><small>بدأت من سعر هذا العقار</small><Link href={`/properties/${linkedProperty.slug}`}>{linkedProperty.title}<ArrowUpRight size={16}/></Link><span>{linkedProperty.city} · {linkedProperty.district}</span></div><span className="af-linked-price"><Amount value={linkedProperty.price} small/></span></div> : <div className="af-start-note"><Landmark size={20}/><p>ابدأ بسعرك المستهدف، أو <Link href="/properties?purpose=sale">اختر عقارًا من الكتالوج</Link>.</p></div>}
        <div className="af-fields-grid"><NumberField id={id} name="price" label="سعر العقار" draft={draft} errors={errors} onChange={change}/><NumberField id={id} name="downPayment" label="الدفعة الأولى" draft={draft} errors={errors} onChange={change} hint={downPercentage === null ? undefined : `${decimal(downPercentage)}٪ من سعر العقار`}/></div>
        <div className="af-down-presets"><span>جرّب دفعة</span>{[10, 20, 30, 50].map(percentage => <button type="button" key={percentage} disabled={!validPrice || validPrice <= 0 || validPrice > 1_000_000_000} aria-pressed={downPercentage !== null && Math.abs(downPercentage - percentage) < 0.001} onClick={() => validPrice && change('downPayment', String(Math.round(validPrice * percentage / 100)))}>{decimal(percentage)}٪</button>)}</div>
        <div className="af-fields-grid"><NumberField id={id} name="years" label="مدة التمويل" unit="سنة" draft={draft} errors={errors} onChange={change} hint="من سنة إلى ٤٠ سنة"/><NumberField id={id} name="annualRate" label="نسبة التمويل السنوية الاسمية" unit="٪" draft={draft} errors={errors} onChange={change} hint="افتراض للحساب؛ عدّله وفق عرضك."/></div>
        <div className="af-control-separator"><Wallet size={19}/><h3>مساحتك الشهرية</h3></div>
        <div className="af-fields-grid"><NumberField id={id} name="monthlyIncome" label="الدخل الشهري" draft={draft} errors={errors} onChange={change}/><NumberField id={id} name="monthlyDebts" label="الأقساط الحالية شهريًا" draft={draft} errors={errors} onChange={change}/></div>
        <div className="af-budget-control"><NumberField id={id} name="budgetShare" label="ما النسبة التي تخصصها للسكن والالتزامات؟" unit="٪" draft={draft} errors={errors} onChange={change}/><input type="range" min="1" max="100" step="1" value={Math.min(100, Math.max(1, parseFinanceNumber(draft.budgetShare) ?? DEFAULT_FINANCE_INPUTS.budgetShare))} onChange={event => change('budgetShare', event.target.value)} aria-label="تغيير نسبة التخصيص من الدخل"/><p>اختيار شخصي يشمل القسط الجديد والأقساط الحالية والتشغيل؛ لا يحدد أهلية التمويل.</p></div>
        <details className="af-cost-assumptions"><summary><span><SlidersHorizontal size={19}/>مصاريف إضافية تختارها بنفسك</span><ChevronDown size={18}/></summary><p>أضف التكاليف التي تنطبق على حالتك. لا تُضاف رسوم أو ضرائب أو تأمين تلقائيًا.</p><div className="af-fields-grid"><NumberField id={id} name="upfrontCosts" label="مصاريف الشراء الإضافية" draft={draft} errors={errors} onChange={change} hint="تُدفع عند الشراء، ولا تُضاف للتمويل."/><NumberField id={id} name="monthlyCosts" label="التشغيل والصيانة شهريًا" draft={draft} errors={errors} onChange={change} hint="نفترض بقاء هذا المبلغ ثابتًا طوال المدة."/></div></details>
        {!result.ok && <p className="af-invalid-notice" role="alert">راجع الحقول الموضّحة أعلاه لاستكمال الحساب.</p>}
        {result.ok && <a href="#finance-result" className="af-mobile-result-link"><span>قسطك الحالي <b>{currency(result.monthlyPayment)} ر.س / شهر</b></span><span>عرض التفاصيل<ArrowLeft size={17}/></span></a>}
      </section>
      {result.ok ? <FinanceSummary result={result}/> : <aside className="af-result af-result-empty" aria-label="النتيجة غير مكتملة"><Calculator size={36}/><h2>نحتاج أرقامًا مكتملة.</h2><p>صحّح الحقول المعلّمة، وستظهر النتيجة هنا مباشرة.</p></aside>}
    </div>
    <section id="finance-scenarios" className="af-scenarios" aria-labelledby="af-scenarios-title"><div className="af-section-heading"><span className="af-section-number">02</span><div><h2 id="af-scenarios-title">خياران. صورة أوضح.</h2><p>احفظ دفعة أعلى أو مدة أقصر وشاهد الفرق جنبًا إلى جنب.</p></div></div><div className="af-save-row"><div className="af-scenario-name"><label htmlFor={`${id}-scenario-name`}>اسم الخطة الحالية</label><input id={`${id}-scenario-name`} value={scenarioName} onChange={event => setScenarioName(event.target.value)} maxLength={50} placeholder="مثلًا: دفعة أعلى ومدة أقصر"/></div><div className="af-save-actions">{(['a', 'b'] as const).map(slot => <button key={slot} type="button" className={slot === 'a' ? 'af-button' : 'af-outline-button'} disabled={!result.ok || !hydrated} onClick={() => saveScenario(slot)}><Save size={17}/>{scenarios.some(item => item.slot === slot) ? `تحديث السيناريو ${slotLabel(slot)}` : `حفظ كسيناريو ${slotLabel(slot)}`}</button>)}</div></div><p className="af-storage-note"><Check size={15}/>تُحفظ الخطتان في هذا المتصفح. تحديث سيناريو يستبدل أرقامه السابقة.</p><p className="af-status" role="status" aria-live="polite">{notice}</p><ScenarioComparison scenarios={scenarios} onLoad={loadScenario} onRemove={removeScenario}/></section>
    {result.ok && <section className="af-schedule-section" aria-labelledby="af-schedule-title"><div className="af-section-heading"><span className="af-section-number">03</span><div><h2 id="af-schedule-title">كيف ينخفض التمويل مع الوقت؟</h2><p>ملخص سنوي يبيّن ما تسدده من أصل التمويل وما يبقى منه.</p></div></div>{result.principal === 0 ? <div className="af-no-loan"><Check size={23}/><p>لا يوجد رصيد تمويل أو جدول أقساط؛ دفعتك الأولى تغطي سعر العقار كاملًا.</p></div> : <details className="af-schedule" open><summary><span>جدول السداد · {decimal(result.input.years)} سنة</span><ChevronDown size={18}/></summary><p className="af-mobile-table-hint"><ArrowLeftRight size={17}/>مرّر الجدول أفقيًا لرؤية جميع الأعمدة.</p><div className="af-table-wrap af-schedule-scroll" role="region" aria-label="جدول السداد السنوي، قابل للتمرير" tabIndex={0}><table><caption className="af-sr-only">جميع المبالغ بالريال السعودي، مقربة لأقرب ريال</caption><thead><tr><th scope="col">السنة</th><th scope="col">سداد الأصل</th><th scope="col">تكلفة التمويل</th><th scope="col">المدفوع سنويًا</th><th scope="col">الرصيد المتبقي</th></tr></thead><tbody>{result.annualSchedule.map(row => <tr key={row.year}><th scope="row">{decimal(row.year)}</th><td>{currency(row.principalPaid)}</td><td>{currency(row.financeCost)}</td><td>{currency(row.payments)}</td><td><div className="af-balance-cell"><span>{currency(row.closingBalance)}</span><i aria-hidden="true"><b style={{ width: `${Math.max(0, row.closingBalance / result.principal * 100)}%` }}/></i></div></td></tr>)}</tbody><tfoot><tr><th scope="row">الإجمالي</th><td>{currency(result.principal)}</td><td>{currency(result.totalFinanceCost)}</td><td>{currency(result.totalInstallments)}</td><td>٠</td></tr></tfoot></table></div><p className="af-table-note">الأرقام بالريال ومقربة لأقرب ريال. الجدول يخص الأقساط وحدها؛ المصروفات الإضافية تظهر في إجمالي الخطة.</p></details>}</section>}
    <div className="af-method"><CircleHelp size={21}/><div><h2>كيف نحسب؟</h2><p>نستخدم أقساطًا شهرية ثابتة على رصيد متناقص، ونسبة سنوية اسمية ثابتة تُقسم على ١٢. نفترض الدفع في نهاية كل شهر وعدم وجود سداد مبكر أو تغير في النسبة. هذه محاكاة تعليمية بمدخلاتك، وليست عرضًا أو موافقة تمويلية؛ الأرقام الافتراضية قابلة للتعديل.</p></div></div>
  </div>;
}
