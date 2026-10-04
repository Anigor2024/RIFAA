'use client';
import Link from 'next/link';
import { Heart, Scale, BedDouble, Bath, Maximize2, BadgeCheck, TrendingUp, Sparkles, Eye, X, MapPin, ArrowLeft, CalendarPlus, Check } from 'lucide-react';
import type { Property } from '@/lib/atheeldar-data';
import { money } from '@/lib/atheeldar-data';
import { useEffect, useState } from 'react';

function getSet(key:string){try{return new Set<string>(JSON.parse(localStorage.getItem(key)||'[]'))}catch{return new Set<string>()}}

export function PropertyCard({p,onCompare}:{p:Property,onCompare?:(slug:string)=>void}){
  const [fav,setFav]=useState(false);
  const [planned,setPlanned]=useState(false);
  const [preview,setPreview]=useState(false);
  useEffect(()=>{const read=()=>{setFav(getSet('atheeldar-favorites').has(p.slug));setPlanned(getSet('atheeldar-viewing-plan').has(p.slug))};const id=window.setTimeout(read,0);return()=>window.clearTimeout(id)},[p.slug]);
  const toggle=()=>{const s=getSet('atheeldar-favorites');fav?s.delete(p.slug):s.add(p.slug);localStorage.setItem('atheeldar-favorites',JSON.stringify([...s]));setFav(!fav);window.dispatchEvent(new Event('atheeldar:favorites'))};
  const togglePlan=()=>{const s=getSet('atheeldar-viewing-plan');planned?s.delete(p.slug):s.add(p.slug);localStorage.setItem('atheeldar-viewing-plan',JSON.stringify([...s].slice(0,6)));setPlanned(!planned)};
  const remember=()=>{try{const arr=JSON.parse(localStorage.getItem('atheeldar-recent')||'[]') as string[];const next=[p.slug,...arr.filter(x=>x!==p.slug)].slice(0,8);localStorage.setItem('atheeldar-recent',JSON.stringify(next))}catch{}};
  const ppm=Math.round(p.price/p.area);
  return <><article className="propertyCard">
    <div className="propertyMedia">
      <Link href={`/properties/${p.slug}`} onClick={remember}><img src={p.image} alt={p.title}/></Link>
      <div className="mediaBadges"><span>{p.badge}</span>{p.verified&&<span className="verified"><BadgeCheck size={14}/> موثق تجريبيًا</span>}</div>
      <div className="scoreBadge"><Sparkles size={12}/>{p.score}</div>
      <div className="propertyCardUtility"><button className={`heartButton ${fav?'on':''}`} onClick={toggle} aria-label="المفضلة"><Heart size={19} fill={fav?'currentColor':'none'}/></button><button className={`planButton ${planned?'on':''}`} onClick={togglePlan} aria-label="إضافة لمخطط المعاينات">{planned?<Check size={17}/>:<CalendarPlus size={17}/>}</button></div>
      <button className="quickPreviewButton" onClick={()=>setPreview(true)} aria-label="معاينة سريعة"><Eye size={17}/><span>معاينة سريعة</span></button>
    </div>
    <div className="propertyContent">
      <div className="propertyMeta"><span>{p.purpose}</span><span>{p.type}</span>{p.investment&&<span className="investMeta"><TrendingUp/> استثماري</span>}</div>
      <Link href={`/properties/${p.slug}`} onClick={remember} className="propertyTitle">{p.title}</Link>
      <p className="propertyLocation">{p.city} · {p.district}</p>
      <div className="propertySpecs">{p.beds>0&&<span><BedDouble size={15}/>{p.beds}</span>}{p.baths>0&&<span><Bath size={15}/>{p.baths}</span>}<span><Maximize2 size={15}/>{money(p.area)} م²</span></div>
      <div className="propertyMicro"><span>{money(ppm)} ر.س/م²</span>{p.yield&&<span>عائد نموذجي {p.yield}%</span>}{p.newBuild&&<span>بناء جديد</span>}</div>
      <div className="propertyDecisionStrip"><span><small>مؤشر أثيلدار</small><b>{p.score}/100</b></span><span><small>القرار الأقرب</small><b>{p.investment?'استثماري':p.beds>=4?'عائلي':'سكني'}</b></span><span><small>المعاينة</small><b>{planned?'ضمن الجدول':'جاهز للإضافة'}</b></span></div>
      <div className="propertyBottom"><div><b>{money(p.price)} ر.س</b>{p.purpose==='للإيجار'&&<small>/ سنوي</small>}</div><div className="cardActions">{onCompare&&<button onClick={()=>onCompare(p.slug)} title="مقارنة"><Scale size={17}/></button>}<Link href={`/properties/${p.slug}`} onClick={remember}>التفاصيل</Link></div></div>
    </div>
  </article>
  {preview&&<div className="quickPreviewOverlay" role="dialog" aria-modal="true"><button className="quickPreviewBackdrop" onClick={()=>setPreview(false)} aria-label="إغلاق المعاينة"/><section className="quickPreviewPanel"><button className="quickPreviewClose" onClick={()=>setPreview(false)} aria-label="إغلاق"><X/></button><div className="quickPreviewMedia"><img src={p.image} alt={p.title}/><span>{p.badge}</span><b>{p.score}<small>/100</small></b></div><div className="quickPreviewBody"><div className="quickPreviewKicker"><span>{p.type}</span><span>{p.purpose}</span>{p.verified&&<span><BadgeCheck/> موثق تجريبيًا</span>}</div><h2>{p.title}</h2><p className="quickPreviewLocation"><MapPin/>{p.city} · {p.district}</p><p>{p.description}</p><div className="quickPreviewSpecs"><span><BedDouble/>{p.beds||'—'}<small>غرف</small></span><span><Bath/>{p.baths||'—'}<small>حمامات</small></span><span><Maximize2/>{money(p.area)}<small>م²</small></span></div><div className="quickPreviewPrice"><span><small>السعر</small><b>{money(p.price)} ر.س</b></span><span><small>سعر المتر</small><b>{money(ppm)} ر.س</b></span></div><div className="quickPreviewActions"><button onClick={toggle}><Heart fill={fav?'currentColor':'none'}/>{fav?'محفوظ':'حفظ'}</button><button onClick={togglePlan}><CalendarPlus/>{planned?'في مخطط المعاينات':'أضف للمعاينة'}</button><Link href={`/properties/${p.slug}`} onClick={remember}>فتح التفاصيل الكاملة <ArrowLeft/></Link></div></div></section></div>}
  </>
}
