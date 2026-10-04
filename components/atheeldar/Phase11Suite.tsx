'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, BookmarkCheck, Building2, CalendarCheck2, Check, CheckCircle2, Circle, ClipboardCheck, FileText, Heart, Layers3, MapPinned, Printer, Route, Scale, Sparkles, Star, Trash2, WalletCards } from 'lucide-react';
import { money, properties, type Property } from '@/lib/atheeldar-data';

function readIds(key:string){if(typeof window==='undefined')return[] as string[];try{return JSON.parse(localStorage.getItem(key)||'[]') as string[]}catch{return[]}}
function writeIds(key:string,ids:string[]){try{localStorage.setItem(key,JSON.stringify(ids))}catch{}}

export function ShortlistRoom(){
  const [ready,setReady]=useState(false),[favorites,setFavorites]=useState<string[]>([]),[compare,setCompare]=useState<string[]>([]),[plan,setPlan]=useState<string[]>([]),[selected,setSelected]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{const f=readIds('atheeldar-favorites'),c=readIds('atheeldar-compare'),p=readIds('atheeldar-viewing-plan');setFavorites(f);setCompare(c);setPlan(p);setSelected([...new Set([...c,...f,...p])].slice(0,5));setReady(true)},0);return()=>window.clearTimeout(id)},[]);
  const assets=selected.map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<5?[...v,slug]:v);
  const candidates=[...new Set([...favorites,...compare,...plan])].map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const remove=(slug:string)=>setSelected(v=>v.filter(x=>x!==slug));
  const printPack=()=>window.print();
  if(!ready)return <div className="shortlistLoading">نجهّز غرفة القرار...</div>;
  return <div className="shortlistRoomV11">
    <aside className="shortlistSources">
      <span>CLIENT SHORTLIST</span><h2>كل ما حفظته، <em>في غرفة واحدة.</em></h2><p>اختر حتى 5 أصول لتجهيز Decision Pack قابل للطباعة والمراجعة مع العميل أو الأسرة.</p>
      <div className="shortlistCounts"><article><Heart/><span><small>المفضلة</small><b>{favorites.length}</b></span></article><article><Scale/><span><small>المقارنة</small><b>{compare.length}</b></span></article><article><Route/><span><small>المعاينات</small><b>{plan.length}</b></span></article></div>
      <button className="printDecisionPack" onClick={printPack}><Printer/> اطبع Decision Pack</button>
      <small className="modelNote">الطباعة تستخدم Print/PDF في المتصفح؛ لا يتم رفع بياناتك لأي خادم.</small>
    </aside>
    <section className="shortlistWorkspace">
      <div className="shortlistChooser"><div><small>AVAILABLE SIGNALS</small><b>اختر الأصول التي تدخل الحزمة</b></div><div>{candidates.length?candidates.map(p=><button key={p.slug} className={selected.includes(p.slug)?'active':''} onClick={()=>toggle(p.slug)}><span>{selected.includes(p.slug)?<Check/>:<Circle/>}</span>{p.title}</button>):<Link href="/properties">لم تحفظ عقارات بعد — استكشف السوق <ArrowLeft/></Link>}</div></div>
      <div className="decisionPack">
        <div className="decisionPackHead"><div><span>ATHEELDAR DECISION PACK</span><h3>Shortlist Review</h3><p>{assets.length} أصول مختارة · نموذج قابل للطباعة</p></div><BadgeCheck/></div>
        <div className="decisionPackGrid">{assets.map((p,i)=>{const ppm=Math.round(p.price/p.area);let note='';try{note=typeof window!=='undefined'?localStorage.getItem(`atheeldar-note-${p.slug}`)||'':''}catch{}return <article key={p.slug}><button onClick={()=>remove(p.slug)} aria-label="إزالة"><Trash2/></button><span>0{i+1}</span><img src={p.image} alt={p.title}/><small>{p.city} · {p.district}</small><h4>{p.title}</h4><b>{money(p.price)} ر.س</b><div><em>{money(p.area)} م²</em><em>{money(ppm)} ر.س/م²</em><em>{p.score}/100</em></div>{note&&<p className="packNote">“{note}”</p>}<Link href={`/properties/${p.slug}`}>فتح الأصل <ArrowLeft/></Link></article>})}</div>
        {!assets.length&&<div className="decisionPackEmpty"><FileText/><b>لم تختر أصولًا للحزمة بعد.</b><p>اختر من الإشارات المحفوظة أعلاه.</p></div>}
        <div className="decisionPackFooter"><span>ATHEELDAR · CLIENT DECISION PACK</span><small>بيانات نموذجية لأغراض العرض وليست تقييمًا أو توصية رسمية.</small></div>
      </div>
    </section>
  </div>
}

const readinessItems=[
  {id:'district',label:'راجعت ملف الحي والسياق المكاني',href:(slug:string)=>`/neighborhoods/${properties.find(p=>p.slug===slug)?.neighborhoodSlug||''}`,icon:MapPinned},
  {id:'finance',label:'اختبرت التمويل أو القدرة الشرائية',href:()=>'/finance',icon:WalletCards},
  {id:'trust',label:'راجعت جواز العقار ومركز الثقة',href:()=>'/trust',icon:BadgeCheck},
  {id:'compare',label:'قارنت الأصل مع بديل واحد على الأقل',href:()=>'/compare',icon:Scale},
  {id:'viewing',label:'أضفت العقار إلى مخطط المعاينات',href:()=>'/viewing-planner',icon:CalendarCheck2},
];
export function PropertyReadinessChecklist({property}:{property:Property}){
  const key=`atheeldar-readiness-${property.slug}`;
  const [done,setDone]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{try{setDone(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}},0);return()=>window.clearTimeout(id)},[key]);
  const toggle=(id:string)=>{const next=done.includes(id)?done.filter(x=>x!==id):[...done,id];setDone(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}};
  const score=Math.round(done.length/readinessItems.length*100);
  return <section className="readinessV11"><div className="readinessIntro"><span>DECISION READINESS</span><h2>هل أنت جاهز <em>للخطوة التالية؟</em></h2><p>Checklist شخصية تحفظ محليًا وتربط العقار بالسياق والتمويل والتحقق والمقارنة والمعاينة.</p><div className="readinessScore"><b>{score}</b><small>% جاهزية</small><i><em style={{width:`${score}%`}}/></i></div></div><div className="readinessItems">{readinessItems.map(item=>{const Icon=item.icon;const active=done.includes(item.id);return <article key={item.id} className={active?'done':''}><button onClick={()=>toggle(item.id)} aria-label={active?'إلغاء':'تم'}>{active?<CheckCircle2/>:<Circle/>}</button><Icon/><span><b>{item.label}</b><Link href={item.href(property.slug)}>فتح المسار <ArrowLeft/></Link></span></article>})}</div><div className="readinessNext"><ClipboardCheck/><div><small>NEXT GATE</small><b>{score===100?'ممتاز — لديك صورة قرار مكتملة داخل النموذج.':score>=60?'أكمل ما تبقى قبل تثبيت المعاينة أو التواصل.':'لا تستعجل — أكمل طبقات القرار الأساسية أولًا.'}</b></div></div></section>
}

type Unit={id:string,name:string,area:number,beds:number,floor:string,price:number,status:'متاح'|'اهتمام مرتفع'|'آخر وحدة'};
export function ProjectUnitMatrix({project}:{project:{slug:string;from:number;units:number}}){
  const units=useMemo<Unit[]>(()=>[
    {id:'r1',name:'Residence A',area:165,beds:3,floor:'02–05',price:project.from,status:'متاح'},
    {id:'r2',name:'Residence B',area:192,beds:3,floor:'03–07',price:Math.round(project.from*1.12),status:'اهتمام مرتفع'},
    {id:'s1',name:'Signature',area:245,beds:4,floor:'05–09',price:Math.round(project.from*1.34),status:'متاح'},
    {id:'g1',name:'Grand',area:330,beds:5,floor:'08–10',price:Math.round(project.from*1.68),status:'آخر وحدة'},
  ],[project.from]);
  const key=`atheeldar-project-units-${project.slug}`;
  const [saved,setSaved]=useState<string[]>([]),[active,setActive]=useState(units[0].id);
  useEffect(()=>{const id=window.setTimeout(()=>{try{setSaved(JSON.parse(localStorage.getItem(key)||'[]'))}catch{}},0);return()=>window.clearTimeout(id)},[key]);
  const toggle=(id:string)=>{const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];setSaved(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}};
  const u=units.find(x=>x.id===active)!;
  return <div className="unitMatrixV11"><div className="unitMatrixIntro"><span>PROJECT UNIT MATRIX</span><h2>افتح المشروع <em>على مستوى الوحدة.</em></h2><p>مصفوفة تجريبية توضّح كيف يمكن للمستخدم استكشاف نماذج الوحدات، مقارنة المساحة والطابق والسعر، وحفظ النماذج الأقرب له.</p><div className="unitMatrixSummary"><article><Building2/><span><small>إجمالي المشروع</small><b>{project.units} وحدة</b></span></article><article><BookmarkCheck/><span><small>محفوظ لديك</small><b>{saved.length} نموذج</b></span></article></div></div><div className="unitMatrixTable"><div className="unitMatrixHead"><b>النموذج</b><span>المساحة</span><span>الغرف</span><span>الطابق</span><span>السعر</span><span>الحالة</span><span>حفظ</span></div>{units.map(x=><button key={x.id} className={active===x.id?'active':''} onClick={()=>setActive(x.id)}><b>{x.name}</b><span>{x.area} م²</span><span>{x.beds}</span><span>{x.floor}</span><span>{money(x.price)} ر.س</span><span className={x.status==='آخر وحدة'?'urgent':''}>{x.status}</span><i onClick={e=>{e.stopPropagation();toggle(x.id)}}>{saved.includes(x.id)?<Check/>:<Star/>}</i></button>)}</div><aside className="unitMatrixFocus"><small>SELECTED UNIT</small><h3>{u.name}</h3><div className="unitFloorSketch"><span>{u.beds} غرف</span><i/><i/><i/><i/></div><b>{money(u.price)} ر.س</b><p>{u.area} م² · طوابق {u.floor}</p><div className="unitPaymentMini"><span><small>حجز 5%</small><b>{money(Math.round(u.price*.05))}</b></span><span><small>عند التسليم 40%</small><b>{money(Math.round(u.price*.4))}</b></span></div><Link href="/contact">سجّل اهتمامك <ArrowLeft/></Link></aside></div>
}

export function ClientActivityTimeline(){
  const [ready,setReady]=useState(false),[recent,setRecent]=useState<string[]>([]),[fav,setFav]=useState<string[]>([]),[plan,setPlan]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{setRecent(readIds('atheeldar-recent'));setFav(readIds('atheeldar-favorites'));setPlan(readIds('atheeldar-viewing-plan'));setReady(true)},0);return()=>window.clearTimeout(id)},[]);
  if(!ready)return null;
  const items=[...recent.slice(0,4).map((id,i)=>({id:`r-${id}`,type:'شوهد مؤخرًا',slug:id,n:i+1})),...fav.slice(0,2).map((id,i)=>({id:`f-${id}`,type:'محفوظ بالمفضلة',slug:id,n:i+5}))];
  return <section className="activityTimelineV11"><div className="activityTimelineHead"><span>CLIENT ACTIVITY</span><h2>سجل رحلتك <em>في أثيلدار</em></h2><p>صورة سريعة لما شاهدته وحفظته، لتستكمل من حيث توقفت.</p></div><div className="activityTimelineRail">{items.length?items.map(item=>{const p=properties.find(x=>x.slug===item.slug);if(!p)return null;return <Link href={`/properties/${p.slug}`} key={item.id}><span>{String(item.n).padStart(2,'0')}</span><img src={p.image} alt={p.title}/><div><small>{item.type}</small><b>{p.title}</b><p>{p.city} · {p.district}</p></div><ArrowLeft/></Link>}):<div className="activityEmpty"><Sparkles/><b>رحلتك ستظهر هنا.</b><p>ابدأ باستكشاف عقار أو حفظه.</p></div>}</div><div className="activityTimelineFoot"><Link href="/shortlist">افتح غرفة الـShortlist <ArrowLeft/></Link><Link href="/viewing-planner">مخطط المعاينات ({plan.length}) <ArrowLeft/></Link></div></section>
}
