'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Circle, Copy, FileDown, MonitorPlay, Printer, Share2, Sparkles, Star, X } from 'lucide-react';
import { money, properties, type Property } from '@/lib/atheeldar-data';

type Focus='متوازن'|'عائلي'|'استثماري'|'فاخر';

function readIds(key:string){if(typeof window==='undefined')return[] as string[];try{return JSON.parse(localStorage.getItem(key)||'[]') as string[]}catch{return[]}}

export function PresentationBuilder(){
  const [ready,setReady]=useState(false);
  const [selected,setSelected]=useState<string[]>([]);
  const [client,setClient]=useState('عميل خاص');
  const [title,setTitle]=useState('مراجعة الخيارات العقارية');
  const [focus,setFocus]=useState<Focus>('متوازن');
  const [copied,setCopied]=useState(false);

  useEffect(()=>{const id=window.setTimeout(()=>{
    const ids=[...new Set([...readIds('atheeldar-compare'),...readIds('atheeldar-favorites'),...readIds('atheeldar-viewing-plan')])];
    setSelected((ids.length?ids:properties.filter(p=>p.featured).map(p=>p.slug)).slice(0,5));
    setReady(true);
  },0);return()=>window.clearTimeout(id)},[]);

  const assets=selected.map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<5?[...v,slug]:v);
  const params=new URLSearchParams({items:selected.join(','),client,title,focus});
  const path='/presentation?'+params.toString();
  const share=async()=>{try{await navigator.clipboard.writeText(window.location.origin+path);setCopied(true);window.setTimeout(()=>setCopied(false),1400)}catch{}};

  if(!ready)return <div className="presentationLoadingV18">نجهّز Presentation Studio...</div>;
  return <div className="presentationBuilderV18">
    <aside className="presentationBuilderSideV18">
      <span>ATHEELDAR PRESENTATION STUDIO</span>
      <h2>حوّل الـShortlist إلى <em>عرض عميل جاهز.</em></h2>
      <p>اختر الأصول واضبط عنوان العرض والعميل وزاوية القرار. الرابط الناتج قابل للمشاركة لأنه يحمل الاختيارات داخل الرابط نفسه.</p>
      <label>اسم العميل<input value={client} onChange={e=>setClient(e.target.value)} maxLength={50}/></label>
      <label>عنوان العرض<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={80}/></label>
      <div className="presentationFocusV18"><small>زاوية العرض</small><div>{(['متوازن','عائلي','استثماري','فاخر'] as Focus[]).map(x=><button key={x} className={focus===x?'active':''} onClick={()=>setFocus(x)}>{focus===x?<Check/>:<Circle/>}{x}</button>)}</div></div>
      <div className="presentationBuilderActionsV18"><Link href={path}><MonitorPlay/> فتح Presentation</Link><button onClick={share}><Copy/>{copied?'تم نسخ الرابط':'نسخ رابط المشاركة'}</button></div>
      <small className="presentationPrivacyV18">الرابط يحتوي فقط على Slugs العقارات والنصوص التي كتبتها هنا، ولا يرفع بيانات محلية خاصة إلى خادم.</small>
    </aside>
    <section className="presentationBuilderMainV18">
      <div className="presentationChooserHeadV18"><div><small>SELECT UP TO FIVE</small><h3>{selected.length}/5 أصول داخل العرض</h3></div><Link href="/shortlist">غرفة الـShortlist <ArrowLeft/></Link></div>
      <div className="presentationChooserGridV18">{properties.map(p=><button key={p.slug} className={selected.includes(p.slug)?'active':''} onClick={()=>toggle(p.slug)}><img src={p.image} alt={p.title}/><span className="presentationChoiceMarkV18">{selected.includes(p.slug)?<Check/>:<Circle/>}</span><div><small>{p.city} · {p.district}</small><b>{p.title}</b><strong>{money(p.price)} ر.س</strong></div></button>)}</div>
      <div className="presentationPreviewStripV18"><div><Sparkles/><span><small>LIVE PRESENTATION PREVIEW</small><b>{client} · {title}</b></span></div><div>{assets.map((p,i)=><span key={p.slug}><em>0{i+1}</em><img src={p.image} alt=""/></span>)}</div><Link href={path}>عرض كامل <ArrowLeft/></Link></div>
    </section>
  </div>
}

function focusCopy(focus:Focus){
  if(focus==='عائلي')return 'ننظر هنا إلى المساحة والخصوصية وجودة الحي وقابلية الاستخدام اليومي قبل أي شيء آخر.';
  if(focus==='استثماري')return 'التركيز على جودة الأصل، السعر النسبي، قابلية التأجير والعائد النموذجي مع مراعاة أن البيانات هنا تجريبية.';
  if(focus==='فاخر')return 'الأولوية لجودة التجربة والخصوصية والتفرد والموقع والتفاصيل التي ترفع قيمة السكن الراقي.';
  return 'موازنة بين جودة الأصل والموقع والسعر وسهولة الاستخدام اليومي وإمكانية اتخاذ خطوة تالية واضحة.';
}
function focusScore(p:Property,focus:Focus){
  if(focus==='عائلي')return p.score+(p.beds>=4?7:0)+(p.type==='فيلا'?5:0);
  if(focus==='استثماري')return p.score+(p.investment?10:0)+((p.yield||0)*2);
  if(focus==='فاخر')return p.score+(p.featured?7:0)+(p.price>4000000?5:0);
  return p.score;
}

export function PresentationDeck({items,client,title,focus}:{items:string[];client:string;title:string;focus:Focus}){
  const assets=items.map(id=>properties.find(p=>p.slug===id)).filter(Boolean).slice(0,5) as Property[];
  const [slide,setSlide]=useState(0);
  const slides=assets.length+3;
  const ranked=[...assets].sort((a,b)=>focusScore(b,focus)-focusScore(a,focus));
  const leader=ranked[0];
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft')setSlide(v=>Math.min(slides-1,v+1));if(e.key==='ArrowRight')setSlide(v=>Math.max(0,v-1));if(e.key==='Escape')window.location.href='/presentation-builder'};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[slides]);
  if(!assets.length)return <div className="presentationEmptyV18"><FileDown/><h2>لا توجد عقارات داخل العرض.</h2><Link href="/presentation-builder">العودة إلى Presentation Studio <ArrowLeft/></Link></div>;

  const assetSlide=slide>=2&&slide<assets.length+2?assets[slide-2]:null;
  return <div className="presentationDeckV18">
    <div className="presentationTopbarV18"><div><span>ATHEELDAR · PRIVATE CLIENT PRESENTATION</span><b>{slide+1} / {slides}</b></div><div><button onClick={()=>window.print()}><Printer/> PDF</button><Link href="/presentation-builder"><X/> خروج</Link></div></div>

    {slide===0&&<section className="presentationCoverV18">
      <div className="presentationCoverMediaV18"><img src={assets[0].image} alt=""/><div/></div>
      <div className="presentationCoverCopyV18"><span>ATHEELDAR REAL ESTATE</span><small>PRIVATE CLIENT REVIEW · {focus}</small><h1>{title}</h1><p>أُعدّ لـ <b>{client}</b></p><div><strong>{assets.length}</strong><span>خيارات مختارة</span><i/><strong>{new Set(assets.map(p=>p.city)).size}</strong><span>مدن</span><i/><strong>{Math.round(assets.reduce((s,p)=>s+p.score,0)/assets.length)}</strong><span>متوسط التقييم</span></div></div>
    </section>}

    {slide===1&&<section className="presentationExecutiveV18">
      <div className="presentationSectionTitleV18"><span>01 · EXECUTIVE VIEW</span><h2>صورة القرار <em>في دقيقة واحدة.</em></h2><p>{focusCopy(focus)}</p></div>
      <div className="presentationExecutiveGridV18">{assets.map((p,i)=><article key={p.slug} className={leader?.slug===p.slug?'leader':''}><span>0{i+1}</span><img src={p.image} alt={p.title}/><small>{p.city} · {p.district}</small><h3>{p.title}</h3><b>{money(p.price)} ر.س</b><div><em>{money(p.area)} م²</em><em>{p.beds||'—'} غرف</em><em>{p.score}/100</em></div>{leader?.slug===p.slug&&<strong><Star/> Leading Match</strong>}</article>)}</div>
    </section>}

    {assetSlide&&<section className="presentationPropertyV18">
      <div className="presentationPropertyMediaV18"><img src={assetSlide.image} alt={assetSlide.title}/><span>0{slide-1}</span></div>
      <div className="presentationPropertyCopyV18"><small>{assetSlide.badge} · {assetSlide.city} · {assetSlide.district}</small><h2>{assetSlide.title}</h2><p>{assetSlide.description}</p><b>{money(assetSlide.price)} ر.س</b><div className="presentationPropertyFactsV18"><span><small>المساحة</small><strong>{money(assetSlide.area)} م²</strong></span><span><small>الغرف</small><strong>{assetSlide.beds||'—'}</strong></span><span><small>التقييم</small><strong>{assetSlide.score}/100</strong></span><span><small>سعر المتر</small><strong>{money(Math.round(assetSlide.price/assetSlide.area))}</strong></span></div><div className="presentationFeaturesV18">{assetSlide.features.slice(0,6).map(x=><span key={x}><BadgeCheck/>{x}</span>)}</div><Link href={'/properties/'+assetSlide.slug}>فتح الملف الكامل <ArrowLeft/></Link></div>
    </section>}

    {slide===assets.length+2&&<section className="presentationRecommendationV18">
      <div className="presentationRecommendationHeadV18"><Sparkles/><span>EXECUTIVE RECOMMENDATION · MODEL</span><h2>ابدأ النقاش من <em>{leader?.title}</em></h2><p>{focusCopy(focus)} وبناءً على زاوية “{focus}” وبيانات النموذج، هذا الأصل يتصدر العرض كنقطة بداية للنقاش وليس كتوصية شراء رسمية.</p></div>
      <div className="presentationRankV18">{ranked.map((p,i)=><article key={p.slug}><span>0{i+1}</span><div><small>{p.city} · {p.district}</small><b>{p.title}</b></div><strong>{Math.round(focusScore(p,focus))}</strong><Link href={'/properties/'+p.slug}>تفاصيل <ArrowLeft/></Link></article>)}</div>
      <div className="presentationNextV18"><div><small>NEXT STEP</small><b>حوّل العرض إلى جلسة قرار.</b><p>راجع التمويل، المعاينات، الثقة والـDeal Room قبل أي التزام فعلي.</p></div><Link href="/client-brief">Client Brief <ArrowLeft/></Link><Link href="/advisors">مستشار أثيلدار <ArrowLeft/></Link></div>
    </section>}

    <div className="presentationControlsV18"><button onClick={()=>setSlide(v=>Math.max(0,v-1))} disabled={slide===0}><ArrowRight/></button><div>{Array.from({length:slides}).map((_,i)=><button key={i} aria-label={'شريحة '+(i+1)} className={i===slide?'active':''} onClick={()=>setSlide(i)}/>)}</div><button onClick={()=>setSlide(v=>Math.min(slides-1,v+1))} disabled={slide===slides-1}><ArrowLeft/></button></div>
  </div>
}
