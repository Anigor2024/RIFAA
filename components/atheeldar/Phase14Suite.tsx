'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, BarChart3, Building2, CalendarCheck2, Check, CheckCircle2, Circle, CircleDollarSign, ClipboardCheck, FileCheck2, FileText, Gauge, Home, Layers3, MapPinned, PieChart, Route, Scale, ShieldCheck, Sparkles, Target, TrendingUp, WalletCards, Wrench } from 'lucide-react';
import { money, properties, type Property } from '@/lib/atheeldar-data';

function readJSON<T>(key:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}}
function writeJSON(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

const investables=properties.filter(p=>p.investment||p.newBuild).slice(0,6);

export function PortfolioLab(){
  const [selected,setSelected]=useState<string[]>([]);
  const [budget,setBudget]=useState(9000000);
  useEffect(()=>{const id=window.setTimeout(()=>{setSelected(readJSON<string[]>('atheeldar-portfolio-assets',investables.slice(0,3).map(p=>p.slug)));setBudget(readJSON<number>('atheeldar-portfolio-budget',9000000))},0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>{writeJSON('atheeldar-portfolio-assets',selected);writeJSON('atheeldar-portfolio-budget',budget)},[selected,budget]);
  const assets=selected.map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const total=assets.reduce((s,p)=>s+p.price,0);
  const avgYield=assets.length?assets.reduce((s,p)=>s+(p.yield||4.8),0)/assets.length:0;
  const cityCount=new Set(assets.map(p=>p.city)).size;
  const typeCount=new Set(assets.map(p=>p.type)).size;
  const diversification=Math.min(100,Math.round((cityCount*28)+(typeCount*18)+(assets.length*8)));
  const utilization=budget?Math.round(total/budget*100):0;
  const income=Math.round(assets.reduce((s,p)=>s+p.price*((p.yield||4.8)/100),0));
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<4?[...v,slug]:v);
  return <div className="portfolioLabV14">
    <aside className="portfolioControlV14">
      <span>PORTFOLIO LAB · MODEL</span><h2>ابنِ محفظة <em>قبل أن تشتري أصلًا.</em></h2><p>اختبر كيف تتغير الصورة عندما تجمع أكثر من أصل: رأس المال، العائد النموذجي، توزيع المدن والأنواع، وتركيز المخاطر.</p>
      <label>الميزانية الاستثمارية <b>{money(budget)} ر.س</b><input type="range" min="2000000" max="20000000" step="250000" value={budget} onChange={e=>setBudget(Number(e.target.value))}/></label>
      <div className="portfolioPickerV14">{investables.map(p=><button key={p.slug} className={selected.includes(p.slug)?'active':''} onClick={()=>toggle(p.slug)}><span>{selected.includes(p.slug)?<Check/>:<Circle/>}</span><div><b>{p.title}</b><small>{p.city} · {money(p.price)} ر.س</small></div></button>)}</div>
      <small className="modelNoteV14">حد أقصى 4 أصول. المؤشرات تعليمية مبنية على بيانات النموذج وليست توصية استثمارية.</small>
    </aside>
    <section className="portfolioCanvasV14">
      <div className="portfolioHeroMetricsV14"><article><CircleDollarSign/><span><small>رأس المال المختار</small><b>{money(total)} ر.س</b></span></article><article><TrendingUp/><span><small>متوسط العائد النموذجي</small><b>{avgYield.toFixed(1)}%</b></span></article><article><PieChart/><span><small>تنويع المحفظة</small><b>{diversification}/100</b></span></article><article><WalletCards/><span><small>دخل سنوي نموذجي</small><b>{money(income)} ر.س</b></span></article></div>
      <div className="portfolioAllocationV14"><div className="allocationRingV14" style={{background:`conic-gradient(#b89a61 ${Math.min(100,utilization)*3.6}deg,#e5ddd0 0)`}}><div><b>{utilization}%</b><small>استخدام الميزانية</small></div></div><div className="allocationCopyV14"><small>CAPITAL UTILIZATION</small><h3>{utilization<=100?'السيناريو داخل الميزانية.':'السيناريو يتجاوز الميزانية.'}</h3><p>{utilization<=100?`يتبقى تقريبًا ${money(Math.max(0,budget-total))} ر.س للسيولة والرسوم والاحتياطي.`:`تحتاج إلى خفض الاختيارات بحوالي ${money(total-budget)} ر.س أو رفع سقف الميزانية.`}</p><div><span><MapPinned/> {cityCount} مدن</span><span><Layers3/> {typeCount} أنواع أصول</span><span><Scale/> {assets.length} أصول</span></div></div></div>
      <div className="portfolioAssetGridV14">{assets.map((p,i)=><article key={p.slug}><span>0{i+1}</span><img src={p.image} alt={p.title}/><div><small>{p.city} · {p.district}</small><h3>{p.title}</h3><b>{money(p.price)} ر.س</b><div><em>{p.yield||4.8}% عائد نموذجي</em><em>{p.score}/100</em></div><Link href={`/properties/${p.slug}`}>فتح الأصل <ArrowLeft/></Link></div></article>)}</div>
      {!assets.length&&<div className="portfolioEmptyV14"><BarChart3/><b>اختر أصلًا واحدًا على الأقل.</b><p>ابدأ من القائمة الجانبية وشاهد كيف تتغير المحفظة.</p></div>}
    </section>
  </div>
}

const transactionSteps=[
  {id:'interest',label:'اهتمام مؤهل',copy:'الهدف والميزانية والأصل واضحة.',icon:Target},
  {id:'viewing',label:'المعاينة',copy:'ملاحظات، أسئلة وحالة الأصل.',icon:CalendarCheck2},
  {id:'offer',label:'عرض مبدئي',copy:'قيمة العرض وشروطه الأساسية.',icon:CircleDollarSign},
  {id:'finance',label:'التمويل',copy:'قدرة شرائية وعرض تمويلي رسمي.',icon:WalletCards},
  {id:'due',label:'الفحص والتحقق',copy:'الصك، الرهون، الحالة الفنية والعقود.',icon:ShieldCheck},
  {id:'agreement',label:'الاتفاق',copy:'الشروط النهائية وتوقيع المستندات.',icon:FileCheck2},
  {id:'closing',label:'الإغلاق',copy:'استكمال المقابل والإجراءات النظامية.',icon:BadgeCheck},
  {id:'handover',label:'الاستلام',copy:'المفاتيح، العدادات ومحضر الاستلام.',icon:Home},
];

export function TransactionRoadmap(){
  const [property,setProperty]=useState(properties[0].slug);
  const [done,setDone]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{setProperty(readJSON<string>('atheeldar-transaction-property',properties[0].slug));setDone(readJSON<string[]>('atheeldar-transaction-done',[]))},0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>{writeJSON('atheeldar-transaction-property',property);writeJSON('atheeldar-transaction-done',done)},[property,done]);
  const p=properties.find(x=>x.slug===property)||properties[0];
  const progress=Math.round(done.length/transactionSteps.length*100);
  const toggle=(id:string)=>setDone(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  const next=transactionSteps.find(s=>!done.includes(s.id));
  return <div className="transactionRoadmapV14">
    <aside className="transactionSummaryV14"><span>TRANSACTION ROADMAP</span><img src={p.image} alt={p.title}/><label>العقار الجاري<select value={property} onChange={e=>setProperty(e.target.value)}>{properties.map(x=><option value={x.slug} key={x.slug}>{x.title} · {x.city}</option>)}</select></label><div className="transactionScoreV14"><b>{progress}</b><span>%</span><small>اكتمال المسار</small><i><em style={{width:`${progress}%`}}/></i></div>{next?<div className="nextGateV14"><Sparkles/><span><small>NEXT GATE</small><b>{next.label}</b><p>{next.copy}</p></span></div>:<div className="nextGateV14 complete"><BadgeCheck/><span><small>ROADMAP COMPLETE</small><b>اكتمل المسار داخل النموذج.</b></span></div>}<Link href={`/properties/${p.slug}/deal-room`}>فتح Deal Room <ArrowLeft/></Link></aside>
    <section className="transactionTimelineV14">{transactionSteps.map((s,i)=>{const Icon=s.icon;const active=done.includes(s.id);return <article key={s.id} className={active?'done':''}><div className="timelineNumberV14">0{i+1}</div><button onClick={()=>toggle(s.id)}>{active?<CheckCircle2/>:<Circle/>}</button><Icon/><div><small>{active?'COMPLETED':'PENDING'}</small><h3>{s.label}</h3><p>{s.copy}</p></div><span className="timelineLineV14"/></article>})}</section>
    <aside className="transactionGuardrailsV14"><div><ShieldCheck/><span><small>IMPORTANT</small><b>المسار تنظيمي، وليس بديلًا عن المستشارين المختصين.</b></span></div><p>أي صفقة فعلية تحتاج مراجعة قانونية ومالية وفنية وإجراءات رسمية من الجهات والأطراف المعنية.</p><Link href="/trust">مركز الثقة <ArrowLeft/></Link><Link href="/advisors">تحدث مع مستشار <ArrowLeft/></Link></aside>
  </div>
}

const ownerChecks=[
  {id:'docs',label:'مستندات الملكية والهوية جاهزة',icon:FileCheck2},
  {id:'photos',label:'صور احترافية وإضاءة جيدة',icon:Sparkles},
  {id:'plan',label:'مخطط أو وصف مساحي واضح',icon:Layers3},
  {id:'maintenance',label:'الصيانة والملاحظات الفنية موثقة',icon:Wrench},
  {id:'pricing',label:'السعر مبني على سياق السوق',icon:TrendingUp},
  {id:'viewing',label:'آلية معاينات واضحة ومنظمة',icon:CalendarCheck2},
];

export function OwnerStudio(){
  const [city,setCity]=useState('الرياض'),[type,setType]=useState<Property['type']>('فيلا'),[area,setArea]=useState(420),[asking,setAsking]=useState(4500000),[checks,setChecks]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{const s=readJSON<any>('atheeldar-owner-studio',null);if(s){setCity(s.city||'الرياض');setType(s.type||'فيلا');setArea(s.area||420);setAsking(s.asking||4500000);setChecks(s.checks||[])}} ,0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>{writeJSON('atheeldar-owner-studio',{city,type,area,asking,checks})},[city,type,area,asking,checks]);
  const comparable=properties.filter(p=>p.city===city&&p.purpose==='للبيع');
  const ppm=comparable.length?Math.round(comparable.reduce((s,p)=>s+p.price/p.area,0)/comparable.length):9000;
  const reference=Math.round(ppm*area);
  const delta=reference?Math.round((asking-reference)/reference*100):0;
  const readiness=Math.round(checks.length/ownerChecks.length*100);
  const presentation=Math.min(100,Math.round(readiness*.72+(Math.abs(delta)<=10?28:Math.abs(delta)<=20?18:8)));
  const toggle=(id:string)=>setChecks(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  return <div className="ownerStudioV14">
    <aside className="ownerInputsV14"><span>OWNER STUDIO · MODEL</span><h2>جهّز الأصل <em>للسوق قبل نشره.</em></h2><p>أداة توضيحية تساعد المالك على فهم جاهزية المستندات، العرض البصري، الصيانة، التسعير والمعاينات.</p><label>المدينة<select value={city} onChange={e=>setCity(e.target.value)}>{['الرياض','جدة','الخبر','الدرعية'].map(x=><option key={x}>{x}</option>)}</select></label><label>نوع الأصل<select value={type} onChange={e=>setType(e.target.value as Property['type'])}>{['فيلا','شقة','بنتهاوس','تاون هاوس','مكتب','أرض'].map(x=><option key={x}>{x}</option>)}</select></label><label>المساحة <b>{area} م²</b><input type="range" min="100" max="1200" step="10" value={area} onChange={e=>setArea(Number(e.target.value))}/></label><label>السعر المطلوب <b>{money(asking)} ر.س</b><input type="range" min="800000" max="12000000" step="50000" value={asking} onChange={e=>setAsking(Number(e.target.value))}/></label></aside>
    <section className="ownerReadinessV14"><div className="ownerScoreHeadV14"><div><small>GO-TO-MARKET READINESS</small><h3>جاهزية التسويق</h3></div><div className="ownerScoreOrbV14"><b>{presentation}</b><span>/100</span></div></div><div className="ownerChecklistV14">{ownerChecks.map(c=>{const I=c.icon;const active=checks.includes(c.id);return <button key={c.id} className={active?'active':''} onClick={()=>toggle(c.id)}><span>{active?<CheckCircle2/>:<Circle/>}</span><I/><b>{c.label}</b></button>})}</div><div className="ownerPricingV14"><article><Gauge/><span><small>مرجع سعري نموذجي</small><b>{money(reference)} ر.س</b><p>مشتق من متوسط سعر المتر في بيانات النموذج للمدينة المختارة.</p></span></article><article className={Math.abs(delta)<=10?'good':Math.abs(delta)<=20?'mid':'alert'}><TrendingUp/><span><small>موضع السعر المطلوب</small><b>{delta>0?'+':''}{delta}%</b><p>{Math.abs(delta)<=10?'قريب من المرجع النموذجي.':delta>10?'أعلى من المرجع؛ يحتاج قصة قيمة قوية.':'أقل من المرجع؛ راجع سبب الخصم.'}</p></span></article></div></section>
    <aside className="ownerBriefV14"><ClipboardCheck/><span>ATHEELDAR OWNER BRIEF</span><h3>{type} · {city}</h3><div><small>المساحة</small><b>{area} م²</b></div><div><small>السعر المطلوب</small><b>{money(asking)} ر.س</b></div><div><small>جاهزية المحتوى</small><b>{readiness}%</b></div><div><small>جاهزية السوق</small><b>{presentation}/100</b></div><p>المرحلة التالية المقترحة: {presentation>=80?'إعداد صفحة العرض وفتح المعاينات.':presentation>=55?'استكمال العناصر الناقصة قبل النشر.':'العودة للمستندات والصيانة والتسعير أولًا.'}</p><Link href="/contact">اطلب تجهيز عرض عقاري <ArrowLeft/></Link></aside>
  </div>
}
