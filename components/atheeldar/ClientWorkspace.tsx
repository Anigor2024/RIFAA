'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowUpRight, Bookmark, CalendarDays, Check, CheckCheck, ChevronLeft,
  Download, FileJson, Heart, MapPin, NotebookPen, Route, Scale, Search, ShieldCheck, Trash2, Upload, X,
} from 'lucide-react';
import { properties, money, type Property } from '@/lib/atheeldar-data';
import { readJSON, readStoredIds, STORAGE_KEYS, subscribeStoredIds, writeJSON, writeStoredIds } from '@/lib/browser-storage';
import { filterProperties } from '@/lib/property-search';
import { PROPERTY_CHECKLIST, readPropertyNotes, writePropertyNotes } from '@/lib/property-notes';
import {
  MAX_JOURNEY_BACKUP_BYTES, SAVED_SEARCHES_KEY, VIEWING_MINUTES_KEY, createJourneyBackup,
  emptyJourneySnapshot, normalizeJourneySnapshot, parseJourneyBackup, prepareJourneyImport,
  savedSearchTitle, type JourneyBackup, type JourneyCounts, type JourneyImportMode, type JourneySnapshot,
} from '@/lib/journey-backup';
import { PropertyCard } from './PropertyCard';
import './scopedclient-workspace.css';

const tabs = [
  { id: 'favorites', label: 'المفضلة', Icon: Heart },
  { id: 'compare', label: 'المقارنة', Icon: Scale },
  { id: 'viewingPlan', label: 'خطة المعاينات', Icon: CalendarDays },
  { id: 'savedSearches', label: 'البحث المحفوظ', Icon: Bookmark },
  { id: 'notes', label: 'ملاحظاتي', Icon: NotebookPen },
] as const;
type TabId = typeof tabs[number]['id'];
type LocalViewingDraft = { id: string; slug: string; date: string; time: string; message: string };
const catalogue = new Map(properties.map(property => [property.slug, property]));
const propertiesFor = (ids: string[]): Property[] => ids.map(id => catalogue.get(id)).filter((item): item is Property => Boolean(item));

function readViewingDrafts(): LocalViewingDraft[] {
  const value = readJSON<unknown>('atheeldar-bookings', []);
  if (!Array.isArray(value)) return [];
  const result: LocalViewingDraft[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const entry = raw as Record<string, unknown>;
    if (typeof entry.slug !== 'string' || !catalogue.has(entry.slug) || typeof entry.date !== 'string'
      || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || typeof entry.time !== 'string'
      || !['10:00 ص', '1:00 م', '4:00 م', '7:00 م'].includes(entry.time)) continue;
    const date = new Date(`${entry.date}T12:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== entry.date) continue;
    if (result.some(draft => draft.slug === entry.slug)) continue;
    result.push({ id: String(entry.id ?? entry.slug), slug: entry.slug, date: entry.date, time: entry.time,
      message: typeof entry.message === 'string' ? entry.message.slice(0, 1000) : '' });
    if (result.length === 20) break;
  }
  return result;
}

function readWorkspace(): JourneySnapshot {
  return normalizeJourneySnapshot({
    favorites: readStoredIds(STORAGE_KEYS.favorites),
    compare: readStoredIds(STORAGE_KEYS.compare),
    viewingPlan: readStoredIds(STORAGE_KEYS.viewingPlan),
    savedSearches: readJSON<unknown>(SAVED_SEARCHES_KEY, []),
    notes: readPropertyNotes(),
    viewingMinutes: readJSON<unknown>(VIEWING_MINUTES_KEY, 55),
  });
}

function localDate(value: string): string {
  return new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory' }).format(new Date(value));
}

function EmptyState({ icon, title, copy, href, action }: { icon: ReactNode; title: string; copy: string; href: string; action: string }) {
  return <div className="aw-empty"><span className="aw-empty-icon">{icon}</span><h3>{title}</h3><p>{copy}</p>
    <Link className="aw-button" href={href}>{action}<ArrowLeft size={18} aria-hidden="true" /></Link></div>;
}

function WorkspacePropertyRow({ property, ordinal, children }: { property: Property; ordinal?: number; children?: ReactNode }) {
  return <article className="aw-property-row">
    {ordinal !== undefined && <span className="aw-ordinal" aria-label={`المعاينة ${ordinal}`}>{String(ordinal).padStart(2, '0')}</span>}
    <Link href={`/properties/${property.slug}`} className="aw-row-image" aria-label={`تفاصيل ${property.title}`}>
      <Image src={property.image} alt={property.title} width={180} height={140} sizes="(max-width: 600px) 84px, 116px" />
    </Link>
    <div className="aw-row-copy"><span>{property.type} · {property.purpose}</span><h3><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3>
      <p><MapPin size={14} aria-hidden="true" />{property.city} · {property.district}</p>
      <b>{money(property.price)} ر.س{property.purpose === 'للإيجار' && <small> / سنوي</small>}</b>
    </div>{children}
  </article>;
}

export function ClientWorkspace() {
  const [snapshot, setSnapshot] = useState<JourneySnapshot>(emptyJourneySnapshot);
  const [ready, setReady] = useState(false);
  const [drafts, setDrafts] = useState<LocalViewingDraft[]>([]);
  const [active, setActive] = useState<TabId>('favorites');
  const [hashRequest, setHashRequest] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);
  const [candidate, setCandidate] = useState<{ backup: JourneyBackup; warnings: string[]; name: string } | null>(null);
  const [mode, setMode] = useState<JourneyImportMode>('merge');
  const fileInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const tabButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const tabList = useRef<HTMLDivElement>(null);
  const hashDestination = useRef<'panel' | 'drafts' | null>(null);

  useEffect(() => {
    const read = () => { setSnapshot(readWorkspace()); setDrafts(readViewingDrafts()); setReady(true); };
    const restoreHash = (fragment: string) => {
      const raw = fragment.slice(1);
      const hash = raw === 'viewings' ? 'viewingPlan' : raw;
      const tab = tabs.find(item => item.id === hash);
      if (tab) { hashDestination.current = raw === 'viewings' ? 'drafts' : 'panel'; setActive(tab.id); setHashRequest(value => value + 1); }
    };
    const restoreTab = () => restoreHash(window.location.hash);
    // Next's same-page hash navigation uses history.pushState and does not emit hashchange.
    const followWorkspaceLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      let url: URL;
      try { url = new URL(anchor.href, window.location.href); } catch { return; }
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) restoreHash(url.hash);
    };
    const timer = window.setTimeout(() => { read(); restoreTab(); }, 0);
    const unsubscribe = subscribeStoredIds(read);
    window.addEventListener('hashchange', restoreTab);
    window.addEventListener('popstate', restoreTab);
    document.addEventListener('click', followWorkspaceLink, true);
    return () => {
      window.clearTimeout(timer); unsubscribe(); window.removeEventListener('hashchange', restoreTab);
      window.removeEventListener('popstate', restoreTab); document.removeEventListener('click', followWorkspaceLink, true);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      const button = tabButtons.current[tabs.findIndex(tab => tab.id === active)];
      const rail = tabList.current;
      if (button && rail) {
        const control = button.getBoundingClientRect(), viewport = rail.getBoundingClientRect();
        if (control.left < viewport.left || control.right > viewport.right) {
          rail.scrollBy({ left: (control.left + control.right - viewport.left - viewport.right) / 2, behavior: 'auto' });
        }
      }
      if (hashDestination.current) {
        const target = hashDestination.current === 'drafts' ? document.getElementById('aw-drafts-title') : tabList.current;
        (target ?? tabList.current)?.scrollIntoView({ block: 'start', behavior: 'auto' });
        hashDestination.current = null;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active, ready, hashRequest]);

  const counts: JourneyCounts = { favorites: snapshot.favorites.length, compare: snapshot.compare.length,
    viewingPlan: snapshot.viewingPlan.length, savedSearches: snapshot.savedSearches.length,
    notes: Object.values(snapshot.notes).filter(note => note.note.trim() || note.checklist.length).length };
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const plan = candidate ? prepareJourneyImport(snapshot, candidate.backup.data, mode) : null;
  const favorites = propertiesFor(snapshot.favorites);
  const compared = propertiesFor(snapshot.compare);
  const viewings = propertiesFor(snapshot.viewingPlan);
  const noteEntries = Object.entries(snapshot.notes).filter(([, note]) => note.note.trim() || note.checklist.length)
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));

  const changeTab = (tab: TabId, focus = false) => {
    setActive(tab);
    const url = new URL(window.location.href);
    url.hash = tab;
    window.history.replaceState(window.history.state, '', url);
    if (focus) tabButtons.current[tabs.findIndex(item => item.id === tab)]?.focus();
  };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowRight') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    changeTab(tabs[next].id, true);
  };
  const announce = (message: string, persisted = true) => {
    setStatus(message + (persisted ? '' : ' التغيير متاح لهذه الزيارة فقط؛ المتصفح لا يسمح بالحفظ الدائم.'));
    setError('');
  };
  const removeViewing = (slug: string) => {
    const result = writeStoredIds(STORAGE_KEYS.viewingPlan, readWorkspace().viewingPlan.filter(item => item !== slug));
    announce('أُزيل العقار من خطة المعاينات.', result.persisted);
  };
  const removeSearch = (fingerprint: string) => {
    const result = writeJSON(SAVED_SEARCHES_KEY, readWorkspace().savedSearches.filter(item => item.fingerprint !== fingerprint));
    announce('حُذف البحث المحفوظ.', result.persisted);
  };
  const exportBackup = () => {
    const backup = createJourneyBackup(readWorkspace());
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atheeldar-choices-${backup.exportedAt.slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('بدأ تنزيل نسخة اختياراتك وملاحظاتك. يمكنك استيرادها هنا على جهاز آخر.');
  };
  const selectBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCandidate(null);
    setError('');
    setStatus('');
    setReading(true);
    try {
      if (file.size > MAX_JOURNEY_BACKUP_BYTES) throw new Error('حجم النسخة أكبر من ١ ميغابايت. اختر ملفًا أصغر.');
      const parsed = parseJourneyBackup(await file.text());
      setSnapshot(readWorkspace());
      setMode('merge');
      setCandidate({ ...parsed, name: file.name.slice(0, 160) });
      window.setTimeout(() => {
        previewHeading.current?.focus({ preventScroll: true });
        previewHeading.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
      }, 0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'تعذّرت قراءة الملف. اختر نسخة أثيلدار صالحة.');
    } finally { setReading(false); }
  };
  const applyBackup = () => {
    if (!candidate || !plan) return;
    const current = readWorkspace();
    if (JSON.stringify(current) !== JSON.stringify(snapshot)) {
      setSnapshot(current);
      setStatus('تغيّرت اختياراتك منذ فتح المعاينة. راجع الأعداد المحدّثة ثم طبّق الاستيراد.');
      return;
    }
    const next = prepareJourneyImport(current, candidate.backup.data, mode).data;
    const results = [
      writeStoredIds(STORAGE_KEYS.favorites, next.favorites),
      writeStoredIds(STORAGE_KEYS.compare, next.compare),
      writeStoredIds(STORAGE_KEYS.viewingPlan, next.viewingPlan),
      writeJSON(SAVED_SEARCHES_KEY, next.savedSearches),
      writePropertyNotes(next.notes),
      writeJSON(VIEWING_MINUTES_KEY, next.viewingMinutes),
    ];
    setSnapshot(readWorkspace());
    setCandidate(null);
    announce(mode === 'merge' ? 'دُمجت النسخة وفق المعاينة، مع الاحتفاظ باختياراتك وملاحظاتك الحالية عند التعارض.'
      : 'استُبدلت أقسام مساحتك الخمسة ومدة المعاينة بالنسخة التي اخترتها.', results.every(result => result.persisted));
  };

  const nextStep = counts.viewingPlan > 0
    ? { title: 'حوّل اختياراتك إلى خطة زيارة.', copy: `لديك ${money(counts.viewingPlan)} عقارات في خطة المعاينات. رتّبها وحدد الوقت المناسب لكل زيارة.`, href: '/viewing-planner', action: 'رتّب معايناتي', Icon: Route }
    : counts.compare >= 2
      ? { title: 'أصبحت المقارنة جاهزة.', copy: 'راجع السعر والمساحة والمواصفات جنبًا إلى جنب، ثم أضف ما يناسبك إلى خطة المعاينات.', href: '/compare', action: 'افتح المقارنة', Icon: Scale }
      : drafts.length > 0
        ? { title: 'راجع موعدك المقترح وتفاصيله.', copy: 'لديك مسودات معاينة محفوظة. عد إلى التفاصيل وعدّل الموعد أو أضف ما تريد سؤاله أثناء الزيارة.', href: '#viewings', action: 'راجع المسودات', Icon: CalendarDays }
      : counts.favorites > 0
        ? { title: 'اقترب من اختيارك القادم.', copy: 'افتح العقارات المحفوظة، وأضف اختيارين إلى المقارنة لتظهر الفروق أمامك بوضوح.', href: '#favorites', action: 'راجع المفضلة', Icon: Heart }
        : { title: 'ابدأ بما يشبه حياتك.', copy: 'أجب عن أربعة أسئلة، ثم احفظ العقارات المناسبة لتبني قائمتك الخاصة هنا.', href: '/home-finder', action: 'ساعدني أختار', Icon: Search };
  const NextIcon = nextStep.Icon;

  return <div className="at-workspace">
    <header className="aw-header shell">
      <nav className="aw-breadcrumbs" aria-label="مسار الصفحة"><Link href="/">الرئيسية</Link><ChevronLeft size={14} aria-hidden="true" /><span aria-current="page">مساحتي</span></nav>
      <div className="aw-intro"><div><span className="aw-eyebrow">مساحتك في أثيلدار</span><h1>اختياراتك تستحق<br />مكانًا يجمعها.</h1><p>احفظ ما لفت انتباهك، قارن على مهل، واحتفظ بتفاصيل تساعدك على اتخاذ قرارك.</p></div>
        <div className="aw-storage-card"><span className="aw-storage-icon"><Bookmark size={26} aria-hidden="true" /></span>
          <div><b>رحلتك محفوظة هنا</b><p>اختيارات وملاحظات في هذا المتصفح. صدّر نسخة للاحتفاظ بها أو نقلها إلى جهاز آخر.</p></div>
          <div className="aw-backup-actions"><button type="button" className="aw-button" disabled={!ready || reading} onClick={exportBackup}><Download size={17} aria-hidden="true" />تصدير نسخة</button>
            <button type="button" className="aw-button aw-button-light" disabled={!ready || reading} onClick={() => fileInput.current?.click()}><Upload size={17} aria-hidden="true" />استيراد نسخة</button></div>
          <small>المفضلة، المقارنة، خطة المعاينات، البحث والملاحظات. مسودات الطلبات خارج النسخة.</small>
        </div>
      </div>
      <input className="aw-hidden-input" ref={fileInput} type="file" accept=".json,application/json" onChange={selectBackup} aria-label="اختر ملف النسخة الاحتياطية بصيغة JSON" tabIndex={-1} />
      <p className="aw-status" role="status" aria-live="polite">{reading ? 'نراجع النسخة قبل عرض معاينة الاستيراد…' : status}</p>
      {error && <p className="aw-error" role="alert">{error}</p>}
      {candidate && plan && <section className="aw-import-preview" aria-labelledby="aw-import-title">
        <div className="aw-import-head"><span><FileJson size={25} aria-hidden="true" /></span><div><h2 id="aw-import-title" ref={previewHeading} tabIndex={-1}>راجع النسخة قبل استيرادها</h2>
          <p><bdi>{candidate.name}</bdi><span> · صُدّرت في {localDate(candidate.backup.exportedAt)}</span></p></div><button type="button" className="aw-icon-button" onClick={() => setCandidate(null)} aria-label="إغلاق معاينة الاستيراد"><X size={21} aria-hidden="true" /></button></div>
        <fieldset className="aw-import-mode"><legend>كيف تريد إضافة هذه النسخة؟</legend>
          <label className={mode === 'merge' ? 'aw-mode-selected' : ''}><input type="radio" name="journey-import-mode" value="merge" checked={mode === 'merge'} onChange={() => setMode('merge')} /><span><b>دمج مع اختياراتي الحالية</b><small>تبقى ملاحظاتك وترتيبك الحالي أولًا عند التعارض.</small></span></label>
          <label className={mode === 'replace' ? 'aw-mode-selected' : ''}><input type="radio" name="journey-import-mode" value="replace" checked={mode === 'replace'} onChange={() => setMode('replace')} /><span><b>استبدال بهذه النسخة</b><small>تُحذف محتويات هذه الأقسام الحالية ويحل الملف محلها.</small></span></label>
        </fieldset>
        <div className="aw-import-table-wrap"><table className="aw-import-table"><caption>الأعداد المتوقعة بعد تطبيق اختيارك</caption><thead><tr><th scope="col">القسم</th><th scope="col">الحالي</th><th scope="col">في الملف</th><th scope="col">بعد الاستيراد</th></tr></thead><tbody>{tabs.map(tab => <tr key={tab.id}><th scope="row">{tab.label}</th><td>{money(plan.before[tab.id])}</td><td>{money(plan.incoming[tab.id])}</td><td><b>{money(plan.after[tab.id])}</b></td></tr>)}</tbody></table></div>
        <p className="aw-import-duration">مدة المعاينة بعد الاستيراد: <b>{money(plan.data.viewingMinutes)} دقيقة</b>. {mode === 'merge' ? 'يحتفظ الدمج بالمدة الحالية.' : 'يستخدم الاستبدال المدة المحفوظة في الملف.'} مسودات طلبات المعاينة خارج نطاق النسخة.</p>
        {(candidate.warnings.length > 0 || Object.values(plan.skipped).some(Boolean)) && <div className="aw-import-notices"><b>تفاصيل المعاينة</b><ul>
          {candidate.warnings.map(warning => <li key={warning}>{warning}</li>)}
          {plan.skipped.compare > 0 && <li>لن تُضاف {money(plan.skipped.compare)} اختيارات من الملف إلى المقارنة لأن سعتها ٣ عقارات؛ تبقى المقارنة الحالية أولًا.</li>}
          {plan.skipped.viewingPlan > 0 && <li>لن تُضاف {money(plan.skipped.viewingPlan)} معاينات من الملف لأن سعة الخطة ٦ عقارات؛ يبقى ترتيبك الحالي أولًا.</li>}
          {plan.skipped.savedSearches > 0 && <li>لن تُضاف {money(plan.skipped.savedSearches)} بحوث من الملف لأن السعة ١٠ بحوث؛ تبقى بحوثك الحالية أولًا.</li>}
          {plan.skipped.noteConflicts > 0 && <li>ستبقى الحالة الحالية لملاحظات {money(plan.skipped.noteConflicts)} عقارات لها ملاحظات مختلفة في الملف، بما فيها الملاحظات التي أفرغتها.</li>}
        </ul></div>}
        {mode === 'replace' && <p className="aw-replace-warning">الاستبدال يشمل الأقسام الخمسة ومدة المعاينة. صدّر نسخة من الحالة الحالية أولًا إذا أردت الاحتفاظ بها.</p>}
        <div className="aw-import-footer"><p><ShieldCheck size={17} aria-hidden="true" />يُقرأ الملف داخل المتصفح، ولا يُرفع إلى خادم.</p><button type="button" className="aw-button aw-button-light" onClick={() => setCandidate(null)}>إلغاء</button><button type="button" className="aw-button" onClick={applyBackup}>{mode === 'merge' ? 'تطبيق الدمج' : 'تأكيد الاستبدال'}<Check size={18} aria-hidden="true" /></button></div>
      </section>}
    </header>

    <div className="shell aw-content" aria-busy={!ready}>
      {ready && <aside className="aw-next"><span className="aw-next-icon"><NextIcon size={28} aria-hidden="true" /></span><div><span className="aw-eyebrow">خطوتك القادمة</span><h2>{nextStep.title}</h2><p>{nextStep.copy}</p></div>
        {nextStep.href.startsWith('#') ? <button type="button" className="aw-next-link" onClick={() => changeTab(nextStep.href === '#viewings' ? 'viewingPlan' : 'favorites')}>{nextStep.action}<ArrowLeft size={18} aria-hidden="true" /></button>
          : <Link className="aw-next-link" href={nextStep.href}>{nextStep.action}<ArrowLeft size={18} aria-hidden="true" /></Link>}</aside>}
      <div className="aw-tablist" ref={tabList} role="tablist" aria-label="أقسام مساحتي">{tabs.map(({ id, label, Icon }, index) => <button key={id} ref={element => { tabButtons.current[index] = element; }} id={`aw-tab-${id}`} type="button" role="tab" aria-selected={active === id} aria-controls={`aw-panel-${id}`} tabIndex={active === id ? 0 : -1} onClick={() => changeTab(id)} onKeyDown={event => onTabKeyDown(event, index)}><Icon size={19} aria-hidden="true" /><span>{label}</span><b>{ready ? money(counts[id]) : '—'}</b></button>)}</div>
      <section className="aw-panel" role="tabpanel" id={`aw-panel-${active}`} aria-labelledby={`aw-tab-${active}`} tabIndex={0}>
        {!ready ? <div className="aw-loading" role="status"><span /><p>نستعيد اختياراتك المحفوظة…</p></div> : <>
          {active === 'favorites' && <><div className="aw-panel-head"><div><h2>ما لفت انتباهك</h2><p>قائمة تحتفظ فيها بالعقارات التي تريد العودة إليها.</p></div><Link className="aw-text-link" href="/properties">استكشف المزيد<ArrowLeft size={17} aria-hidden="true" /></Link></div>
            {favorites.length ? <div className="propertyGrid aw-property-grid">{favorites.map(property => <PropertyCard key={property.slug} p={property} />)}</div>
              : <EmptyState icon={<Heart size={30} aria-hidden="true" />} title="مساحة لاختياراتك المفضلة" copy="اضغط علامة القلب على أي عقار ليبقى هنا، جاهزًا للمقارنة والعودة إلى تفاصيله." href="/properties" action="اكتشف العقارات" />}</>}
          {active === 'compare' && <><div className="aw-panel-head"><div><h2>الفروق تصنع القرار</h2><p>اختر حتى ثلاثة عقارات لمقارنة السعر والمواصفات بوضوح.</p></div>{compared.length >= 2 && <Link className="aw-button" href="/compare">افتح المقارنة<ArrowLeft size={17} aria-hidden="true" /></Link>}</div>
            {compared.length ? <>{compared.length === 1 && <p className="aw-inline-note">لديك عقار واحد. أضف عقارًا آخر باستخدام علامة الميزان لتبدأ المقارنة.</p>}<div className="propertyGrid aw-property-grid">{compared.map(property => <PropertyCard key={property.slug} p={property} />)}</div><Link className="aw-text-link aw-under-grid" href="/properties">اختر عقارات إضافية<ArrowLeft size={17} aria-hidden="true" /></Link></>
              : <EmptyState icon={<Scale size={30} aria-hidden="true" />} title="كل التفاصيل في نظرة واحدة" copy="استخدم علامة الميزان على بطاقات العقارات، ثم افتح المقارنة لمراجعة اختياراتك جنبًا إلى جنب." href="/properties" action="اختر للمقارنة" />}</>}
          {active === 'viewingPlan' && <><div className="aw-panel-head"><div><h2>خطتك على أرض الواقع</h2><p>حتى ستة عقارات، بالترتيب الذي اخترته. هذه خطة شخصية تحتاج مواعيدها إلى تأكيد منفصل.</p></div>{viewings.length > 0 && <Link className="aw-button" href="/viewing-planner">رتّب الخطة<Route size={17} aria-hidden="true" /></Link>}</div>
            {viewings.length ? <><div className="aw-plan-summary"><CalendarDays size={20} aria-hidden="true" /><span>{money(viewings.length)} معاينات · {money(snapshot.viewingMinutes)} دقيقة لكل معاينة</span><b>الإجمالي: {money(viewings.length * snapshot.viewingMinutes)} دقيقة</b><small>وقت المعاينات فقط، دون الانتقال.</small></div><div className="aw-viewing-list">{viewings.map((property, index) => <WorkspacePropertyRow key={property.slug} property={property} ordinal={index + 1}><button type="button" className="aw-icon-button aw-remove" onClick={() => removeViewing(property.slug)} aria-label={`إزالة ${property.title} من خطة المعاينات`}><Trash2 size={18} aria-hidden="true" /></button></WorkspacePropertyRow>)}</div></>
              : drafts.length > 0 ? <p className="aw-inline-note">مسوداتك تظهر أدناه. يمكنك أيضًا <Link href="/viewing-planner">بناء خطة لترتيب العقارات التي تنوي معاينتها.</Link></p>
                : <EmptyState icon={<CalendarDays size={30} aria-hidden="true" />} title="رتّب زياراتك قبل أن تبدأ" copy="أضف العقارات التي تود معاينتها من علامة التقويم على البطاقة، ثم رتّبها وحدد وقتًا مبدئيًا لكل زيارة." href="/viewing-planner" action="ابنِ خطة معايناتي" />}
              {drafts.length > 0 && <section className="aw-drafts" aria-labelledby="aw-drafts-title"><div className="aw-panel-head"><div><h2 id="aw-drafts-title">مسودات طلبات المعاينة</h2><p>مواعيد اقترحتها وحفظتها هنا. لم تُرسل هذه المسودات إلى المعلن ولم تُؤكَّد مواعيدها.</p></div><span className="aw-local-badge">{money(drafts.length)} مسودات محلية</span></div><div className="aw-draft-grid">{drafts.map(draft => { const property = catalogue.get(draft.slug)!; return <article className="aw-draft-card" key={draft.slug}><span className="aw-draft-label"><CalendarDays size={17} aria-hidden="true" />موعد مقترح</span><h3>{property.title}</h3><p>{property.city} · {property.district}</p><div className="aw-draft-date"><time dateTime={draft.date}>{localDate(`${draft.date}T12:00:00.000Z`)}</time><span>{draft.time}</span></div>{draft.message && <p className="aw-draft-message">{draft.message}</p>}<Link className="aw-text-link" href={`/properties/${draft.slug}#property-viewing`}>راجع المسودة أو عدّلها<ArrowLeft size={16} aria-hidden="true" /></Link></article>; })}</div></section>}
            </>}
          {active === 'savedSearches' && <><div className="aw-panel-head"><div><h2>عد إلى ما تبحث عنه</h2><p>افتح شروطك المحفوظة بنفس الفلاتر، وشاهد ما يطابقها في الكتالوج الحالي.</p></div><Link className="aw-text-link" href="/properties">بحث جديد<Search size={17} aria-hidden="true" /></Link></div>
            {snapshot.savedSearches.length ? <div className="aw-search-grid">{snapshot.savedSearches.map(search => <article className="aw-search-card" key={search.fingerprint}><div className="aw-search-card-top"><span><Bookmark size={19} aria-hidden="true" />بحث محفوظ</span><button type="button" className="aw-icon-button" onClick={() => removeSearch(search.fingerprint)} aria-label={`حذف البحث: ${savedSearchTitle(search)}`}><Trash2 size={17} aria-hidden="true" /></button></div><h3>{savedSearchTitle(search)}</h3><p>حتى <b>{money(search.max)} ر.س</b>{search.purpose === 'للإيجار' && ' سنويًا'}</p>
              <div className="aw-search-chips"><span>{search.city === 'الكل' ? 'كل المدن' : search.city}</span><span>{search.type === 'الكل' ? 'كل الأنواع' : search.type}</span>{search.beds > 0 && <span>{money(search.beds)} غرف فأكثر</span>}{search.minArea > 0 && <span>من {money(search.minArea)} م²</span>}{search.maxArea !== undefined && <span>حتى {money(search.maxArea)} م²</span>}{search.residentialOnly && <span>سكني فقط</span>}</div>
              <footer><span>{money(filterProperties(properties, search).length)} مطابق الآن</span><Link href={search.url}>فتح النتائج<ArrowLeft size={17} aria-hidden="true" /></Link></footer></article>)}</div>
              : <EmptyState icon={<Bookmark size={30} aria-hidden="true" />} title="بحثك القادم يبدأ من هنا" copy="اضبط المدينة والميزانية والاحتياجات في صفحة العقارات، ثم اضغط «احفظ البحث» لتعود إليه بضغطة واحدة." href="/properties" action="ابحث واحفظ شروطك" />}</>}
          {active === 'notes' && <><div className="aw-panel-head"><div><h2>التفاصيل التي تهمك</h2><p>ملاحظاتك وقائمة مراجعتك لكل عقار، لتعود إلى ما لاحظته قبل القرار.</p></div><Link className="aw-text-link" href="/properties">استكشف العقارات<ArrowLeft size={17} aria-hidden="true" /></Link></div>
            {noteEntries.length ? <div className="aw-note-grid">{noteEntries.map(([slug, note]) => { const property = catalogue.get(slug)!; return <article className="aw-note-card" key={slug}><div className="aw-note-head"><Image src={property.image} alt={property.title} width={120} height={100} sizes="72px" /><div><span>{property.city} · {property.district}</span><h3><Link href={`/properties/${slug}#property-notes`}>{property.title}</Link></h3></div><NotebookPen size={20} aria-hidden="true" /></div>
              <p className="aw-note-text">{note.note || 'لديك نقاط مراجعة محفوظة لهذا العقار.'}</p>
              {note.checklist.length > 0 && <div className="aw-note-checks"><span><CheckCheck size={17} aria-hidden="true" />{money(note.checklist.length)} من {money(PROPERTY_CHECKLIST.length)} نقاط راجعتها</span><div>{PROPERTY_CHECKLIST.filter(item => note.checklist.includes(item.id)).map(item => <span key={item.id}><Check size={12} aria-hidden="true" />{item.label}</span>)}</div></div>}
              <footer><time dateTime={note.updatedAt}>آخر تعديل {localDate(note.updatedAt)}</time><Link href={`/properties/${slug}#property-notes`}>فتح الملاحظات<ArrowUpRight size={17} aria-hidden="true" /></Link></footer></article>; })}</div>
              : <EmptyState icon={<NotebookPen size={30} aria-hidden="true" />} title="لا تفقد ملاحظة مهمة" copy="افتح تفاصيل أي عقار وسجّل ما يهمك في قسم «ملاحظاتي». ستجد ملاحظاتك وقائمة المراجعة مجتمعة هنا." href="/properties" action="اختر عقارًا لتدوين ملاحظاتك" />}</>}
        </>}
      </section>
      <div className="aw-bottom-note"><ShieldCheck size={18} aria-hidden="true" /><p>{total > 0 ? 'اختياراتك مرتبطة بهذا المتصفح. ' : 'تبدأ هذه المساحة باختياراتك أنت. '}التصدير يشمل الأقسام الخمسة ومدة خطة المعاينة؛ مسودات الطلبات خارج النسخة.</p><Link href="/tools">كل أدوات القرار<ArrowLeft size={16} aria-hidden="true" /></Link></div>
    </div>
  </div>;
}
