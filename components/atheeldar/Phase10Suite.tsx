'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bath, BedDouble, Building2, Check, CircleDollarSign, Clock3, Compass, Heart, MapPin, MapPinned, Maximize2, Route, Scale, Sparkles, Star, Target, Trash2, TrendingUp, UsersRound, WalletCards } from 'lucide-react';
import { money, neighborhoods, properties, type Property } from '@/lib/atheeldar-data';

function readIds(key:string){if(typeof window==='undefined')return[] as string[];try{return JSON.parse(localStorage.getItem(key)||'[]') as string[]}catch{return[]}}
function writeIds(key:string,ids:string[]){try{localStorage.setItem(key,JSON.stringify(ids))}catch{}}

export function GlobalComparisonWorkbench(){
  const [ids,setIds]=useState<string[]>([]);
  const [goal,setGoal]=useState<'سكن'|'عائلة'|'استثمار'>('سكن');
  useEffect(()=>{const id=window.setTimeout(()=>{const saved=readIds('atheeldar-compare');setIds(saved.length?saved.slice(0,3):properties.filter(p=>p.featured).slice(0,3).map(p=>p.slug))},0);return()=>window.clearTimeout(id)},[]);
  const list=ids.map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const remove=(slug:string)=>{const next=ids.filter(x=>x!==slug);setIds(next);writeIds('atheeldar-compare',next);window.dispatchEvent(new Event('atheeldar:compare'))};
  const metrics=(p:Property)=>{const ppm=Math.round(p.price/p.area);const family=Math.min(98,(p.beds>=4?92:80)+(p.type==='فيلا'?4:0));const invest=p.investment?Math.min(98,86+(p.yield||0)):Math.max(68,p.score-12);const score=goal==='عائلة'?Math.round((p.score*.35+family*.65)):goal==='استثمار'?Math.round((p.score*.35+invest*.65)):p.score;return{ppm,family,invest:Math.round(invest),score}};
  const leader=list.length?[...list].sort((a,b)=>metrics(b).score-metrics(a).score)[0]:null;
  return <div className="globalCompareV10">
    <div className="compareV10Intro"><span>ATHEELDAR COMPARE</span><h2>قارن الأصل <em>في سياقه، لا بالسعر فقط.</em></h2><p>حتى 3 أصول مع سعر المتر، تقييم أثيلدار، ملاءمة العائلة، زاوية الاستثمار والمواصفات الجوهرية.</p><div className="compareGoalTabs">{(['سكن','عائلة','استثمار'] as const).map(x=><button key={x} onClick={()=>setGoal(x)} className={goal===x?'active':''}>{x}</button>)}</div>{leader&&<div className="compareLeader"><Sparkles/><span><small>الأقرب لهدف «{goal}»</small><b>{leader.title}</b></span><strong>{metrics(leader).score}/100</strong></div>}</div>
    <div className="compareV10Table">
      <div className="compareV10Head"><b>المؤشر</b>{list.map(p=><div key={p.slug}><img src={p.image} alt={p.title}/><span>{p.city} · {p.district}</span><h3>{p.title}</h3><button onClick={()=>remove(p.slug)} aria-label="إزالة"><Trash2/></button></div>)}</div>
      {[
        ['السعر',(p:Property)=>`${money(p.price)} ر.س`],
        ['سعر المتر',(p:Property)=>`${money(metrics(p).ppm)} ر.س`],
        ['المساحة',(p:Property)=>`${money(p.area)} م²`],
        ['الغرف',(p:Property)=>p.beds||'—'],
        ['تقييم أثيلدار',(p:Property)=>`${p.score}/100`],
        ['ملاءمة العائلة',(p:Property)=>`${metrics(p).family}/100`],
        ['زاوية الاستثمار',(p:Property)=>`${metrics(p).invest}/100`],
        ['العائد النموذجي',(p:Property)=>p.yield?`${p.yield}%`:'—'],
      ].map(([label,fn])=><div className="compareV10Row" key={label as string}><b>{label as string}</b>{list.map(p=><span key={p.slug}>{(fn as (p:Property)=>string|number)(p)}</span>)}</div>)}
      <div className="compareV10Actions"><b>الخطوة التالية</b>{list.map(p=><Link key={p.slug} href={`/properties/${p.slug}`}>فتح العقار <ArrowLeft/></Link>)}</div>
      {!list.length&&<div className="compareV10Empty"><Scale/><b>لا توجد عقارات في المقارنة.</b><p>أضفها مباشرة من أي بطاقة عقار.</p><Link href="/properties">استكشف العقارات <ArrowLeft/></Link></div>}
    </div>
  </div>
}

export function NextStepEngine(){
  const [ready,setReady]=useState(false),[fav,setFav]=useState<string[]>([]),[plan,setPlan]=useState<string[]>([]),[recent,setRecent]=useState<string[]>([]);
  useEffect(()=>{const read=()=>{setFav(readIds('atheeldar-favorites'));setPlan(readIds('atheeldar-viewing-plan'));setRecent(readIds('atheeldar-recent'));setReady(true)};const id=window.setTimeout(read,0);window.addEventListener('atheeldar:favorites',read as EventListener);window.addEventListener('atheeldar:compare',read as EventListener);return()=>{window.clearTimeout(id);window.removeEventListener('atheeldar:favorites',read as EventListener);window.removeEventListener('atheeldar:compare',read as EventListener)}},[]);
  const step=useMemo(()=>{
    if(plan.length>=2)return{n:'04',k:'VIEWING READY',title:'رتّب يوم المعاينات.',copy:`لديك ${plan.length} عقارات داخل المخطط. الخطوة المفيدة الآن هي ترتيب الأولويات قبل تأكيد المواعيد.`,href:'/viewing-planner',cta:'فتح مخطط المعاينات',icon:Route};
    if(fav.length>=2)return{n:'03',k:'COMPARE',title:'حان وقت المقارنة.',copy:`حفظت ${fav.length} عقارات. أضف الأقرب إلى المقارنة وشاهد الفروق خارج عامل السعر.`,href:'/compare',cta:'فتح المقارنة',icon:Scale};
    if(recent.length)return{n:'02',k:'CONTINUE',title:'أكمل من حيث توقفت.',copy:'لديك عقار شاهدته مؤخرًا. راجع الحي والثقة والتمويل قبل أن تنتقل إلى أصل آخر.',href:`/properties/${recent[0]}`,cta:'العودة للعقار',icon:Compass};
    return{n:'01',k:'DISCOVER',title:'ابدأ من احتياجك الحقيقي.',copy:'إذا لم تكن لديك اختيارات بعد، ابدأ بأسلوب الحياة أو البحث الذكي بدل التصفح العشوائي.',href:'/lifestyle',cta:'ابدأ بالاكتشاف',icon:Sparkles};
  },[fav,plan,recent]);
  if(!ready)return <div className="nextStepLoading">نجهّز رحلتك...</div>;
  const Icon=step.icon;
  return <section className="nextStepEngine"><div className="nextStepIndex">{step.n}</div><div className="nextStepCopy"><span>{step.k} · YOUR NEXT BEST ACTION</span><h2>{step.title}</h2><p>{step.copy}</p><Link href={step.href}>{step.cta} <ArrowLeft/></Link></div><div className="nextStepSignals"><article><Heart/><span><small>المفضلة</small><b>{fav.length}</b></span></article><article><Route/><span><small>المعاينات</small><b>{plan.length}</b></span></article><article><Clock3/><span><small>شوهد مؤخرًا</small><b>{recent.length}</b></span></article><Icon className="nextStepHeroIcon"/></div></section>
}

type RadiusMode='عائلة'|'عمل'|'استثمار';
export function NeighborhoodDailyRadius({slug}:{slug:string}){
  const n=neighborhoods.find(x=>x.slug===slug)||neighborhoods[0];
  const [mode,setMode]=useState<RadiusMode>('عائلة');
  const base=n.score;
  const data={
    'عائلة':[{label:'مدارس وخدمات',min:Math.max(5,18-Math.round(base/10)),icon:UsersRound},{label:'تسوق يومي',min:Math.max(4,15-Math.round(base/11)),icon:Building2},{label:'مساحات يومية',min:Math.max(6,20-Math.round(base/9)),icon:Compass}],
    'عمل':[{label:'محور أعمال',min:Math.max(7,26-Math.round(base/7)),icon:Target},{label:'خدمات سريعة',min:Math.max(4,15-Math.round(base/11)),icon:WalletCards},{label:'وصول حضري',min:Math.max(6,22-Math.round(base/8)),icon:Route}],
    'استثمار':[{label:'طلب نشط',min:Math.max(5,16-Math.round(base/12)),icon:TrendingUp},{label:'خدمات جاذبة',min:Math.max(5,18-Math.round(base/10)),icon:MapPinned},{label:'مناطق حركة',min:Math.max(7,24-Math.round(base/8)),icon:CircleDollarSign}],
  }[mode];
  const radius=Math.round(data.reduce((s,x)=>s+x.min,0)/data.length);
  return <div className="dailyRadiusV10"><div className="dailyRadiusIntro"><span>15-MINUTE LIFE · MODEL</span><h2>كيف تبدو الحياة حول <em>{n.name}؟</em></h2><p>تصوير توضيحي لسهولة الوصول وفق بيانات النموذج، وليس زمن قيادة حيًا أو بيانات خرائط فعلية.</p><div>{(['عائلة','عمل','استثمار'] as RadiusMode[]).map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}</button>)}</div></div><div className="dailyRadiusMap"><div className="radiusRing r1"/><div className="radiusRing r2"/><div className="radiusRing r3"/><div className="radiusCenter"><MapPin/><b>{n.name}</b><small>{n.city}</small></div>{data.map((x,i)=>{const Icon=x.icon;return <article key={x.label} className={`radiusNode n${i+1}`}><Icon/><span><b>{x.min} د</b><small>{x.label}</small></span></article>})}</div><div className="dailyRadiusScore"><small>متوسط نطاق الوصول النموذجي</small><b>{radius}</b><span>دقيقة</span><i><em style={{width:`${Math.max(18,100-radius*3)}%`}}/></i><p>كلما قل الرقم كان الوصول النموذجي أكثر سهولة داخل هذا السيناريو.</p></div></div>
}
