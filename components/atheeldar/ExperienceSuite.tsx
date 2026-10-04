'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, BellRing, BookmarkPlus, CalendarDays, Check, CheckCircle2, Clock3, Compass, FileCheck2, Home, MapPinned, Route, Save, ShieldCheck, Sparkles, Trash2, UsersRound, WalletCards, Waves, Trees, Building2 } from 'lucide-react';
import { neighborhoods, properties, money, type Property } from '@/lib/atheeldar-data';

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
  const matches=useMemo(()=>properties.filter(p=>(city==='الكل'||p.city===city)&&(type==='الكل'||p.type===type)&&p.purpose===purpose&&p.price<=max),[city,type,purpose,max]);
  const save=()=>{const arr=safe<any>('atheeldar-alerts');arr.unshift({id:Date.now(),city,type,max,purpose,created:new Date().toISOString()});localStorage.setItem('atheeldar-alerts',JSON.stringify(arr.slice(0,10)));tick(v=>v+1)};
  const remove=(id:number)=>{localStorage.setItem('atheeldar-alerts',JSON.stringify(alerts.filter((a:any)=>a.id!==id)));tick(v=>v+1)};
  return <div className="alertsWorkspace"><section className="alertBuilder"><div className="toolHeader"><BellRing/><div><span>SMART ALERTS</span><h2>نبّهني عندما يظهر ما يناسبني</h2></div></div><p>في هذا النموذج، التنبيه يحفظ قاعدة البحث ويحسب فورًا العقارات المطابقة من بيانات العرض الحالية.</p><div className="alertForm"><label>المدينة<select value={city} onChange={e=>setCity(e.target.value)}><option>الرياض</option><option>جدة</option><option>الدرعية</option><option>الخبر</option><option>الكل</option></select></label><label>النوع<select value={type} onChange={e=>setType(e.target.value)}><option>الكل</option><option>فيلا</option><option>شقة</option><option>بنتهاوس</option><option>تاون هاوس</option><option>مكتب</option><option>أرض</option></select></label><label>الغرض<select value={purpose} onChange={e=>setPurpose(e.target.value)}><option>للبيع</option><option>للإيجار</option></select></label><label>السعر حتى <b>{money(max)} ر.س</b><input type="range" min="500000" max="9000000" step="100000" value={max} onChange={e=>setMax(+e.target.value)}/></label></div><div className="alertPreview"><span><Sparkles/> المطابق الآن</span><b>{matches.length}</b><small>عقار داخل بيانات العرض الحالية</small></div><button className="primaryWide" onClick={save}><BookmarkPlus/> حفظ التنبيه</button></section><section className="savedAlerts"><div className="savedAlertsHead"><span>التنبيهات المحفوظة</span><b>{alerts.length}</b></div>{alerts.length?alerts.map((a:any)=><article key={a.id}><BellRing/><div><b>{a.city} · {a.type}</b><small>{a.purpose} · حتى {money(a.max)} ر.س</small></div><button onClick={()=>remove(a.id)} aria-label="حذف التنبيه"><Trash2/></button></article>):<div className="emptyBox">لم تحفظ أي تنبيه حتى الآن.</div>}<div className="alertNote"><AlertCircle/><span><b>نسخة Portfolio</b><small>التنبيهات هنا محفوظة محليًا. في النسخة التشغيلية تُربط بقاعدة البيانات والبريد/واتساب.</small></span></div></section></div>
}

export function ViewingPlanner(){
  const [,tick]=useState(0);
  const favorites=(safe<string>('atheeldar-favorites')||[]).map(slug=>properties.find(p=>p.slug===slug)).filter(Boolean) as Property[];
  const plan=safe<string>('atheeldar-viewing-plan').map(slug=>properties.find(p=>p.slug===slug)).filter(Boolean) as Property[];
  const add=(slug:string)=>{const ids=safe<string>('atheeldar-viewing-plan');if(!ids.includes(slug)){localStorage.setItem('atheeldar-viewing-plan',JSON.stringify([...ids,slug].slice(0,6)));tick(v=>v+1)}};
  const remove=(slug:string)=>{localStorage.setItem('atheeldar-viewing-plan',JSON.stringify(safe<string>('atheeldar-viewing-plan').filter(x=>x!==slug)));tick(v=>v+1)};
  const move=(idx:number,dir:-1|1)=>{const ids=safe<string>('atheeldar-viewing-plan');const to=idx+dir;if(to<0||to>=ids.length)return;[ids[idx],ids[to]]=[ids[to],ids[idx]];localStorage.setItem('atheeldar-viewing-plan',JSON.stringify(ids));tick(v=>v+1)};
  const total=plan.length*55+(Math.max(0,plan.length-1)*25);
  return <div className="viewingPlanner"><section className="plannerBoard"><div className="plannerHeader"><div><span>ATHEELDAR VIEWING PLANNER</span><h2>حوّل المعاينات إلى يوم منظم.</h2><p>رتّب العقارات، راجع المدن والأحياء، ثم استخدم الجدول كمسودة قبل تأكيد المواعيد الفعلية.</p></div><div className="plannerDuration"><Clock3/><span><small>مدة تقديرية</small><b>{Math.floor(total/60)}س {total%60}د</b></span></div></div>{plan.length?<div className="plannerTimeline">{plan.map((p,i)=><article key={p.slug}><div className="plannerTime"><span>{String(i+1).padStart(2,'0')}</span><i/></div><img src={p.image} alt={p.title}/><div><b>{p.title}</b><small><MapPinned/> {p.city} · {p.district}</small><strong>{i===0?'10:00 ص':`+${i*80} دقيقة تقريبًا`}</strong></div><div className="plannerControls"><button onClick={()=>move(i,-1)} disabled={i===0}><ArrowUp/></button><button onClick={()=>move(i,1)} disabled={i===plan.length-1}><ArrowDown/></button><button onClick={()=>remove(p.slug)}><Trash2/></button></div></article>)}</div>:<div className="plannerEmpty"><Route/><b>لم تضف عقارات لجدول المعاينة بعد.</b><p>أضف من مفضلتك أدناه أو احفظ عقارات أولًا من صفحة البحث.</p></div>}</section><aside className="plannerSource"><h3>من المفضلة</h3>{favorites.length?favorites.map(p=><div key={p.slug}><img src={p.image} alt={p.title}/><span><b>{p.title}</b><small>{p.city} · {p.district}</small></span><button onClick={()=>add(p.slug)} disabled={plan.some(x=>x.slug===p.slug)}>{plan.some(x=>x.slug===p.slug)?<Check/>:'+'}</button></div>):<div className="emptyBox">احفظ بعض العقارات أولًا لتبني جدولك.</div>}<Link href="/properties">استكشف المزيد <ArrowLeft/></Link></aside></div>
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
