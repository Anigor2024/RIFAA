'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, BarChart3, Building2, Calculator, Check, Circle, FileText, Home, MapPinned, Printer, Scale, Sparkles, Target, TrendingUp, UsersRound, WalletCards } from 'lucide-react';
import { money, neighborhoods, properties } from '@/lib/atheeldar-data';

function readState<T>(key:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}}
function writeState(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

function monthlyPayment(principal:number,annualRate:number,years:number){
  if(principal<=0)return 0;
  const r=annualRate/100/12,n=years*12;
  return r===0?principal/n:principal*r/(1-Math.pow(1+r,-n));
}

export function BuyVsRentLab(){
  const [price,setPrice]=useState(3200000),[annualRent,setAnnualRent]=useState(180000),[down,setDown]=useState(20),[years,setYears]=useState(10),[rate,setRate]=useState(5.5),[appreciation,setAppreciation]=useState(3.2),[rentGrowth,setRentGrowth]=useState(3);
  useEffect(()=>{const id=window.setTimeout(()=>{const s=readState<any>('atheeldar-buy-rent',null);if(s){setPrice(s.price||3200000);setAnnualRent(s.annualRent||180000);setDown(s.down||20);setYears(s.years||10);setRate(s.rate||5.5);setAppreciation(s.appreciation||3.2);setRentGrowth(s.rentGrowth||3)}},0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>{writeState('atheeldar-buy-rent',{price,annualRent,down,years,rate,appreciation,rentGrowth})},[price,annualRent,down,years,rate,appreciation,rentGrowth]);
  const principal=price*(1-down/100);
  const monthly=monthlyPayment(principal,rate,25);
  const ownerCash=price*(down/100);
  const futureValue=price*Math.pow(1+appreciation/100,years);
  const loanBalance=principal*Math.max(0,1-years/25);
  const estimatedEquity=Math.max(0,futureValue-loanBalance);
  const ownershipOutflow=ownerCash+(monthly*12*years)+(price*.012*years);
  const rentOutflow=Array.from({length:years},(_,i)=>annualRent*Math.pow(1+rentGrowth/100,i)).reduce((a,b)=>a+b,0);
  const ownerNet=Math.round(estimatedEquity-ownershipOutflow);
  const renterNet=-Math.round(rentOutflow);
  const difference=Math.round((estimatedEquity-ownershipOutflow)+rentOutflow);
  const winner=difference>0?'الشراء أقوى في هذا السيناريو':'الاستئجار أخف في هذا السيناريو';
  return <div className="buyRentLabV15">
    <aside className="buyRentControlsV15">
      <span>BUY vs RENT · MODEL</span><h2>اختبر القرار <em>على الزمن.</em></h2><p>غيّر السعر والإيجار والدفعة والفائدة والنمو، وشاهد كيف تتغير الصورة بدل مقارنة قسط بإيجار فقط.</p>
      <label>سعر الشراء <b>{money(price)} ر.س</b><input type="range" min="800000" max="10000000" step="50000" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label>
      <label>الإيجار السنوي <b>{money(annualRent)} ر.س</b><input type="range" min="50000" max="600000" step="5000" value={annualRent} onChange={e=>setAnnualRent(Number(e.target.value))}/></label>
      <label>الدفعة الأولى <b>{down}%</b><input type="range" min="10" max="50" step="5" value={down} onChange={e=>setDown(Number(e.target.value))}/></label>
      <label>أفق القرار <b>{years} سنوات</b><input type="range" min="3" max="20" step="1" value={years} onChange={e=>setYears(Number(e.target.value))}/></label>
      <div className="buyRentMiniInputsV15"><label>فائدة نموذجية <input type="number" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label><label>نمو القيمة % <input type="number" step="0.1" value={appreciation} onChange={e=>setAppreciation(Number(e.target.value))}/></label><label>نمو الإيجار % <input type="number" step="0.1" value={rentGrowth} onChange={e=>setRentGrowth(Number(e.target.value))}/></label></div>
    </aside>
    <section className="buyRentOutcomeV15">
      <div className="buyRentVerdictV15"><div><small>SCENARIO SIGNAL</small><h3>{winner}</h3><p>الفرق النموذجي بعد {years} سنوات: <b>{money(Math.abs(difference))} ر.س</b> لصالح {difference>0?'الشراء':'الاستئجار'}.</p></div><div className={difference>0?'buy':'rent'}><Scale/><b>{difference>0?'BUY':'RENT'}</b></div></div>
      <div className="buyRentColumnsV15"><article><Home/><span>مسار الشراء</span><div><small>دفعة أولى</small><b>{money(Math.round(ownerCash))}</b></div><div><small>قسط شهري نموذجي</small><b>{money(Math.round(monthly))}</b></div><div><small>قيمة مستقبلية مفترضة</small><b>{money(Math.round(futureValue))}</b></div><div><small>حقوق ملكية تقديرية</small><b>{money(Math.round(estimatedEquity))}</b></div><strong className={ownerNet>=renterNet?'leader':''}>صافي نموذجي {money(ownerNet)} ر.س</strong></article><article><WalletCards/><span>مسار الاستئجار</span><div><small>إيجار السنة الأولى</small><b>{money(annualRent)}</b></div><div><small>إجمالي الإيجار خلال المدة</small><b>{money(Math.round(rentOutflow))}</b></div><div><small>دفعة رأسمالية أولى</small><b>0 ر.س</b></div><div><small>حقوق ملكية</small><b>0 ر.س</b></div><strong className={renterNet>ownerNet?'leader':''}>صافي نموذجي {money(renterNet)} ر.س</strong></article></div>
      <div className="buyRentCaveatV15"><Calculator/><div><b>هذه محاكاة تعليمية وليست توصية مالية.</b><p>الضرائب والرسوم والصيانة والعائد البديل وظروف التمويل الفعلية قد تغيّر النتيجة جذريًا.</p></div><Link href="/finance">افتح مختبر التمويل <ArrowLeft/></Link></div>
    </section>
  </div>
}

type Goal='عائلة'|'حضري'|'استثمار'|'هدوء';
function scoreFamily(v:string){return v==='ممتاز'?96:v==='جيد'?78:68}
function scoreWalk(v:string){return v==='ممتاز'?96:v==='جيد'?84:v==='متوسط'?69:60}
function scoreDemand(v:string){return v.includes('جدًا')?97:v==='مرتفع'?87:72}
export function AreaMatchMatrix(){
  const [goal,setGoal]=useState<Goal>('عائلة');
  const [selected,setSelected]=useState<string[]>(neighborhoods.slice(0,4).map(n=>n.slug));
  const weights={
    'عائلة':{family:.48,walk:.2,demand:.12,quality:.2},
    'حضري':{family:.12,walk:.46,demand:.2,quality:.22},
    'استثمار':{family:.08,walk:.16,demand:.48,quality:.28},
    'هدوء':{family:.36,walk:.12,demand:.12,quality:.4},
  }[goal];
  const calc=(n:typeof neighborhoods[number])=>Math.round(scoreFamily(n.family)*weights.family+scoreWalk(n.walk)*weights.walk+scoreDemand(n.demand)*weights.demand+n.score*weights.quality);
  const list=selected.map(s=>neighborhoods.find(n=>n.slug===s)).filter(Boolean) as typeof neighborhoods;
  const leader=[...list].sort((a,b)=>calc(b)-calc(a))[0];
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<4?[...v,slug]:v);
  return <div className="areaMatchV15">
    <aside className="areaMatchControlV15"><span>AREA MATCH MATRIX</span><h2>قارن الحي <em>بحسب حياتك.</em></h2><p>درجة الحي وحدها لا تكفي. غيّر الهدف لتتغير الأوزان ويظهر حي مختلف في المقدمة.</p><div className="areaGoalTabsV15">{(['عائلة','حضري','استثمار','هدوء'] as Goal[]).map(x=><button key={x} className={goal===x?'active':''} onClick={()=>setGoal(x)}>{x}</button>)}</div><div className="areaPickerV15">{neighborhoods.map(n=><button key={n.slug} className={selected.includes(n.slug)?'active':''} onClick={()=>toggle(n.slug)}><span>{selected.includes(n.slug)?<Check/>:<Circle/>}</span><div><b>{n.name}</b><small>{n.city} · {n.label}</small></div></button>)}</div></aside>
    <section className="areaMatchBoardV15">
      {leader&&<div className="areaLeaderV15"><Sparkles/><div><small>BEST MATCH · {goal}</small><h3>{leader.name}</h3><p>{leader.summary}</p></div><strong>{calc(leader)}/100</strong><Link href={`/neighborhoods/${leader.slug}`}>ملف الحي <ArrowLeft/></Link></div>}
      <div className="areaMatchGridV15">{list.map(n=><article key={n.slug}><img src={n.image} alt={n.name}/><div className="areaMatchScoreV15"><b>{calc(n)}</b><span>/100</span></div><small>{n.city}</small><h3>{n.name}</h3><p>{n.label}</p><div><span><small>عائلة</small><b>{scoreFamily(n.family)}</b></span><span><small>مشي</small><b>{scoreWalk(n.walk)}</b></span><span><small>طلب</small><b>{scoreDemand(n.demand)}</b></span><span><small>جودة عامة</small><b>{n.score}</b></span></div><strong>{n.price}</strong><Link href={`/neighborhoods/${n.slug}`}>استكشف الحي <ArrowLeft/></Link></article>)}</div>
    </section>
  </div>
}

type Brief={purpose:string;city:string;budget:string;timeline:string;type:string;beds:string;priorities:string[];notes:string};
const defaultBrief:Brief={purpose:'سكن رئيسي',city:'الرياض',budget:'3–5 مليون',timeline:'خلال 3–6 أشهر',type:'فيلا',beds:'4+',priorities:['حي عائلي','خصوصية'],notes:''};
const priorities=['حي عائلي','قرب الأعمال','هدوء','واجهة بحرية','بناء جديد','عائد استثماري','جاهز للسكن','مساحات خارجية'];
export function PrivateClientBrief(){
  const [brief,setBrief]=useState<Brief>(defaultBrief);
  useEffect(()=>{const id=window.setTimeout(()=>setBrief(readState<Brief>('atheeldar-private-brief',defaultBrief)),0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>writeState('atheeldar-private-brief',brief),[brief]);
  const toggle=(x:string)=>setBrief(v=>({...v,priorities:v.priorities.includes(x)?v.priorities.filter(p=>p!==x):[...v.priorities,x].slice(0,5)}));
  const score=Math.min(100,45+(brief.priorities.length*8)+(brief.notes.trim()?10:0)+(brief.budget?5:0));
  const matches=properties.filter(p=>(brief.city==='الكل'||p.city===brief.city)&&(brief.type==='الكل'||p.type===brief.type)).sort((a,b)=>b.score-a.score).slice(0,3);
  return <div className="clientBriefV15">
    <aside className="clientBriefFormV15"><span>PRIVATE CLIENT BRIEF</span><h2>حوّل الكلام العام إلى <em>طلب قابل للعمل.</em></h2><p>ملف احتياج منظم يساعد المستشار على فهم الهدف والميزانية والتوقيت والأولويات قبل أول مكالمة.</p>
      <div className="briefFormGridV15"><label>الهدف<select value={brief.purpose} onChange={e=>setBrief({...brief,purpose:e.target.value})}>{['سكن رئيسي','سكن ثانٍ','استثمار','انتقال لمدينة جديدة'].map(x=><option key={x}>{x}</option>)}</select></label><label>المدينة<select value={brief.city} onChange={e=>setBrief({...brief,city:e.target.value})}>{['الرياض','جدة','الخبر','الدرعية','الكل'].map(x=><option key={x}>{x}</option>)}</select></label><label>الميزانية<select value={brief.budget} onChange={e=>setBrief({...brief,budget:e.target.value})}>{['أقل من 2 مليون','2–3 مليون','3–5 مليون','5–8 مليون','أكثر من 8 مليون'].map(x=><option key={x}>{x}</option>)}</select></label><label>التوقيت<select value={brief.timeline} onChange={e=>setBrief({...brief,timeline:e.target.value})}>{['فورًا','خلال 1–3 أشهر','خلال 3–6 أشهر','خلال سنة'].map(x=><option key={x}>{x}</option>)}</select></label><label>نوع الأصل<select value={brief.type} onChange={e=>setBrief({...brief,type:e.target.value})}>{['فيلا','شقة','بنتهاوس','تاون هاوس','مكتب','أرض','الكل'].map(x=><option key={x}>{x}</option>)}</select></label><label>الغرف<select value={brief.beds} onChange={e=>setBrief({...brief,beds:e.target.value})}>{['2+','3+','4+','5+','غير مهم'].map(x=><option key={x}>{x}</option>)}</select></label></div>
      <div className="briefPrioritiesV15"><small>اختر حتى 5 أولويات</small><div>{priorities.map(x=><button key={x} className={brief.priorities.includes(x)?'active':''} onClick={()=>toggle(x)}>{brief.priorities.includes(x)?<Check/>:<Circle/>}{x}</button>)}</div></div>
      <label className="briefNotesV15">ملاحظات خاصة<textarea value={brief.notes} onChange={e=>setBrief({...brief,notes:e.target.value})} placeholder="مثال: أحتاج مجلسًا مستقلًا، مدرسة دولية قريبة، وأفضل مشروعًا جديدًا..."/></label>
    </aside>
    <section className="clientBriefPackV15"><div className="briefPackHeadV15"><div><small>ATHEELDAR · ADVISOR HANDOFF</small><h3>Private Client Brief</h3><p>جاهزية الملف <b>{score}/100</b></p></div><BadgeCheck/></div><div className="briefPackFactsV15"><span><small>الهدف</small><b>{brief.purpose}</b></span><span><small>المدينة</small><b>{brief.city}</b></span><span><small>الميزانية</small><b>{brief.budget}</b></span><span><small>التوقيت</small><b>{brief.timeline}</b></span><span><small>الأصل</small><b>{brief.type}</b></span><span><small>الغرف</small><b>{brief.beds}</b></span></div><div className="briefPrioritySummaryV15"><small>PRIORITIES</small><div>{brief.priorities.map((x,i)=><span key={x}>0{i+1} · {x}</span>)}</div></div>{brief.notes&&<div className="briefNarrativeV15"><small>CLIENT NOTE</small><p>{brief.notes}</p></div>}<div className="briefMatchesV15"><div><small>MODEL MATCHES</small><b>3 أصول كبداية للمناقشة</b></div>{matches.map(p=><Link href={`/properties/${p.slug}`} key={p.slug}><img src={p.image} alt={p.title}/><span><small>{p.city} · {p.district}</small><b>{p.title}</b><em>{money(p.price)} ر.س</em></span><ArrowLeft/></Link>)}</div><div className="briefActionsV15"><button onClick={()=>window.print()}><Printer/> طباعة / PDF</button><Link href="/advisors">اختر مستشارًا <ArrowLeft/></Link></div><p className="briefPrivacyV15">البيانات محفوظة محليًا في المتصفح داخل هذا النموذج ولا تُرسل تلقائيًا إلى مستشار.</p></section>
  </div>
}
