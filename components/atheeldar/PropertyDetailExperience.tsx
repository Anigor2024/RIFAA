'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Bath, BedDouble, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Copy, Heart, Images, MapPin, Maximize2, NotebookPen, Scale, Share2, WalletCards, X, ClipboardCheck } from 'lucide-react';
import { money, type Property } from '@/lib/atheeldar-data';
import { readStoredIds, STORAGE_KEYS, subscribeStoredIds, toggleStoredId, writeStoredIds } from '@/lib/browser-storage';
import { MAX_PROPERTY_NOTE_LENGTH, PROPERTY_CHECKLIST, readPropertyNotes, savePropertyNote, type PropertyChecklistId } from '@/lib/property-notes';
import { readViewingDrafts, saudiToday, saveViewingDraft, VIEWING_TIMES, type ViewingDraft, type ViewingTime } from '@/lib/viewing-drafts';
import { useOverlay } from '@/hooks/use-overlay';
import './property-detail.css';

const temporaryNotice = 'تعذّر الحفظ الدائم. التغيير متاح خلال هذه الزيارة فقط.';
type PropertyNeighborhood = { name: string; image: string; slug: string };

export function PropertyDetailExperience({ property: p, neighborhood }: { property: Property; neighborhood?: PropertyNeighborhood }) {
  const gallery = [...new Set([p.image, ...p.gallery])];
  const isRental = p.purpose === 'للإيجار';
  const propertyUrl = `/properties/${p.slug}`;
  const [selected, setSelected] = useState({ favorite: false, compared: false, planned: false });
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [overlay, setOverlay] = useState<'gallery' | 'share' | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [note, setNote] = useState('');
  const [checklist, setChecklist] = useState<PropertyChecklistId[]>([]);
  const [noteUpdated, setNoteUpdated] = useState('');
  const [noteStatus, setNoteStatus] = useState('');
  const [dirty, setDirty] = useState(false);
  const noteDirty = useRef(false);
  const [today, setToday] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState<ViewingTime>('4:00 م');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<ViewingDraft | null>(null);
  const [draftStatus, setDraftStatus] = useState('');
  const [draftError, setDraftError] = useState('');
  const dialogRef = useOverlay<HTMLDivElement>(overlay !== null, () => setOverlay(null));

  useEffect(() => {
    const load = () => {
      setSelected({ favorite: readStoredIds(STORAGE_KEYS.favorites).includes(p.slug), compared: readStoredIds(STORAGE_KEYS.compare).includes(p.slug), planned: readStoredIds(STORAGE_KEYS.viewingPlan).includes(p.slug) });
      if (!noteDirty.current) {
        const saved = readPropertyNotes()[p.slug];
        setNote(saved?.note ?? ''); setChecklist(saved?.checklist ?? []); setNoteUpdated(saved && (saved.note.trim() || saved.checklist.length) ? saved.updatedAt : '');
      }
    };
    load();
    const savedDraft = readViewingDrafts().find(item => item.slug === p.slug);
    if (savedDraft) { setDraft(savedDraft); setDate(savedDraft.date); setTime(savedDraft.time); setMessage(savedDraft.message); }
    setToday(saudiToday()); setReady(true);
    const recent = readStoredIds(STORAGE_KEYS.recent);
    writeStoredIds(STORAGE_KEYS.recent, [p.slug, ...recent.filter(slug => slug !== p.slug)].slice(0, 8));
    return subscribeStoredIds(load);
  }, [p.slug]);

  useEffect(() => {
    if (overlay !== 'gallery' || gallery.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setActiveImage(value => (value + (event.key === 'ArrowLeft' ? 1 : -1) + gallery.length) % gallery.length); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay, gallery.length]);

  const toggle = (key: typeof STORAGE_KEYS.favorites | typeof STORAGE_KEYS.compare | typeof STORAGE_KEYS.viewingPlan) => {
    const result = toggleStoredId(key, p.slug);
    const label = key === STORAGE_KEYS.favorites ? 'المفضلة' : key === STORAGE_KEYS.compare ? 'المقارنة' : 'جولة المعاينة';
    if (result.atCapacity) setStatus(key === STORAGE_KEYS.compare ? 'المقارنة تتسع لثلاثة عقارات. افتح المقارنة وأزل خيارًا لإضافة هذا العقار.' : 'الجولة تتسع لستة عقارات. افتح مخطط المعاينات لتعديل اختياراتك.');
    else setStatus(result.persisted ? (result.added ? `أُضيف ${p.title} إلى ${label}.` : `أُزيل ${p.title} من ${label}.`) : temporaryNotice);
  };
  const openGallery = (index: number) => { setActiveImage(index); setOverlay('gallery'); };
  const share = async () => {
    const url = `${window.location.origin}${propertyUrl}`;
    setShareUrl(url); setShareStatus('');
    if (navigator.share) {
      try { await navigator.share({ title: `${p.title} | أثيلدار`, url }); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    setOverlay('share');
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setShareStatus('نُسخ رابط العقار.'); }
    catch { setShareStatus('يمكنك تحديد الرابط ونسخه يدويًا من الحقل.'); }
  };
  const changeNote = (value: string) => { noteDirty.current = true; setDirty(true); setNote(value); setNoteStatus(''); };
  const changeCheck = (id: PropertyChecklistId) => { noteDirty.current = true; setDirty(true); setNoteStatus(''); setChecklist(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); };
  const saveNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = savePropertyNote(p.slug, { note, checklist });
    noteDirty.current = false; setDirty(false); setNoteUpdated(result.notes[p.slug]?.updatedAt ?? '');
    setNoteStatus(result.persisted ? 'حُفظت ملاحظتك وقائمة المراجعة على هذا المتصفح.' : temporaryNotice);
  };
  const saveDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setDraftError(''); setDraftStatus(''); setToday(saudiToday());
    const result = saveViewingDraft(p, date, time, message);
    if (!result) { setDraftError('اختر يومًا ووقتًا قادمين. الأوقات المعروضة بتوقيت السعودية.'); return; }
    setDraft(result.draft);
    let planMessage = ''; let persisted = result.persisted;
    if (!readStoredIds(STORAGE_KEYS.viewingPlan).includes(p.slug)) {
      const plan = toggleStoredId(STORAGE_KEYS.viewingPlan, p.slug); persisted = persisted && plan.persisted;
      planMessage = plan.atCapacity ? ' جولة المعاينة ممتلئة؛ حُفظت المسودة ولم يُضف العقار إلى الجولة.' : ' أُضيف العقار أيضًا إلى جولة المعاينة.';
    }
    setDraftStatus((persisted ? 'حُفظت مسودة الموعد.' : temporaryNotice) + planMessage);
  };

  const ppm = Math.round(p.price / p.area);
  return <div className="at-property-detail">
    <header className="shell at-pd-head">
      <nav aria-label="مسار الصفحة" className="at-pd-breadcrumb"><Link href="/">الرئيسية</Link><ChevronLeft size={13}/><Link href="/properties">العقارات</Link><ChevronLeft size={13}/><span aria-current="page">{p.title}</span></nav>
      <div className="at-pd-heading-row"><div><div className="at-pd-kicker"><span>{p.type} {p.purpose}</span><span className="at-pd-demo">عرض توضيحي</span></div><h1>{p.title}</h1><p className="at-pd-address"><MapPin size={18}/>{p.district}، {p.city}</p></div><div className="at-pd-heading-price"><span>{isRental ? 'الإيجار السنوي' : 'سعر العرض'}</span><p><strong>{money(p.price)}</strong> <span>ر.س{isRental && ' / سنة'}</span></p></div></div>
      <div className="at-pd-action-row"><div className="at-pd-actions"><button type="button" onClick={() => toggle(STORAGE_KEYS.favorites)} disabled={!ready} aria-pressed={selected.favorite}><Heart size={18} fill={selected.favorite ? 'currentColor' : 'none'}/>{selected.favorite ? 'في المفضلة' : 'احفظ العقار'}</button><button type="button" onClick={() => toggle(STORAGE_KEYS.compare)} disabled={!ready} aria-pressed={selected.compared}><Scale size={18}/>{selected.compared ? 'في المقارنة' : 'أضف للمقارنة'}</button><button type="button" onClick={share}><Share2 size={17}/>مشاركة</button></div><span className="at-pd-photo-caption">صور وبيانات توضيحية لتجربة المنصة</span></div>
      <p className="at-pd-status" role="status" aria-live="polite">{status}</p>
    </header>
    <section className="shell at-pd-gallery" aria-label={`صور ${p.title}`} data-count={Math.min(gallery.length, 3)}>{gallery.slice(0, 3).map((src, index) => <button className={`at-pd-gallery-item at-pd-gallery-item-${index}`} key={src} onClick={() => openGallery(index)} aria-label={`افتح الصورة ${index + 1} من ${gallery.length} — ${p.title}`}><Image src={src} alt={`${p.title} — صورة توضيحية ${index + 1}`} fill priority={index === 0} sizes={index === 0 ? '(max-width: 700px) 100vw, 65vw' : '(max-width: 700px) 50vw, 30vw'} quality={85}/>{index === 0 && <span className="at-pd-gallery-label"><Images size={17}/>عرض الصور <b>{money(gallery.length)}</b></span>}</button>)}</section>
    <nav className="at-pd-section-nav" aria-label="أقسام العقار"><div className="shell"><a href="#property-overview">نظرة عامة</a><a href="#property-features">المزايا</a><a href="#property-location">الحي والموقع</a><a href="#property-notes">ملاحظاتي</a><a href="#property-viewing">المعاينة</a></div></nav>
    <div className="shell at-pd-layout"><div className="at-pd-main">
      <section id="property-overview" className="at-pd-section"><div className="at-pd-specs"><div><Maximize2/><strong>{money(p.area)} <small>م²</small></strong><span>مساحة العقار</span></div>{p.beds > 0 && <div><BedDouble/><strong>{money(p.beds)}</strong><span>غرف نوم</span></div>}{p.baths > 0 && <div><Bath/><strong>{money(p.baths)}</strong><span>دورات مياه</span></div>}<div><WalletCards/><strong>{money(ppm)} <small>ر.س</small></strong><span>للمتر{isRental ? ' سنويًا' : ' المربع'}</span></div></div><p className="at-pd-eyebrow">المساحة التي تستحق أن تعرفها</p><h2>تفاصيل أقرب إلى يومك.</h2><p className="at-pd-description">{p.description}</p><div className="at-pd-facts"><span><small>نوع العقار</small><b>{p.type}</b></span><span><small>الغرض</small><b>{isRental ? 'إيجار سنوي' : 'شراء'}</b></span><span><small>المدينة والحي</small><b>{p.city} · {p.district}</b></span></div></section>
      <section id="property-features" className="at-pd-section"><p className="at-pd-eyebrow">ما يميّز المكان</p><h2>مساحات وتجهيزات.</h2><ul className="at-pd-feature-list">{p.features.map(feature => <li key={feature}><Check size={17}/>{feature}</li>)}</ul><p className="at-pd-small">راجع تفاصيل التجهيزات وحالتها أثناء المعاينة.</p></section>
      <section id="property-location" className="at-pd-section"><p className="at-pd-eyebrow">ابدأ من الحي</p><h2>{p.district}، {p.city}.</h2><div className="at-pd-neighborhood">{neighborhood && <div className="at-pd-neighborhood-image"><Image src={neighborhood.image} alt={`صورة توضيحية لملف حي ${p.district}`} fill sizes="(max-width: 700px) 90vw, 350px"/></div>}<div><MapPin size={24}/><h3>اختبر المكان بطريقتك.</h3><p>راجع سياق الحي، ثم دوّن أسئلتك عن الخدمات والمشاوير والهدوء حول العقار.</p><Link href={`/neighborhoods/${p.neighborhoodSlug}`} className="at-text-link">استكشف ملف الحي <ArrowLeft size={17}/></Link><small>موقع العرض على مستوى الحي؛ لا يتوفر عنوان شارع دقيق في هذا النموذج.</small></div></div></section>
      <section id="property-notes" className="at-pd-section at-pd-notes"><div className="at-pd-notes-heading"><div><p className="at-pd-eyebrow">ذاكرتك الخاصة بهذا العقار</p><h2>قرارك، بتفاصيلك.</h2></div><NotebookPen size={30}/></div><p>سجّل انطباعك، وحدّد ما راجعته قبل خطوتك التالية. ستجد هذه الملاحظات في مساحتك.</p><form onSubmit={saveNote}><div className="at-pd-checklist-head"><b>قائمة المراجعة الشخصية</b><span>{money(checklist.length)} / {money(PROPERTY_CHECKLIST.length)} مكتمل</span></div><div className="at-pd-progress" aria-hidden="true"><span style={{ width: `${checklist.length / PROPERTY_CHECKLIST.length * 100}%` }}/></div><div className="at-pd-checklist">{PROPERTY_CHECKLIST.map(item => <label key={item.id}><input type="checkbox" checked={checklist.includes(item.id)} onChange={() => changeCheck(item.id)} disabled={!ready}/><span><b>{item.label}</b><small>{item.description}</small></span></label>)}</div><label className="at-pd-note-label" htmlFor="property-note">ما الذي تريد تذكّره؟</label><textarea id="property-note" value={note} onChange={event => changeNote(event.target.value)} maxLength={MAX_PROPERTY_NOTE_LENGTH} rows={5} placeholder="ما أعجبك؟ ما الأسئلة التي تحتاج إجابة؟ ما الذي ستراجعه أثناء المعاينة؟" disabled={!ready}/><div className="at-pd-note-meta"><span>{dirty ? 'تغييرات بانتظار الحفظ' : noteUpdated ? `آخر حفظ: ${new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeZone: 'Asia/Riyadh' }).format(new Date(noteUpdated))}` : 'الملاحظات خاصة بهذا المتصفح'}</span><span>{money(note.length)} / {money(MAX_PROPERTY_NOTE_LENGTH)}</span></div><div className="at-pd-note-actions"><button className="at-button" type="submit" disabled={!ready}><Check size={17}/>حفظ الملاحظة والقائمة</button><Link href="/account#notes">كل ملاحظاتي <ArrowLeft size={16}/></Link></div><p role="status" aria-live="polite" className="at-pd-note-status">{noteStatus}</p></form></section>
      <section className="at-pd-decision-links" aria-label="أدوات هذا العقار"><Link href={`${propertyUrl}/inspection`}><ClipboardCheck/><span><b>تقرير المعاينة</b><small>قيّم ما شاهدته بعد زيارة العقار</small></span><ArrowLeft size={18}/></Link><Link href={`${propertyUrl}/deal-room`}><NotebookPen/><span><b>مساحة التفاوض</b><small>رتّب عرضك وأسئلتك والخطوات المتبقية</small></span><ArrowLeft size={18}/></Link></section>
    </div><aside className="at-pd-sidebar" aria-label="خطوتك التالية"><div className="at-pd-sidebar-inner"><section className="at-pd-next-card"><span className="at-pd-eyebrow">من الإعجاب إلى خطوة واضحة</span><h2>{isRental ? 'خطّط لتكلفة سكنك.' : 'اعرف ميزانيتك أولًا.'}</h2>{isRental ? <><div className="at-pd-rent-monthly"><span>متوسط الإيجار الشهري</span><b>{money(Math.round(p.price / 12))} <small>ر.س</small></b></div><p>الإيجار السنوي ÷ ١٢ لتخطيط الميزانية؛ جدول الدفعات الفعلي غير محدد في العرض.</p></> : <><p>ابدأ من سعر هذا العقار. عدّل الدفعة الأولى والمدة، وقارن سيناريوهين حسب ميزانيتك.</p><Link href={`/finance?property=${p.slug}`} className="at-button"><WalletCards size={18}/>احسب تمويل هذا العقار <ArrowLeft size={17}/></Link></>}<div className="at-pd-next-tools"><button type="button" onClick={() => toggle(STORAGE_KEYS.viewingPlan)} aria-pressed={selected.planned} disabled={!ready}><CalendarDays size={18}/>{selected.planned ? 'مضاف إلى جولة المعاينة' : 'أضف إلى جولة المعاينة'}{selected.planned && <Check size={16}/>}</button><div><Link href="/viewing-planner">افتح جولتي</Link><Link href="/compare">افتح المقارنة</Link></div></div></section>
      <section id="property-viewing" className="at-pd-viewing-card"><div className="at-pd-viewing-title"><CalendarDays size={24}/><span>المعاينة تبدأ بسؤال</span></div><h2>اختر وقتًا يناسبك.</h2><p>جهّز اقتراح موعد واحتفظ به في مساحتك. المسودة محلية، ولم تُرسل إلى معلن أو مستشار.</p><form onSubmit={saveDraft}><div className="at-pd-viewing-fields"><label>اليوم المقترح<input type="date" name="viewing-date" value={date} min={today || undefined} onChange={event => { setDate(event.target.value); setDraftStatus(''); setDraftError(''); }} required disabled={!ready}/></label><label>الوقت المقترح<select value={time} onChange={event => { setTime(event.target.value as ViewingTime); setDraftStatus(''); setDraftError(''); }} disabled={!ready}>{VIEWING_TIMES.map(slot => <option key={slot}>{slot}</option>)}</select></label></div><small className="at-pd-small">جميع الأوقات بتوقيت السعودية</small><label className="at-pd-message-label">رسالة لنفسك <span>اختياري</span><textarea value={message} onChange={event => { setMessage(event.target.value); setDraftStatus(''); }} maxLength={1000} rows={2} placeholder="مثلًا: اصطحاب مخطط الأثاث ومراجعة الإضاءة" disabled={!ready}/></label>{draftError && <p className="at-pd-error" role="alert">{draftError}</p>}<button type="submit" className="at-button" disabled={!ready}><CalendarDays size={17}/>{draft ? 'تحديث مسودة الموعد' : 'احفظ مسودة الموعد'}</button><p role="status" aria-live="polite" className="at-pd-draft-status">{draftStatus}</p></form>{draft && <div className="at-pd-saved-draft"><CheckCircle2 size={18}/><span>مسودة غير مؤكدة <b>{draft.date} · {draft.time}</b><Link href="/account#viewings">راجعها في مساحتي <ArrowLeft size={14}/></Link></span></div>}</section><p className="at-pd-sidebar-footnote">هذا العرض جزء من كتالوج توضيحي. الصور والمواصفات والأسعار ليست إعلانًا موثّقًا لعقار متاح.</p></div></aside></div>
    {overlay && createPortal(<div className={`at-overlay at-pd-overlay at-pd-${overlay}-overlay`} onClick={() => setOverlay(null)}><div ref={dialogRef} className={`at-pd-dialog at-pd-${overlay}-dialog`} role="dialog" aria-modal="true" aria-labelledby="property-dialog-title" tabIndex={-1} onClick={event => event.stopPropagation()}><div className="at-pd-dialog-head"><div><h2 id="property-dialog-title">{overlay === 'gallery' ? p.title : 'شارك هذا العقار'}</h2><span>{overlay === 'gallery' ? `${p.district}، ${p.city} · صور توضيحية` : 'رابط مباشر إلى التفاصيل والخصائص'}</span></div><button className="at-icon" onClick={() => setOverlay(null)} aria-label={overlay === 'gallery' ? 'إغلاق معرض الصور' : 'إغلاق المشاركة'}><X/></button></div>{overlay === 'gallery' ? <><div className="at-pd-lightbox-stage"><Image src={gallery[activeImage]} alt={`${p.title} — الصورة ${activeImage + 1} من ${gallery.length}`} fill sizes="95vw" quality={90} priority/>{gallery.length > 1 && <><button className="at-pd-image-prev" onClick={() => setActiveImage(value => (value - 1 + gallery.length) % gallery.length)} aria-label="الصورة السابقة"><ChevronRight/></button><button className="at-pd-image-next" onClick={() => setActiveImage(value => (value + 1) % gallery.length)} aria-label="الصورة التالية"><ChevronLeft/></button></>}</div><div className="at-pd-lightbox-bottom"><span role="status" aria-live="polite">الصورة {money(activeImage + 1)} من {money(gallery.length)}</span>{gallery.length > 1 && <div>{gallery.map((src, index) => <button key={src} onClick={() => setActiveImage(index)} aria-label={`الصورة ${index + 1} — ${p.title}`} aria-current={activeImage === index ? 'true' : undefined}><Image src={src} alt="" width={92} height={60}/></button>)}</div>}</div></> : <div className="at-pd-share-content"><label htmlFor="property-share-url">رابط العقار</label><input id="property-share-url" value={shareUrl} readOnly dir="ltr" onFocus={event => event.target.select()}/><button className="at-button" onClick={copyLink}><Copy size={17}/>نسخ الرابط</button><p role="status">{shareStatus}</p></div>}</div></div>, document.body)}
  </div>;
}
