'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Bath, BedDouble, CalendarPlus, Check, Eye, Heart, MapPin, Maximize2, Scale, X } from 'lucide-react';
import { money, type Property } from '@/lib/atheeldar-data';
import { readStoredIds, STORAGE_KEYS, subscribeStoredIds, toggleStoredId, writeStoredIds, type StorageToggleResult } from '@/lib/browser-storage';

type PropertyCardProps = {
  p: Property;
  /** Notification after the card updates shared storage; do not toggle again. */
  onCompare?: (slug: string) => void;
};

const temporarySaveNotice = 'تعذّر الحفظ الدائم في هذا المتصفح. التغيير متاح خلال هذه الزيارة فقط.';

export function PropertyCard({ p, onCompare }: PropertyCardProps) {
  const [fav, setFav] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [compared, setCompared] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState('');
  const dialogTitleId = useId();
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const isRental = p.purpose === 'للإيجار';
  const propertyUrl = `/properties/${p.slug}`;

  useEffect(() => {
    const read = () => {
      setFav(readStoredIds(STORAGE_KEYS.favorites).includes(p.slug));
      setPlanned(readStoredIds(STORAGE_KEYS.viewingPlan).includes(p.slug));
      setCompared(readStoredIds(STORAGE_KEYS.compare).includes(p.slug));
    };
    const unsubscribe = subscribeStoredIds(read);
    read();
    return unsubscribe;
  }, [p.slug]);

  useEffect(() => {
    if (!preview) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : previewTrigger.current;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay.current)
      .map(element => ({ element, wasInert: element.inert }));

    document.body.style.overflow = 'hidden';
    background.forEach(({ element }) => { element.inert = true; });
    closeButton.current?.focus({ preventScroll: true });

    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []).filter(element => element.getClientRects().length > 0 && !element.closest('[hidden], [inert], [aria-hidden="true"]'));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setPreview(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = focusable();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) {
        event.preventDefault();
        panel.current?.focus();
      } else if (event.shiftKey && (document.activeElement === first || !panel.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel.current?.contains(event.target)) closeButton.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocus);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, wasInert }) => { element.inert = wasInert; });
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [preview]);

  const announce = (result: StorageToggleResult, added: string, removed: string) => {
    setStatus(`${result.added ? added : removed}${result.persisted ? '' : ` ${temporarySaveNotice}`}`);
  };
  const toggleFavorite = () => {
    const result = toggleStoredId(STORAGE_KEYS.favorites, p.slug);
    announce(result, `حُفظ ${p.title} في المفضلة.`, `أُزيل ${p.title} من المفضلة.`);
  };
  const togglePlan = () => {
    const result = toggleStoredId(STORAGE_KEYS.viewingPlan, p.slug, 6);
    if (result.atCapacity) {
      setStatus('يمكن إضافة ٦ عقارات إلى مخطط المعاينات. أزل عقارًا من المخطط قبل إضافة اختيار جديد.');
      return;
    }
    announce(result, `أُضيف ${p.title} إلى مخطط المعاينات.`, `أُزيل ${p.title} من مخطط المعاينات.`);
  };
  const toggleCompare = () => {
    const result = toggleStoredId(STORAGE_KEYS.compare, p.slug, 3);
    if (result.atCapacity) {
      setStatus('يمكن مقارنة ٣ عقارات كحد أقصى. أزل عقارًا من المقارنة قبل إضافة اختيار جديد.');
      return;
    }
    announce(result, `أُضيف ${p.title} إلى المقارنة.`, `أُزيل ${p.title} من المقارنة.`);
    onCompare?.(p.slug);
  };
  const remember = () => {
    const recent = readStoredIds(STORAGE_KEYS.recent);
    const result = writeStoredIds(STORAGE_KEYS.recent, [p.slug, ...recent.filter(slug => slug !== p.slug)].slice(0, 8));
    if (!result.persisted) setStatus(temporarySaveNotice);
  };

  const previewDialog = preview ? (
    <div ref={overlay} className="quickPreviewOverlay">
      <button type="button" className="quickPreviewBackdrop" tabIndex={-1} onClick={() => setPreview(false)} aria-label="إغلاق المعاينة" />
      <section ref={panel} className="quickPreviewPanel" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId} tabIndex={-1}>
        <button ref={closeButton} type="button" className="quickPreviewClose" onClick={() => setPreview(false)} aria-label="إغلاق المعاينة السريعة"><X aria-hidden="true" /></button>
        <div className="quickPreviewMedia">
          <img src={p.image} alt={p.title} width={960} height={720} loading="lazy" decoding="async" />
          <span>عرض توضيحي</span>
        </div>
        <div className="quickPreviewBody">
          <div className="quickPreviewKicker"><span>{p.type}</span><span>{p.purpose}</span></div>
          <h2 id={dialogTitleId}>{p.title}</h2>
          <p className="quickPreviewLocation"><MapPin aria-hidden="true" />{p.city} · {p.district}</p>
          <p>{p.description}</p>
          <div className="quickPreviewSpecs">
            {p.beds > 0 && <span><BedDouble aria-hidden="true" />{p.beds}<small>غرف</small></span>}
            {p.baths > 0 && <span><Bath aria-hidden="true" />{p.baths}<small>حمامات</small></span>}
            <span><Maximize2 aria-hidden="true" />{money(p.area)}<small>م²</small></span>
          </div>
          <div className="quickPreviewPrice">
            <span><small>{isRental ? 'الإيجار السنوي' : 'السعر'}</small><b>{money(p.price)} ر.س{isRental && <small> / سنوي</small>}</b></span>
          </div>
          <div className="quickPreviewActions">
            <button type="button" onClick={toggleFavorite} aria-pressed={fav}><Heart aria-hidden="true" fill={fav ? 'currentColor' : 'none'} />{fav ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}</button>
            <button type="button" onClick={togglePlan} aria-pressed={planned}><CalendarPlus aria-hidden="true" />{planned ? 'في مخطط المعاينات' : 'أضف للمعاينة'}</button>
            <button type="button" onClick={toggleCompare} aria-pressed={compared}><Scale aria-hidden="true" />{compared ? 'ضمن المقارنة' : 'أضف للمقارنة'}</button>
            <Link href={propertyUrl} onClick={remember}>فتح التفاصيل الكاملة <ArrowLeft aria-hidden="true" /></Link>
          </div>
          <p className="propertyStatus" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </div>
      </section>
    </div>
  ) : null;

  return (
    <>
      <article className="propertyCard">
        <div className="propertyMedia" style={{ aspectRatio: '4 / 3' }}>
          <Link href={propertyUrl} onClick={remember} aria-label={`عرض ${p.title}`}>
            <img src={p.image} alt={p.title} width={800} height={600} loading="lazy" decoding="async" />
          </Link>
          <div className="mediaBadges"><span>عرض توضيحي</span></div>
          <div className="propertyCardUtility">
            <button type="button" className={`heartButton ${fav ? 'on' : ''}`} onClick={toggleFavorite} aria-pressed={fav} aria-label={`${fav ? 'إزالة' : 'إضافة'} ${p.title} ${fav ? 'من' : 'إلى'} المفضلة`}><Heart size={19} aria-hidden="true" fill={fav ? 'currentColor' : 'none'} /></button>
            <button type="button" className={`planButton ${planned ? 'on' : ''}`} onClick={togglePlan} aria-pressed={planned} aria-label={`${planned ? 'إزالة' : 'إضافة'} ${p.title} ${planned ? 'من' : 'إلى'} مخطط المعاينات`}>{planned ? <Check size={17} aria-hidden="true" /> : <CalendarPlus size={17} aria-hidden="true" />}</button>
            <button type="button" className={`compareButton ${compared ? 'on' : ''}`} onClick={toggleCompare} aria-pressed={compared} aria-label={`${compared ? 'إزالة' : 'إضافة'} ${p.title} ${compared ? 'من' : 'إلى'} المقارنة`}><Scale size={17} aria-hidden="true" /></button>
          </div>
          <button ref={previewTrigger} type="button" className="quickPreviewButton" onClick={() => { setStatus(''); setPreview(true); }} aria-label={`معاينة سريعة: ${p.title}`} aria-haspopup="dialog"><Eye size={17} aria-hidden="true" /><span>معاينة سريعة</span></button>
        </div>
        <div className="propertyContent">
          <div className="propertyMeta"><span>{p.purpose}</span><span>{p.type}</span></div>
          <Link href={propertyUrl} onClick={remember} className="propertyTitle">{p.title}</Link>
          <p className="propertyLocation"><MapPin size={14} aria-hidden="true" />{p.city} · {p.district}</p>
          <div className="propertySpecs">
            {p.beds > 0 && <span><BedDouble size={16} aria-hidden="true" />{p.beds} غرف</span>}
            {p.baths > 0 && <span><Bath size={16} aria-hidden="true" />{p.baths} حمامات</span>}
            <span><Maximize2 size={16} aria-hidden="true" />{money(p.area)} م²</span>
          </div>
          <div className="propertyBottom">
            <div><b>{money(p.price)} ر.س</b>{isRental && <small> / سنوي</small>}</div>
            <div className="cardActions"><Link href={propertyUrl} onClick={remember} aria-label={`تفاصيل ${p.title}`}>التفاصيل <ArrowLeft size={16} aria-hidden="true" /></Link></div>
          </div>
          <p className="propertyStatus" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </div>
      </article>
      {previewDialog && createPortal(previewDialog, document.body)}
    </>
  );
}
