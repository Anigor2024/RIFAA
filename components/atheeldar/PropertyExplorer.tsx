'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Search, SlidersHorizontal, Map, List, X, Sparkles, Bookmark, Scale,
  ArrowDownUp, BadgeCheck, TrendingUp, Gem, Building2, Link2, ArrowLeft, MapPin,
} from 'lucide-react';
import { properties, type Property, money } from '@/lib/atheeldar-data';
import {
  createPropertySearch, DEFAULT_PROPERTY_SEARCH, filterProperties, parsePropertyQuery,
  PROPERTY_CITIES, PROPERTY_TYPES, PROPERTY_PURPOSES, readPropertySearchParams,
  writePropertySearchParams, type PropertySearchState,
} from '@/lib/property-search';
import {
  STORAGE_KEYS, readJSON, writeJSON, readStoredIds, writeStoredIds,
  toggleStoredId, subscribeStoredIds,
} from '@/lib/browser-storage';
import { PropertyCard } from './PropertyCard';

const SEARCH_EXAMPLES = [
  'شقة للإيجار في جدة أقل من 200 ألف',
  'فيلا بالرياض أقل من 7 مليون و5 غرف',
  'عقار استثماري للبيع',
];

function currentComparison(): string[] {
  return readStoredIds(STORAGE_KEYS.compare)
    .filter(slug => properties.some(property => property.slug === slug)).slice(0, 3);
}

export function PropertyExplorer({ initialQuery = '' }: { initialQuery?: string }) {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();
  const search = useMemo(() => readPropertySearchParams(new URLSearchParams(paramsKey)), [paramsKey]);
  const [draft, setDraft] = useState(search.query || initialQuery);
  const [compare, setCompare] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDraft(search.query), 0);
    return () => window.clearTimeout(timer);
  }, [search.query]);

  useEffect(() => {
    const sync = () => setCompare(currentComparison());
    const timer = window.setTimeout(sync, 0);
    const unsubscribe = subscribeStoredIds(sync);
    return () => { window.clearTimeout(timer); unsubscribe(); };
  }, []);

  const filtered = useMemo(() => filterProperties(properties, search), [search]);
  const parsed = useMemo(() => parsePropertyQuery(search.query), [search.query]);

  function apply(next: PropertySearchState, history: 'push' | 'replace' = 'push') {
    const params = writePropertySearchParams(next, new URLSearchParams(window.location.search));
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    setDraft(next.query);
    setFeedback('');
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      // Native history is integrated with the Next router: reload, Back and Forward retain controls.
      if (history === 'replace') window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
    }
  }

  function update(patch: Partial<PropertySearchState>, history: 'push' | 'replace' = 'push') {
    apply({ ...search, ...patch }, history);
  }

  function applySmart(query: string) {
    const next = createPropertySearch(query);
    apply({ ...next, view: search.view, sort: search.sort });
    const details = parsePropertyQuery(query);
    setFeedback(details.recognized.length
      ? `تم تطبيق: ${details.recognized.map(value => value === 'موثق' ? 'اكتمال العرض' : value).join(' · ')}. يمكنك تعديل أي اختيار أدناه.`
      : query.trim() ? 'نعرض النتائج التي تحتوي على كلمات بحثك. يمكنك إضافة المدينة أو الميزانية لتضييقها.' : 'تمت إعادة البحث إلى جميع العقارات.');
  }

  function reset() {
    apply({ ...DEFAULT_PROPERTY_SEARCH });
  }

  function saveSearch() {
    const key = 'atheeldar-saved-searches';
    const stored = readJSON<unknown>(key, []);
    const saved = Array.isArray(stored) ? stored.filter(item => item && typeof item === 'object') : [];
    const { view: _view, sort: _sort, ...criteria } = search;
    const fingerprint = JSON.stringify(criteria);
    if (saved.some(item => item.fingerprint === fingerprint)) {
      setFeedback('هذا البحث محفوظ بالفعل في مساحتك على هذا المتصفح.');
      return;
    }
    const query = writePropertySearchParams(search).toString();
    const entry = { ...search, id: Date.now(), fingerprint, url: `/properties${query ? `?${query}` : ''}` };
    const result = writeJSON(key, [entry, ...saved].slice(0, 10));
    setFeedback(result.persisted
      ? 'تم حفظ البحث في مساحة العميل على هذا المتصفح.'
      : 'البحث محفوظ لهذه الزيارة فقط؛ المتصفح لا يسمح بالتخزين. انسخ رابط النتائج للاحتفاظ به.');
  }

  async function copySearch() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setFeedback('تم نسخ رابط النتائج بكل الفلاتر الحالية.');
    } catch {
      setFeedback('يمكنك نسخ رابط الصفحة من شريط العنوان؛ الرابط يتضمن الفلاتر الحالية.');
    }
  }

  function toggleCompare(slug: string) {
    const result = toggleStoredId(STORAGE_KEYS.compare, slug, 3);
    setCompare(currentComparison());
    if (result.atCapacity) setFeedback('المقارنة تتسع لثلاثة عقارات. احذف عقارًا من الشريط لإضافة اختيار آخر.');
    else if (!result.persisted) setFeedback('تم تحديث المقارنة لهذه الزيارة فقط؛ التخزين غير متاح في المتصفح.');
  }

  const activeFilters: Array<{ label: string; patch: Partial<PropertySearchState> }> = [];
  if (search.city !== 'الكل') activeFilters.push({ label: search.city, patch: { city: 'الكل' } });
  if (search.type !== 'الكل') activeFilters.push({ label: search.type, patch: { type: 'الكل' } });
  if (search.purpose !== 'الكل') activeFilters.push({ label: search.purpose, patch: { purpose: 'الكل' } });
  if (search.max !== DEFAULT_PROPERTY_SEARCH.max) activeFilters.push({ label: `حتى ${money(search.max)} ر.س${search.purpose === 'للإيجار' ? ' سنويًا' : ''}`, patch: { max: DEFAULT_PROPERTY_SEARCH.max } });
  if (search.beds) activeFilters.push({ label: `${search.beds} غرف فأكثر`, patch: { beds: 0 } });
  if (search.minArea) activeFilters.push({ label: `من ${money(search.minArea)} م²`, patch: { minArea: 0 } });
  if (search.maxArea !== undefined) activeFilters.push({ label: `حتى ${money(search.maxArea)} م²`, patch: { maxArea: undefined } });
  if (search.residentialOnly) activeFilters.push({ label: 'سكني فقط', patch: { residentialOnly: false } });
  if (search.quick !== 'الكل') activeFilters.push({ label: search.quick === 'موثق' ? 'اكتمال العرض' : search.quick, patch: { quick: 'الكل' } });
  if (parsed.terms.length) activeFilters.push({ label: `الكلمات: ${parsed.terms.join('، ')}`, patch: { query: '' } });

  return <>
    <section className="smartSearchPanel" aria-labelledby="property-search-title">
      <div className="smartSearchTop">
        <div><span className="tinyLabel"><Sparkles size={15} /> بحث أثيلدار</span><h2 id="property-search-title">صف المكان الذي تتخيله</h2></div>
        <button type="button" className="softButton" onClick={saveSearch}><Bookmark size={17} /> احفظ البحث</button>
      </div>
      <form className="smartInput" role="search" onSubmit={event => { event.preventDefault(); applySmart(draft); }}>
        <Search aria-hidden="true" />
        <input aria-label="ابحث بالمدينة أو نوع العقار أو الميزانية" value={draft} maxLength={300} onChange={event => setDraft(event.target.value)} placeholder="شقة للإيجار في جدة أقل من 200 ألف" />
        <button type="submit">اعرض النتائج <ArrowLeft size={16} /></button>
      </form>
      <div className="searchExamples" aria-label="اقتراحات بحث"><span>جرّب:</span>{SEARCH_EXAMPLES.map(example => <button key={example} type="button" onClick={() => applySmart(example)}>{example}</button>)}</div>
      <div className="quickFilters" aria-label="تفضيلات العقار">
        {([
          ['الكل', null], ['فاخر', Gem], ['موثق', BadgeCheck], ['جديد', Building2], ['استثماري', TrendingUp],
        ] as const).map(([value, Icon]) => <button key={value} type="button" className={search.quick === value ? 'active' : ''} aria-pressed={search.quick === value} onClick={() => update({ quick: value })}>{Icon && <Icon />} {value === 'موثق' ? 'اكتمال العرض' : value}</button>)}
      </div>
      {feedback && <p className="smartNote searchFeedback" role="status">{feedback}</p>}
    </section>

    <button type="button" className="at-filter-toggle" aria-expanded={filtersOpen} aria-controls="property-filters" onClick={()=>setFiltersOpen(open=>!open)}><SlidersHorizontal size={19}/><span>{filtersOpen?'إخفاء الفلاتر':'تصفية النتائج'}</span><small>{activeFilters.length?`${activeFilters.length} مفعّلة`:'المدينة، السعر، المساحة'}</small></button>
    <div className="explorerLayout">
      <aside id="property-filters" className={`filterPanel${filtersOpen?' is-open':''}`} aria-label="تصفية العقارات">
        <div className="filterTitle"><SlidersHorizontal size={18} /><b>اجعلها أقرب لاحتياجك</b></div>
        <label>المدينة<select value={search.city} onChange={event => update({ city: event.target.value as PropertySearchState['city'] })}>{PROPERTY_CITIES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>نوع العقار<select value={search.type} onChange={event => update({ type: event.target.value as PropertySearchState['type'] })}>{PROPERTY_TYPES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>الغرض<select value={search.purpose} onChange={event => update({ purpose: event.target.value as PropertySearchState['purpose'] })}>{PROPERTY_PURPOSES.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>أقل عدد غرف<select value={search.beds} onChange={event => update({ beds: Number(event.target.value) })}><option value={0}>أي عدد</option>{Array.from({ length: Math.max(6, search.beds) }, (_, i) => i + 1).map(value => <option key={value} value={value}>{value}+</option>)}</select></label>
        <label>حد السعر بالريال {search.purpose === 'للإيجار' && '(سنويًا)'}
          <input type="number" min={0} max={1_000_000_000} step={1000} aria-label="الحد الأقصى للسعر بالريال" value={search.max} onChange={event => { const value = Number(event.target.value); if (Number.isFinite(value) && value >= 0 && value <= 1_000_000_000) update({ max: value }, 'replace'); }} />
          <input type="range" min={0} max={Math.max(search.max, search.purpose === 'للإيجار' ? 1_000_000 : 10_000_000)} step={1000} aria-label="ضبط الحد الأقصى للسعر" value={search.max} onChange={event => update({ max: Number(event.target.value) }, 'replace')} />
        </label>
        <label>أقل مساحة بالمتر المربع<input type="number" min={0} max={100_000} step={10} value={search.minArea} onChange={event => { const value = Number(event.target.value); if (Number.isFinite(value) && value >= 0 && value <= 100_000) update({ minArea: value }, 'replace'); }} /></label>
        {search.maxArea !== undefined && <label>أقصى مساحة بالمتر المربع<input type="number" min={0} max={100_000} value={search.maxArea} onChange={event => update({ maxArea: Math.max(0, Math.min(100_000, Number(event.target.value))) }, 'replace')} /></label>}
        <label className="residentialFilter"><input type="checkbox" checked={search.residentialOnly} onChange={event => update({ residentialOnly: event.target.checked })} /> عقارات سكنية فقط</label>
        <button type="button" className="resetButton" onClick={reset}><X size={16} /> إعادة الضبط</button>
      </aside>

      <div className="resultsArea">
        <div className="resultsToolbar">
          <div aria-live="polite"><b>{filtered.length} {filtered.length === 1 ? 'عقار يطابق بحثك' : 'عقارات تطابق بحثك'}</b><span>عقارات نموذجية للاستكشاف · الإيجارات سنوية</span></div>
          <div className="toolbarRight">
            <label className="sortControl"><ArrowDownUp /><select aria-label="ترتيب النتائج" value={search.sort} onChange={event => update({ sort: event.target.value as PropertySearchState['sort'] })}><option value="match">الأفضل مطابقة</option><option value="score">أعلى مؤشر عرض</option><option value="priceLow">السعر: الأقل أولًا</option><option value="priceHigh">السعر: الأعلى أولًا</option><option value="area">الأكبر مساحة</option></select></label>
            <div className="viewToggle" aria-label="طريقة عرض العقارات"><button type="button" className={search.view === 'list' ? 'active' : ''} aria-pressed={search.view === 'list'} onClick={() => update({ view: 'list' })}><List size={17} /> قائمة</button><button type="button" className={search.view === 'map' ? 'active' : ''} aria-pressed={search.view === 'map'} onClick={() => update({ view: 'map' })}><Map size={17} /> مخطط</button></div>
            <button type="button" className="resetButton searchShare" onClick={copySearch} aria-label="نسخ رابط النتائج والفلاتر"><Link2 size={17} /> مشاركة</button>
          </div>
        </div>
        {activeFilters.length > 0 && <div className="activeSearchFilters" aria-label="الفلاتر المطبقة">{activeFilters.map(({ label, patch }) => <button type="button" key={label} onClick={() => update(patch)} aria-label={`إزالة فلتر ${label}`}>{label}<X size={13} /></button>)}</div>}
        {filtered.length > 0 && (search.view === 'list'
          ? <div className="propertyGrid">{filtered.map(property => <PropertyCard key={property.slug} p={property} onCompare={() => setCompare(currentComparison())} />)}</div>
          : <MapView items={filtered} onCompare={toggleCompare} compare={compare} />)}
        {filtered.length === 0 && <div className="emptyBox"><Search size={30} /><h3>لم نجد عقارًا يطابق هذه التفاصيل</h3><p>عدّل الفلاتر أعلاه أو احذف أحد الشروط. تُعرض المطابقات الفعلية ضمن العقارات المتاحة في النموذج.</p><button type="button" onClick={reset}>استكشف جميع العقارات</button></div>}
      </div>
    </div>
    {compare.length > 0 && <CompareTray slugs={compare} clear={() => { writeStoredIds(STORAGE_KEYS.compare, []); setCompare([]); }} remove={toggleCompare} />}
  </>;
}

function MapView({ items, onCompare, compare }: { items: Property[]; onCompare: (slug: string) => void; compare: string[] }) {
  const [selectedSlug, setSelectedSlug] = useState(items[0]?.slug);
  const selected = items.find(property => property.slug === selectedSlug) ?? items[0];
  return <div className="mapExperience">
    <div className="mapCanvas" role="region" aria-label="مخطط استكشافي للعقارات، المواقع تقريبية">
      <div className="mapRoad r1" /><div className="mapRoad r2" /><div className="mapWater" />
      <p className="mapNotice">مخطط استكشافي — المواقع تقريبية</p>
      <span className="mapLabel one">{selected?.city ?? 'المدن المعروضة'}</span><span className="mapLabel two">{selected?.district ?? ''}</span>
      {items.map(property => <button type="button" className={`mapPin ${selected?.slug === property.slug ? 'selected' : ''}`} key={property.slug} style={{ left: `${property.coordinates.x}%`, top: `${property.coordinates.y}%` }} aria-pressed={selected?.slug === property.slug} aria-label={`${property.title}، ${property.city}، ${money(property.price)} ريال${property.purpose === 'للإيجار' ? ' سنويًا' : ''}`} onClick={() => setSelectedSlug(property.slug)}>
        <b>{new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(property.price)} ر.س</b>{property.purpose === 'للإيجار' && <small> سنويًا</small>}<span>{property.title} · {property.city}</span>
      </button>)}
      {selected && <article className="mapSelectionCard" aria-live="polite"><img src={selected.image} alt={selected.title} /><div><small><MapPin size={12} /> {selected.city} · {selected.district}</small><h3>{selected.title}</h3><b>{money(selected.price)} ر.س{selected.purpose === 'للإيجار' ? ' سنويًا' : ''}</b><Link href={`/properties/${selected.slug}`}>اكتشف العقار <ArrowLeft size={14} /></Link></div></article>}
    </div>
    <div className="mapSide"><b>اختر عقارًا لاستكشافه</b><p className="mapSideNote">النقاط توضّح الاختيارات، ولا تُستخدم للوصول إلى الموقع الفعلي.</p>{items.map(property => <div key={property.slug} className={selected?.slug === property.slug ? 'selected' : ''}><button type="button" onClick={() => setSelectedSlug(property.slug)} aria-label={`تحديد ${property.title}`}><img src={property.image} alt={property.title} /></button><span><Link href={`/properties/${property.slug}`}><strong>{property.title}</strong></Link><small>{property.city} · {money(property.price)} ر.س{property.purpose === 'للإيجار' ? ' سنويًا' : ''}</small></span><button type="button" onClick={() => onCompare(property.slug)} aria-pressed={compare.includes(property.slug)} aria-label={`${compare.includes(property.slug) ? 'إزالة' : 'إضافة'} ${property.title} ${compare.includes(property.slug) ? 'من' : 'إلى'} المقارنة`}><Scale size={15} /></button></div>)}</div>
  </div>;
}

function CompareTray({ slugs, clear, remove }: { slugs: string[]; clear: () => void; remove: (slug: string) => void }) {
  const selected = slugs.map(slug => properties.find(property => property.slug === slug)).filter((property): property is Property => Boolean(property));
  return <section className="compareTray" aria-label="قائمة مقارنة العقارات">
    <div className="compareTrayHead"><div><Scale size={18} /><b>مقارنة العقارات ({selected.length}/3)</b></div><button type="button" onClick={clear} aria-label="مسح قائمة المقارنة"><X /></button></div>
    <div className="compareMini">{selected.map(property => <div key={property.slug}><img src={property.image} alt={property.title} /><span>{property.title}</span><button type="button" onClick={() => remove(property.slug)} aria-label={`إزالة ${property.title} من المقارنة`}>×</button></div>)}</div>
    {selected.length < 2 ? <p>أضف عقارًا آخر لتقارن السعر والمساحة والتفاصيل.</p> : <>
      <div className="compareTable">
        <div><b>الغرض</b>{selected.map(property => <span key={property.slug}>{property.purpose}</span>)}</div>
        <div><b>السعر</b>{selected.map(property => <span key={property.slug}>{money(property.price)} ر.س{property.purpose === 'للإيجار' ? ' سنويًا' : ''}</span>)}</div>
        <div><b>سعر المتر</b>{selected.map(property => <span key={property.slug}>{money(Math.round(property.price / property.area))} ر.س/م²{property.purpose === 'للإيجار' ? ' سنويًا' : ''}</span>)}</div>
        <div><b>المساحة</b>{selected.map(property => <span key={property.slug}>{money(property.area)} م²</span>)}</div>
        <div><b>غرف النوم</b>{selected.map(property => <span key={property.slug}>{property.beds || '—'}</span>)}</div>
      </div>
    </>}
    <Link href="/compare" className="compareTrayLink">افتح المقارنة الكاملة <ArrowLeft size={16} /></Link>
  </section>;
}
