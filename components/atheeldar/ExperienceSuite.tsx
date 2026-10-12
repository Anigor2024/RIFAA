'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, BellRing, BookmarkPlus, CalendarDays, Check, CheckCircle2, Clock3, Compass, FileCheck2, Home, MapPinned, Route, Save, ShieldCheck, Sparkles, Trash2, UsersRound, WalletCards, Waves, Trees, Building2 } from 'lucide-react';
import { neighborhoods, properties, money, type Property } from '@/lib/atheeldar-data';
import { readJSON, readStoredIds, STORAGE_KEYS, subscribeStoredIds, toggleStoredId, writeJSON, writeStoredIds } from '@/lib/browser-storage';

function safe<T=any>(key:string,fallback:T[]=[]):T[]{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return fallback}}

type Lifestyle='هادئ'|'عائلي'|'حضري'|'بحري'|'استثماري';
const lifestyleMeta:Record<Lifestyle,{icon:React.ReactNode,copy:string}>={
  'هادئ':{icon:<Trees/>,copy:'خصوصية وهدوء ومساحات أقل كثافة.'},
  'عائلي':{icon:<UsersRound/>,copy:'خدمات يومية وملاءمة للأسرة.'},
  'حضري':{icon:<Building2/>,copy:'حركة، أعمال ووصول أسرع.'},
  'بحري':{icon:<Waves/>,copy:'قرب من الواجهة ونمط حياة مفتوح.'},
  'استثماري':{icon:<WalletCards/>,copy:'طلب، سيولة وعائد نموذجي.'},
};

export function LifestyleFinder(){
  const [mode,setMode]=useState<Lifestyle>('عائلي');
  const [city,setCity]=useState('الكل');
  const [budget,setBudget]=useState(4500000);
  const result=useMemo(()=>{
    const ns=neighborhoods.filter(n=>city==='الكل'||n.city===city);
    const scoreN=(n:(typeof neighborhoods)[number])=>n.score+(mode==='عائلي'&&n.family==='ممتاز'?8:0)+(mode==='حضري'&&n.walk==='ممتاز'?8:0)+(mode==='استثماري'&&n.demand.includes('جداً')?7:0)+(mode==='بحري'&&(n.slug.includes('jeddah')||n.slug==='obhur')?14:0)+(mode==='هادئ'&&n.family==='ممتاز'?5:0);
    const neighborhood=[...ns].sort((a,b)=>scoreN(b)-scoreN(a))[0]||neighborhoods[0];
    const ps=properties.filter(p=>(city==='الكل'||p.city===city)&&p.price<=budget*1.15);
    const scoreP=(p:Property)=>p.score+(mode==='استثماري'&&p.investment?12:0)+(mode==='عائلي'&&p.beds>=4?8:0)+(mode==='بحري'&&(p.city==='جدة'||p.district.includes('شاط'))?10:0)+(mode==='هادئ'&&p.type==='فيلا'?6:0)+(mode==='حضري'&&(p.type==='شقة'||p.type==='بنتهاوس'||p.type==='مكتب')?7:0)-Math.abs(p.price-budget)/Math.max(1,budget)*7;
    const matches=[...ps].sort((a,b)=>scoreP(b)-scoreP(a)).slice(0,3);
    return {neighborhood,matches,fit:Math.min(98,Math.round(scoreN(neighborhood)))};
  },[mode,city,budget]);
  return <div className="lifestyleFinder">
    <section className="lifestyleControls"><div className="lifestyleIntro"><span>ATHEELDAR LIFESTYLE DISCOVERY</span><h2>ابدأ من طريقة حياتك، <em>لا من نوع العقار فقط.</em></h2><p>اختر الإحساس الذي تريده من يومك، ثم دع النموذج يربطه بأحياء وعقارات مناسبة داخل بيانات العرض.</p></div><div className="lifestyleModes">{(Object.keys(lifestyleMeta) as Lifestyle[]).map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}><i>{lifestyleMeta[x].icon}</i><b>{x}</b><small>{lifestyleMeta[x].copy}</small></button>)}</div><div className="lifestyleInputs"><label>المدينة<select value={city} onChange={e=>setCity(e.target.value)}><option>الكل</option><option>الرياض</option><option>جدة</option><option>الدرعية</option><option>الخبر</option></select></label><label>الميزانية التقريبية <b>{money(budget)} ر.س</b><input type="range" min="1200000" max="9000000" step="200000" value={budget} onChange={e=>setBudget(+e.target.value)}/></label></div></section>
    <section className="lifestyleResult"><div className="lifestyleNeighborhood"><img src={result.neighborhood.image} alt={result.neighborhood.name}/><div className="lifestyleShade"/><span>أفضل سياق مكاني نموذجي</span><h3>{result.neighborhood.name}</h3><p>{result.neighborhood.city} · {result.neighborhood.label}</p><div className="lifestyleFit"><Sparkles/><b>{result.fit}</b><small>/100</small></div><Link href={`/neighborhoods/${result.neighborhood.slug}`}>افتح ملف الحي <ArrowLeft/></Link></div><div className="lifestyleMatches"><div className="lifestyleMatchesHead"><span>MATCHED HOMES</span><b>عقارات أقرب لعدستك الحالية</b></div>{result.matches.length?result.matches.map((p,i)=><Link href={`/properties/${p.slug}`} key={p.slug}><span>0{i+1}</span><img src={p.image} alt={p.title}/><div><b>{p.title}</b><small>{p.city} · {p.district}</small><strong>{money(p.price)} ر.س</strong></div><ArrowLeft/></Link>):<div className="emptyBox">لا توجد نتائج قريبة من الميزانية الحالية. ارفع الميزانية قليلًا أو اختر مدينة أخرى.</div>}</div></section>
  </div>
}

export function SmartAlerts(){
  const [,tick]=useState(0);
  const [city,setCity]=useState('الرياض'),[type,setType]=useState('الكل'),[max,setMax]=useState(4000000),[purpose,setPurpose]=useState('للبيع');
  const alerts=safe<any>('atheeldar-alerts');
  const matches=properties.filter(p=>(city==='الكل'||p.city===city)&&(type==='الكل'||p.type===type)&&p.purpose===purpose&&p.price<=max);
  const save=()=>{const arr=safe<any>('atheeldar-alerts');arr.unshift({id:Date.now(),city,type,max,purpose,created:new Date().toISOString()});localStorage.setItem('atheeldar-alerts',JSON.stringify(arr.slice(0,10)));tick(v=>v+1)};
  const remove=(id:number)=>{localStorage.setItem('atheeldar-alerts',JSON.stringify(alerts.filter((a:any)=>a.id!==id)));tick(v=>v+1)};
  return <div className="alertsWorkspace"><section className="alertBuilder"><div className="toolHeader"><BellRing/><div><span>SMART ALERTS</span><h2>احفظ شروط البحث وتابع المطابق الآن ما يناسبني</h2></div></div><p>في هذا النموذج، التنبيه يحفظ قاعدة البحث ويحسب فورًا العقارات المطابقة من بيانات العرض الحالية.</p><div className="alertForm"><label>المدينة<select value={city} onChange={e=>setCity(e.target.value)}><option>الرياض</option><option>جدة</option><option>الدرعية</option><option>الخبر</option><option>الكل</option></select></label><label>النوع<select value={type} onChange={e=>setType(e.target.value)}><option>الكل</option><option>فيلا</option><option>شقة</option><option>بنتهاوس</option><option>تاون هاوس</option><option>مكتب</option><option>أرض</option></select></label><label>الغرض<select value={purpose} onChange={e=>setPurpose(e.target.value)}><option>للبيع</option><option>للإيجار</option></select></label><label>السعر حتى <b>{money(max)} ر.س</b><input type="range" min="500000" max="9000000" step="100000" value={max} onChange={e=>setMax(+e.target.value)}/></label></div><div className="alertPreview"><span><Sparkles/> المطابق الآن</span><b>{matches.length}</b><small>عقار داخل بيانات العرض الحالية</small></div><button className="primaryWide" onClick={save}><BookmarkPlus/> حفظ التنبيه</button></section><section className="savedAlerts"><div className="savedAlertsHead"><span>التنبيهات المحفوظة</span><b>{alerts.length}</b></div>{alerts.length?alerts.map((a:any)=><article key={a.id}><BellRing/><div><b>{a.city} · {a.type}</b><small>{a.purpose} · حتى {money(a.max)} ر.س</small></div><button onClick={()=>remove(a.id)} aria-label="حذف التنبيه"><Trash2/></button></article>):<div className="emptyBox">لم تحفظ أي تنبيه حتى الآن.</div>}<div className="alertNote"><AlertCircle/><span><b>نسخة Portfolio</b><small>التنبيهات هنا محفوظة محليًا. في النسخة التشغيلية تُربط بقاعدة البيانات والبريد/واتساب.</small></span></div></section></div>
}

export function ViewingPlanner(){
  const [ready,setReady]=useState(false);
  const [planIds,setPlanIds]=useState<string[]>([]);
  const [favoriteIds,setFavoriteIds]=useState<string[]>([]);
  const [minutesPerViewing,setMinutesPerViewing]=useState(55);
  const [status,setStatus]=useState('');
  const knownIds=(key:string)=>readStoredIds(key).filter(slug=>properties.some(property=>property.slug===slug));

  useEffect(()=>{
    const read=()=>{
      setPlanIds(readStoredIds(STORAGE_KEYS.viewingPlan).filter(slug=>properties.some(property=>property.slug===slug)).slice(0,6));
      setFavoriteIds(readStoredIds(STORAGE_KEYS.favorites).filter(slug=>properties.some(property=>property.slug===slug)));
      const duration=readJSON<unknown>('atheeldar-viewing-minutes-v1',55);
      setMinutesPerViewing(typeof duration==='number'&&[30,45,55,60,90].includes(duration)?duration:55);
      setReady(true);
    };
    const timer=window.setTimeout(read,0);
    const unsubscribe=subscribeStoredIds(read);
    return()=>{window.clearTimeout(timer);unsubscribe()};
  },[]);

  const favorites=favoriteIds.map(slug=>properties.find(property=>property.slug===slug)).filter((property):property is Property=>Boolean(property));
  const plan=planIds.map(slug=>properties.find(property=>property.slug===slug)).filter((property):property is Property=>Boolean(property));
  const announce=(message:string,persisted:boolean)=>setStatus(`${message}${persisted?'':' التغيير متاح لهذه الزيارة فقط؛ تعذّر الحفظ الدائم في المتصفح.'}`);
  const add=(slug:string)=>{
    if(readStoredIds(STORAGE_KEYS.viewingPlan).includes(slug))return;
    const result=toggleStoredId(STORAGE_KEYS.viewingPlan,slug,6);
    if(result.atCapacity){setStatus('المخطط يتسع لستة عقارات. أزل اختيارًا قبل إضافة عقار آخر.');return}
    announce('أُضيف العقار إلى خطة المعاينات.',result.persisted);
  };
  const remove=(slug:string)=>{
    const result=writeStoredIds(STORAGE_KEYS.viewingPlan,knownIds(STORAGE_KEYS.viewingPlan).filter(id=>id!==slug).slice(0,6));
    announce('أُزيل العقار من خطة المعاينات.',result.persisted);
  };
  const move=(slug:string,direction:-1|1)=>{
    const ids=knownIds(STORAGE_KEYS.viewingPlan).slice(0,6);
    const index=ids.indexOf(slug),destination=index+direction;
    if(index<0||destination<0||destination>=ids.length)return;
    [ids[index],ids[destination]]=[ids[destination],ids[index]];
    const result=writeStoredIds(STORAGE_KEYS.viewingPlan,ids);
    announce('حُفظ ترتيب المعاينات الجديد.',result.persisted);
  };
  const total=plan.length*minutesPerViewing;
  const multipleCities=new Set(plan.map(property=>property.city)).size>1;

  return <div className="viewingPlanner" aria-busy={!ready}>
    <section className="plannerBoard">
      <div className="plannerHeader">
        <div><span>ATHEELDAR VIEWING PLANNER</span><h2>رتّب المعاينات حسب أولوياتك.</h2><p>خطة شخصية محفوظة في متصفحك. اختر مدة مبدئية للمعاينة ورتّب العقارات؛ المواعيد الفعلية تحتاج تأكيدًا منفصلًا.</p></div>
        <div className="plannerDuration"><Clock3 aria-hidden="true"/><span><small>إجمالي وقت المعاينات فقط</small><b>{Math.floor(total/60)}س {total%60}د</b></span></div>
      </div>
      <div className="plannerAssumptions">
        <label>المدة التي تخطط لها لكل معاينة <select aria-label="المدة المبدئية لكل معاينة بالدقائق" value={minutesPerViewing} onChange={event=>{const result=writeJSON('atheeldar-viewing-minutes-v1',Number(event.target.value));announce('حُفظت المدة التي اخترتها للمعاينة.',result.persisted)}}>{[30,45,55,60,90].map(minutes=><option key={minutes} value={minutes}>{minutes} دقيقة</option>)}</select></label>
        <p>المدة افتراض لتنظيم وقتك، ولا تشمل الانتقال أو أي تقدير للمسافات.</p>
        {multipleCities&&<p>تضم اختياراتك أكثر من مدينة. راجع وقت الانتقال بينها عند توزيع المعاينات على الأيام.</p>}
      </div>
      <p className="propertyStatus" role="status" aria-live="polite">{status}</p>
      {!ready?<p role="status">نستعيد خطة المعاينات المحفوظة…</p>:plan.length?<div className="plannerTimeline">{plan.map((property,index)=><article key={property.slug}>
        <div className="plannerTime"><span>{String(index+1).padStart(2,'0')}</span><i/></div>
        <img src={property.image} alt={property.title} width={120} height={90} loading="lazy"/>
        <div><b>{property.title}</b><small><MapPinned aria-hidden="true"/> {property.city} · {property.district}</small><strong>{minutesPerViewing} دقيقة مخططة للمعاينة</strong></div>
        <div className="plannerControls"><button type="button" onClick={()=>move(property.slug,-1)} disabled={index===0} aria-label={`تقديم معاينة ${property.title}`}><ArrowUp aria-hidden="true"/></button><button type="button" onClick={()=>move(property.slug,1)} disabled={index===plan.length-1} aria-label={`تأخير معاينة ${property.title}`}><ArrowDown aria-hidden="true"/></button><button type="button" onClick={()=>remove(property.slug)} aria-label={`إزالة ${property.title} من خطة المعاينات`}><Trash2 aria-hidden="true"/></button></div>
      </article>)}</div>:<div className="plannerEmpty"><Route aria-hidden="true"/><b>لم تضف عقارات لخطة المعاينة بعد.</b><p>أضف من مفضلتك أدناه أو احفظ عقارات أولًا من صفحة البحث.</p></div>}
    </section>
    <aside className="plannerSource"><h3>من المفضلة</h3>{!ready?<p>نستعيد اختياراتك…</p>:favorites.length?favorites.map(property=><div key={property.slug}><img src={property.image} alt={property.title} width={120} height={90} loading="lazy"/><span><b>{property.title}</b><small>{property.city} · {property.district}</small></span><button type="button" onClick={()=>add(property.slug)} disabled={planIds.includes(property.slug)} aria-label={planIds.includes(property.slug)?`${property.title} ضمن الخطة`:`إضافة ${property.title} لخطة المعاينات`}>{planIds.includes(property.slug)?<Check aria-hidden="true"/>:'+'}</button></div>):<div className="emptyBox">احفظ بعض العقارات أولًا لتبني خطتك.</div>}<Link href="/properties">استكشف المزيد <ArrowLeft aria-hidden="true"/></Link></aside>
  </div>;
}

export function PropertyPassport({property}:{property:Property}){
  const checks=[
    {label:'هوية الإعلان',copy:'اسم الأصل، المدينة، الحي ونوع العقار موضحة داخل الصفحة.',done:true},
    {label:'المواصفات الأساسية',copy:'المساحة، الغرف، الحمامات والسعر معروضة بوضوح.',done:true},
    {label:'سياق الحي',copy:'يوجد ملف حي مستقل لفهم الطلب ونمط المنطقة.',done:!!property.neighborhoodSlug},
    {label:'وسائط العقار',copy:'معرض صور متعدد داخل تجربة Property Story.',done:property.gallery.length>=2},
    {label:'وثائق الصفقة',copy:'تحتاج تحققًا رسميًا في أي استخدام فعلي للمنصة.',done:false},
  ];
  const score=Math.round(checks.filter(x=>x.done).length/checks.length*100);
  return <section className="propertyPassport" id="passport"><div className="passportIntro"><span>ATHEELDAR PROPERTY PASSPORT</span><h2>شفافية قبل الحماس.</h2><p>هذه الطبقة توضح ما هو موجود في نموذج العرض وما الذي يحتاج تحققًا فعليًا قبل أي التزام.</p><div className="passportScore"><ShieldCheck/><b>{score}%</b><small>اكتمال معلومات العرض</small></div></div><div className="passportChecks">{checks.map((x,i)=><article key={x.label} className={x.done?'done':'pending'}><span>{x.done?<CheckCircle2/>:<FileCheck2/>}</span><div><small>0{i+1}</small><b>{x.label}</b><p>{x.copy}</p></div><em>{x.done?'متاح':'تحقق مطلوب'}</em></article>)}</div><div className="passportQuestions"><b>قبل المعاينة الفعلية اسأل عن:</b><span>الصك والملكية</span><span>الرخص والمخططات</span><span>الرسوم والالتزامات</span><span>حالة الضمان والصيانة</span></div></section>
}
