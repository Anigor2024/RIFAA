'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, Building2, CalendarCheck2, Check, CheckCircle2, Circle, ClipboardCheck, FileCheck2, FileText, Heart, Landmark, Layers3, MessageSquareText, Printer, Route, Scale, ShieldCheck, Sparkles, Star, Target, TrendingUp, WalletCards } from 'lucide-react';
import { money, projects, properties, type Property } from '@/lib/atheeldar-data';
import { readJSON, writeJSON } from '@/lib/browser-storage';

function readArray(key:string){if(typeof window==='undefined')return[] as string[];try{return JSON.parse(localStorage.getItem(key)||'[]') as string[]}catch{return[]}}
function setArray(key:string,v:string[]){try{localStorage.setItem(key,JSON.stringify(v))}catch{}}

type DealStep={id:string;title:string;copy:string;href:string;icon:typeof CheckCircle2};
const dealSteps:DealStep[]=[
  {id:'viewed',title:'راجعت الأصل وتفاصيله',copy:'المساحة، المواصفات، سعر المتر والسياق.',href:'#summary',icon:FileText},
  {id:'district',title:'راجعت الحي',copy:'الطلب، نمط الحياة والسياق المكاني.',href:'district',icon:Target},
  {id:'finance',title:'اختبرت التمويل',copy:'القسط، الدفعة والقدرة الشرائية.',href:'/finance',icon:WalletCards},
  {id:'trust',title:'راجعت الثقة والتحقق',copy:'بيانات العرض وما يحتاج تحققًا رسميًا.',href:'/trust',icon:ShieldCheck},
  {id:'viewing',title:'جهزت المعاينة',copy:'أضف الأصل ليوم المعاينات ورتّب الأسئلة.',href:'/viewing-planner',icon:CalendarCheck2},
  {id:'advisor',title:'جهزت التواصل مع مستشار',copy:'حوّل الملاحظات إلى جلسة قرار منظمة.',href:'/advisors',icon:MessageSquareText},
];

type DealRoomState={done:string[];note:string;offer:number;deposit:number};

function parseDealRoom(value:unknown,price:number):DealRoomState{
  const saved=value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
  const bounded=(value:unknown,fallback:number,min:number,max:number)=>typeof value==='number'&&Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
  return{
    done:Array.isArray(saved.done)?[...new Set(saved.done.filter((id):id is string=>typeof id==='string'&&dealSteps.some(step=>step.id===id)))]:[],
    note:typeof saved.note==='string'?saved.note.slice(0,10000):'',
    offer:Math.round(bounded(saved.offer,Math.round(price*.96),Math.round(price*.85),price)),
    deposit:bounded(saved.deposit,20,10,50),
  };
}

export function PropertyDealRoom({property}:{property:Property}){
  const key=`atheeldar-deal-room-${property.slug}`;
  const [draft,setDraft]=useState<DealRoomState>(()=>parseDealRoom(null,property.price));
  const [loadedKey,setLoadedKey]=useState<string|null>(null);
  const [storageStatus,setStorageStatus]=useState('');
  const ready=loadedKey===key;
  const isRental=property.purpose==='للإيجار';

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      setDraft(parseDealRoom(readJSON<unknown>(key,null),property.price));
      setLoadedKey(key);
      setStorageStatus('');
    },0);
    return()=>window.clearTimeout(timer);
  },[key,property.price]);

  // Restore first; only a user's edit writes. Mounting can never overwrite a saved room.
  const saveChanges=(next:DealRoomState)=>{
    if(!ready)return;
    const valid=parseDealRoom(next,property.price);
    setDraft(valid);
    const result=writeJSON(key,valid);
    setStorageStatus(result.persisted?'حُفظت تغييراتك في هذا المتصفح.':'تعذّر الحفظ الدائم في المتصفح. تغييراتك متاحة خلال هذه الزيارة فقط.');
  };
  const {done,note,offer,deposit}=draft;
  const toggle=(id:string)=>saveChanges({...draft,done:done.includes(id)?done.filter(value=>value!==id):[...done,id]});
  const readiness=Math.round(done.length/dealSteps.length*100);
  const finance=Math.max(0,offer*(1-deposit/100));
  const monthly=isRental?Math.round(offer/12):Math.round((finance*.055/12)/(1-Math.pow(1+.055/12,-25*12)));
  const districtHref=`/neighborhoods/${property.neighborhoodSlug}`;
  const steps=dealSteps.map(step=>step.id==='finance'?{
    ...step,
    title:isRental?'راجعت ميزانية الإيجار':step.title,
    copy:isRental?'الإيجار السنوي ومتوسطه الشهري للمقارنة.':step.copy,
    href:isRental?'#summary':`/finance?property=${encodeURIComponent(property.slug)}`,
  }:step);
  return <div className="dealRoomV13" aria-busy={!ready}>
    <aside className="dealRoomIdentity">
      <span>ATHEELDAR DEAL ROOM</span>
      <img src={property.image} alt={property.title}/>
      <small>{property.city} · {property.district}</small>
      <h2>{property.title}</h2>
      <b>{money(property.price)} ر.س{isRental?' سنويًا':''}</b>
      <div className="dealIdentityStats"><span><small>نوع العرض</small><b>{property.type} · {property.purpose}</b></span><span><small>{isRental?'الإيجار السنوي للمتر':'سعر المتر'}</small><b>{money(Math.round(property.price/property.area))} ر.س/م²{isRental?' سنويًا':''}</b></span></div>
      <button type="button" onClick={()=>window.print()}><Printer/> اطبع ملخص الغرفة</button>
      <Link href={`/properties/${property.slug}`} style={{display:'flex',alignItems:'center',gap:8,marginTop:16,fontSize:14}}>العودة إلى العقار <ArrowLeft size={16}/></Link>
    </aside>
    <section className="dealRoomMain">
      <div className="dealRoomHead"><div><span>BUYER OPERATING ROOM</span><h1>من الاهتمام إلى <em>قرار جاهز للنقاش.</em></h1><p>مساحة خاصة على جهازك تجمع التحقق والملاحظات والتمويل والمعاينة قبل الانتقال إلى عرض أو تفاوض فعلي.</p></div><div className="dealReadiness"><b>{readiness}</b><span>%</span><small>جاهزية الغرفة</small><i><em style={{width:`${readiness}%`}}/></i></div></div>
      <p className="propertyStatus" role="status" aria-live="polite">{ready?storageStatus:'نستعيد ملاحظاتك وخطواتك المحفوظة…'}</p>
      <div className="dealSteps">{steps.map(s=>{const I=s.icon;const active=done.includes(s.id);const href=s.href==='district'?districtHref:s.href;return <article key={s.id} className={active?'done':''}><button type="button" disabled={!ready} onClick={()=>toggle(s.id)} aria-label={`${active?'إلغاء إكمال':'تحديد كمكتمل'}: ${s.title}`} aria-pressed={active}>{active?<CheckCircle2 aria-hidden="true"/>:<Circle aria-hidden="true"/>}</button><I aria-hidden="true"/><div><b>{s.title}</b><p>{s.copy}</p><Link href={href}>{href.startsWith('#')?'راجع داخل الغرفة':'فتح المسار'} <ArrowLeft/></Link></div></article>})}</div>
      <div id="summary" className="dealWorkspace">
        <article className="dealOfferLab"><span>سيناريو شخصي</span><h3>{isRental?'راجع ميزانية الإيجار قبل التواصل.':'اختبر سيناريو العرض قبل الحديث.'}</h3><label>{isRental?'إيجار سنوي مقترح':'قيمة عرض تجريبية'} <b>{money(offer)} ر.س{isRental?' سنويًا':''}</b><input type="range" disabled={!ready} min={Math.round(property.price*.85)} max={property.price} step="any" value={offer} onChange={e=>saveChanges({...draft,offer:Number(e.target.value)})}/></label>{!isRental&&<label>دفعة أولى <b>{deposit}%</b><input type="range" disabled={!ready} min="10" max="50" step="5" value={deposit} onChange={e=>saveChanges({...draft,deposit:Number(e.target.value)})}/></label>}<div><span><small>{isRental?'الإيجار السنوي المقترح':'تمويل تقديري'}</small><b>{money(isRental?offer:Math.round(finance))} ر.س{isRental?' سنويًا':''}</b></span><span><small>{isRental?'متوسط شهري للمقارنة':'قسط شهري نموذجي'}</small><b>{money(monthly)} ر.س / شهر</b></span><span><small>{isRental?'الفرق السنوي عن السعر':'فرق عن السعر'}</small><b>{money(property.price-offer)} ر.س</b></span></div><p>{isRental?'المتوسط الشهري يساوي الإيجار السنوي مقسومًا على 12، ولا يحدد دورية السداد الفعلية في العقد.':'حساب توضيحي بمعدل سنوي مفترض 5.5% لمدة 25 سنة، قبل الرسوم. ليس عرض شراء أو موافقة تمويلية.'}</p></article>
        <article className="dealNotes"><span>ملاحظاتك الخاصة</span><h3 id="deal-notes-title">ملاحظات المعاينة والتفاوض</h3><textarea value={note} disabled={!ready} maxLength={10000} aria-labelledby="deal-notes-title" onChange={e=>saveChanges({...draft,note:e.target.value})} placeholder="مثال: الإضاءة ممتازة، أحتاج التأكد من عمر التكييف، اسأل عن رسوم الصيانة..."/><small>تُحفظ التعديلات عند كتابتها. تظهر حالة الحفظ أعلى خطوات الغرفة.</small></article>
      </div>
      <div className="dealDocs"><div><FileCheck2/><span><small>DUE DILIGENCE GATE</small><b>قبل أي التزام فعلي</b></span></div>{['الملكية والصك','الالتزامات والرهونات','حالة المبنى والصيانة','الرسوم والعقود المرتبطة','هوية الأطراف وصحة التمثيل'].map((x,i)=><span key={x}><b>0{i+1}</b>{x}</span>)}<Link href="/trust">فتح مركز الثقة <ArrowLeft/></Link></div>
    </section>
  </div>
}

type ProjectItem=typeof projects[number];
export function ProjectCompareWorkbench(){
  const [selected,setSelected]=useState(projects.map(p=>p.slug).slice(0,3));
  const list=selected.map(id=>projects.find(p=>p.slug===id)).filter(Boolean) as ProjectItem[];
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<3?[...v,slug]:v);
  const bestProgress=[...list].sort((a,b)=>b.progress-a.progress)[0];
  const bestEntry=[...list].sort((a,b)=>a.from-b.from)[0];
  return <div className="projectCompareV13">
    <aside className="projectCompareIntro"><span>PROJECT COMPARE</span><h2>قارن المشروع كـ <em>منتج استثماري وسكني.</em></h2><p>المقارنة هنا بين نقطة الدخول، التقدم، التسليم، حجم المجتمع والمرافق — وليس الصورة وحدها.</p><div className="projectPickerV13">{projects.map(p=><button key={p.slug} className={selected.includes(p.slug)?'active':''} onClick={()=>toggle(p.slug)}><span>{selected.includes(p.slug)?<Check/>:<Circle/>}</span>{p.name}</button>)}</div>{list.length>0&&<div className="projectCompareSignals"><article><TrendingUp/><span><small>الأعلى تقدمًا</small><b>{bestProgress?.name}</b></span></article><article><Landmark/><span><small>الأقل دخولًا</small><b>{bestEntry?.name}</b></span></article></div>}</aside>
    <section className="projectCompareGrid">{list.map((p,i)=><article key={p.slug}><div className="projectCompareImage"><img src={p.image} alt={p.name}/><span>0{i+1}</span><b>{p.progress}%</b></div><div className="projectCompareBody"><small>{p.city} · {p.type}</small><h3>{p.name}</h3><p>{p.description}</p><div className="projectCompareFacts"><span><small>يبدأ من</small><b>{money(p.from)} ر.س</b></span><span><small>الوحدات</small><b>{p.units}</b></span><span><small>التسليم</small><b>{p.delivery}</b></span><span><small>التقدم</small><b>{p.progress}%</b></span></div><div className="projectAmenityMini">{p.amenities.slice(0,4).map(a=><span key={a}>{a}</span>)}</div><Link href={`/projects/${p.slug}`}>فتح المشروع <ArrowLeft/></Link></div></article>)}</section>
  </div>
}

export function BuyerOSRail(){
  const [fav,setFav]=useState<string[]>([]),[cmp,setCmp]=useState<string[]>([]),[plan,setPlan]=useState<string[]>([]),[recent,setRecent]=useState<string[]>([]);
  useEffect(()=>{const read=()=>{setFav(readArray('atheeldar-favorites'));setCmp(readArray('atheeldar-compare'));setPlan(readArray('atheeldar-viewing-plan'));setRecent(readArray('atheeldar-recent'))};const id=window.setTimeout(read,0);window.addEventListener('atheeldar:favorites',read as EventListener);window.addEventListener('atheeldar:compare',read as EventListener);return()=>{window.clearTimeout(id);window.removeEventListener('atheeldar:favorites',read as EventListener);window.removeEventListener('atheeldar:compare',read as EventListener)}},[]);
  const last=recent.map(id=>properties.find(p=>p.slug===id)).filter(Boolean).slice(0,2) as Property[];
  return <section className="buyerOSRailV13"><div className="buyerOSBrand"><Sparkles/><span><small>BUYER OS</small><b>رحلتك العقارية الآن</b></span></div><div className="buyerOSMetrics"><Link href="/account#favorites"><Heart/><span><small>مفضلة</small><b>{fav.length}</b></span></Link><Link href="/compare"><Scale/><span><small>مقارنة</small><b>{cmp.length}</b></span></Link><Link href="/viewing-planner"><Route/><span><small>معاينات</small><b>{plan.length}</b></span></Link></div><div className="buyerOSRecent">{last.length?last.map(p=><Link href={`/properties/${p.slug}`} key={p.slug}><img src={p.image} alt=""/><span><small>آخر مشاهدة</small><b>{p.title}</b></span><ArrowLeft/></Link>):<Link href="/properties"><Target/><span><small>ابدأ الرحلة</small><b>استكشف أول أصل</b></span><ArrowLeft/></Link>}</div></section>
}
