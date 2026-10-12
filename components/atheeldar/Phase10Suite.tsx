'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bath, BedDouble, Building2, Check, CircleDollarSign, Clock3, Compass, Heart, MapPin, MapPinned, Maximize2, Route, Scale, Sparkles, Star, Target, Trash2, TrendingUp, UsersRound, WalletCards } from 'lucide-react';
import { money, neighborhoods, properties, type Property } from '@/lib/atheeldar-data';
import { readStoredIds, STORAGE_KEYS, subscribeStoredIds, writeStoredIds } from '@/lib/browser-storage';

function readIds(key:string){if(typeof window==='undefined')return[] as string[];try{return JSON.parse(localStorage.getItem(key)||'[]') as string[]}catch{return[]}}
export function GlobalComparisonWorkbench(){
  const [ids,setIds]=useState<string[]>([]);
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState('');
  const [goal,setGoal]=useState<'سكن'|'عائلة'|'استثمار'>('سكن');
  useEffect(()=>{
    const read=()=>{
      const saved=readStoredIds(STORAGE_KEYS.compare);
      const valid=saved.filter(slug=>properties.some(property=>property.slug===slug)).slice(0,3);
      setIds(valid);
      setReady(true);
      // Normalize stale entries and legacy over-capacity lists without adding any properties.
      if(saved.length!==valid.length)writeStoredIds(STORAGE_KEYS.compare,valid);
    };
    const timer=window.setTimeout(read,0);
    const unsubscribe=subscribeStoredIds(read);
    return()=>{window.clearTimeout(timer);unsubscribe()};
  },[]);
  const list=ids.map(id=>properties.find(p=>p.slug===id)).filter((p):p is Property=>Boolean(p));
  const changeList=(next:string[],message:string)=>{
    const result=writeStoredIds(STORAGE_KEYS.compare,next.slice(0,3));
    setIds(result.items);
    setNotice(`${message}${result.persisted?'':' التغيير متاح لهذه الزيارة فقط.'}`);
  };
  const remove=(slug:string)=>changeList(readStoredIds(STORAGE_KEYS.compare).filter(id=>id!==slug&&properties.some(p=>p.slug===id)),'أُزيل العقار من المقارنة.');
  const mixedPurposes=list.some(p=>p.purpose==='للبيع')&&list.some(p=>p.purpose==='للإيجار');
  const gridStyle={gridTemplateColumns:`150px repeat(${list.length},minmax(170px,1fr))`,minWidth:150+170*list.length};
  const rows:Record<string,(p:Property)=>string|number>={
    'الغرض':p=>p.purpose,
    'نوع العقار':p=>p.type,
    'السعر المعلن':p=>`${money(p.price)} ر.س${p.purpose==='للإيجار'?' / سنة':' · سعر الشراء'}`,
    'سعر المتر':p=>p.area>0?`${money(Math.round(p.price/p.area))} ر.س/م²${p.purpose==='للإيجار'?' / سنة':' · للشراء'}`:'غير متاح',
    'المساحة':p=>`${money(p.area)} م²`,
    'غرف النوم':p=>p.beds>0?money(p.beds):'لا ينطبق',
    'الحمامات':p=>p.baths>0?money(p.baths):'غير مذكور',
    'البناء الجديد':p=>p.newBuild?'مذكور في العرض':'غير مذكور',
    'التصنيف الاستثماري':p=>p.investment?'مصنف للاستثمار في العرض':'غير مصنف للاستثمار',
    'المزايا المذكورة':p=>p.features.length?p.features.join(' · '):'غير مذكورة',
  };
  const priorityRows=goal==='عائلة'?['غرف النوم','الحمامات','المساحة','المزايا المذكورة']:goal==='استثمار'?['الغرض','السعر المعلن','سعر المتر','التصنيف الاستثماري']:['الغرض','نوع العقار','السعر المعلن','المساحة'];
  const rowOrder=[...priorityRows,...Object.keys(rows).filter(label=>!priorityRows.includes(label))];
  return <div className="globalCompareV10">
    <div className="compareV10Intro"><span>ATHEELDAR COMPARE</span><h2>اختياراتك <em>جنبًا إلى جنب.</em></h2><p>قارن حتى 3 عقارات اخترتها بنفسك. نعرض تفاصيل الإعلان ووحدة كل سعر، ويمكنك ترتيب المؤشرات بحسب اهتمامك.</p>{ready&&list.length>0&&<><div className="compareGoalTabs" aria-label="ترتيب مؤشرات المقارنة">{(['سكن','عائلة','استثمار'] as const).map(x=><button type="button" key={x} onClick={()=>setGoal(x)} className={goal===x?'active':''} aria-pressed={goal===x}>{x}</button>)}</div><div className="compareLeader"><Scale aria-hidden="true"/><span><small>قائمتك المختارة</small><b>{money(list.length)} من 3 عقارات</b></span><button type="button" className="lightOutline" onClick={()=>changeList([],'مُسحت قائمة المقارنة.')} aria-label="مسح جميع العقارات من المقارنة"><Trash2 size={16} aria-hidden="true"/> مسح</button></div><Link href="/properties" className="lightOutline" style={{marginTop:18,justifyContent:'center'}}>أضف عقارًا <ArrowLeft size={16}/></Link></>}<p role="status" aria-live="polite">{notice}</p></div>
    <div className="compareV10Table" aria-busy={!ready}>
      {!ready?<div className="compareV10Empty" role="status">جارٍ تحميل اختياراتك…</div>:!list.length?<div className="compareV10Empty"><Scale aria-hidden="true"/><b>لا توجد عقارات في المقارنة.</b><p>اختر حتى 3 عقارات من بطاقات العرض، ثم عد لمقارنة تفاصيلها.</p><Link href="/properties">استكشف العقارات <ArrowLeft aria-hidden="true"/></Link></div>:<>
        {mixedPurposes&&<p role="note" style={{fontSize:13,lineHeight:1.9,padding:'10px 12px',background:'#faf7f0',margin:'0 0 12px'}}>تجمع هذه القائمة بين شراء عقار وإيجار سنوي. سعر الإيجار وسعر المتر فيه محسوبان لسنة؛ راجع الغرض والوحدة عند مقارنة القيم.</p>}
        <div role="table" aria-label="مقارنة العقارات المختارة">
          <div className="compareV10Head" role="row" style={gridStyle}><b role="columnheader">المؤشر</b>{list.map(p=><div key={p.slug} role="columnheader"><img src={p.image} alt={p.title} loading="lazy"/><span>{p.city} · {p.district}</span><h3><Link href={`/properties/${p.slug}`}>{p.title}</Link></h3><button type="button" onClick={()=>remove(p.slug)} aria-label={`إزالة ${p.title} من المقارنة`}><Trash2 aria-hidden="true"/></button></div>)}</div>
          {rowOrder.map(label=><div className="compareV10Row" role="row" key={label} style={gridStyle}><b role="rowheader">{label}</b>{list.map(p=><span role="cell" key={p.slug}>{rows[label](p)}</span>)}</div>)}
          <div className="compareV10Actions" role="row" style={gridStyle}><b role="rowheader">الخطوة التالية</b>{list.map(p=><div role="cell" key={p.slug} style={{background:'#faf7f0'}}><Link href={`/properties/${p.slug}`} aria-label={`فتح تفاصيل ${p.title}`} style={{height:'100%'}}>فتح العقار <ArrowLeft aria-hidden="true"/></Link></div>)}</div>
        </div>
      </>}
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
