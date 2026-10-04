'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, CheckCircle2, Circle, ClipboardCheck, FileText, Home, KeyRound, MapPin, Printer, RotateCcw, Scale, Sparkles, Star, UsersRound, WalletCards, Wrench } from 'lucide-react';
import { money, properties, type Property } from '@/lib/atheeldar-data';

function readJSON<T>(key:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{return JSON.parse(localStorage.getItem(key)||'') as T}catch{return fallback}}
function writeJSON(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

type HouseholdMember={id:string;name:string;role:string};
type Vote={score:number;note:string};
type HouseholdState={members:HouseholdMember[];selected:string[];votes:Record<string,Record<string,Vote>>};
const householdKey='atheeldar-household-room-v17';
const defaultMembers:HouseholdMember[]=[
  {id:'m1',name:'أنا',role:'صاحب القرار'},
  {id:'m2',name:'شريك القرار',role:'الأسرة'},
  {id:'m3',name:'رأي ثالث',role:'مستشار عائلي'},
];

export function HouseholdDecisionRoom(){
  const [state,setState]=useState<HouseholdState>({members:defaultMembers,selected:properties.slice(0,3).map(p=>p.slug),votes:{}});
  const [memberId,setMemberId]=useState('m1');
  useEffect(()=>{const id=window.setTimeout(()=>setState(readJSON<HouseholdState>(householdKey,{members:defaultMembers,selected:properties.slice(0,3).map(p=>p.slug),votes:{}})),0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>writeJSON(householdKey,state),[state]);
  const selected=state.selected.map(id=>properties.find(p=>p.slug===id)).filter(Boolean) as Property[];
  const current=state.members.find(m=>m.id===memberId)||state.members[0];
  const setMemberName=(id:string,name:string)=>setState(s=>({...s,members:s.members.map(m=>m.id===id?{...m,name}:m)}));
  const toggleProperty=(slug:string)=>setState(s=>({...s,selected:s.selected.includes(slug)?s.selected.filter(x=>x!==slug):s.selected.length<4?[...s.selected,slug]:s.selected}));
  const vote=(slug:string,score:number)=>setState(s=>({...s,votes:{...s.votes,[slug]:{...(s.votes[slug]||{}),[memberId]:{score,note:s.votes[slug]?.[memberId]?.note||''}}}}));
  const note=(slug:string,value:string)=>setState(s=>({...s,votes:{...s.votes,[slug]:{...(s.votes[slug]||{}),[memberId]:{score:s.votes[slug]?.[memberId]?.score||0,note:value}}}}));
  const metrics=(slug:string)=>{const vals=state.members.map(m=>state.votes[slug]?.[m.id]?.score||0).filter(Boolean);if(!vals.length)return{avg:0,agreement:0,count:0};const avg=vals.reduce((a,b)=>a+b,0)/vals.length;const spread=Math.max(...vals)-Math.min(...vals);return{avg,agreement:Math.max(0,100-spread*20),count:vals.length}};
  const ranked=[...selected].sort((a,b)=>metrics(b.slug).avg-metrics(a.slug).avg);
  return <div className="householdRoomV17">
    <aside className="householdControlV17">
      <span>HOUSEHOLD DECISION ROOM</span><h2>قرار الأسرة، <em>بدون ضياع الآراء.</em></h2><p>كل شخص يقيّم نفس الأصول من 1 إلى 5. أثيلدار تجمع المتوسط وتكشف أين يوجد اتفاق وأين يحتاج القرار لنقاش.</p>
      <div className="householdMembersV17">{state.members.map(m=><button key={m.id} className={memberId===m.id?'active':''} onClick={()=>setMemberId(m.id)}><UsersRound/><span><b>{m.name}</b><small>{m.role}</small></span></button>)}</div>
      <label className="householdNameV17">اسم المقيّم الحالي<input value={current.name} onChange={e=>setMemberName(current.id,e.target.value)}/></label>
      <div className="householdPickerV17"><small>اختر حتى 4 عقارات</small>{properties.slice(0,7).map(p=><button key={p.slug} className={state.selected.includes(p.slug)?'active':''} onClick={()=>toggleProperty(p.slug)}><span>{state.selected.includes(p.slug)?<Check/>:<Circle/>}</span><div><b>{p.title}</b><small>{p.city} · {money(p.price)} ر.س</small></div></button>)}</div>
    </aside>
    <section className="householdBoardV17">
      <div className="householdBoardHeadV17"><div><small>CONSENSUS BOARD</small><h3>رأي {current.name}</h3><p>قيّم كل أصل ثم بدّل بين الأشخاص لتظهر درجة التوافق.</p></div>{ranked[0]&&<div><Sparkles/><span><small>LEADING MATCH</small><b>{ranked[0].title}</b></span></div>}</div>
      <div className="householdAssetsV17">{selected.map(p=>{const m=metrics(p.slug);const my=state.votes[p.slug]?.[memberId];return <article key={p.slug}><img src={p.image} alt={p.title}/><div className="householdAssetMetaV17"><small>{p.city} · {p.district}</small><h3>{p.title}</h3><b>{money(p.price)} ر.س</b></div><div className="householdRatingV17"><small>تقييم {current.name}</small><div>{[1,2,3,4,5].map(v=><button key={v} className={v<=(my?.score||0)?'active':''} onClick={()=>vote(p.slug,v)}><Star/></button>)}</div></div><textarea value={my?.note||''} onChange={e=>note(p.slug,e.target.value)} placeholder="ما الذي يعجبك أو يقلقك؟"/><div className="householdConsensusV17"><span><small>متوسط الأسرة</small><b>{m.avg?m.avg.toFixed(1):'—'}/5</b></span><span><small>درجة الاتفاق</small><b>{m.count>1?m.agreement+'%':'—'}</b></span><span><small>أصوات مكتملة</small><b>{m.count}/{state.members.length}</b></span></div><Link href={'/properties/'+p.slug}>فتح العقار <ArrowLeft/></Link></article>})}</div>
      {!selected.length&&<div className="householdEmptyV17"><UsersRound/><b>اختر عقارًا واحدًا على الأقل.</b><p>ابدأ من القائمة الجانبية لبناء جلسة القرار.</p></div>}
    </section>
  </div>
}

type InspectionState={scores:Record<string,number>;flags:string[];note:string;updated:number};
const inspectionLabels:{id:string;label:string}[]=[
  {id:'light',label:'الإضاءة'},{id:'noise',label:'الهدوء'},{id:'layout',label:'التوزيع'},{id:'finish',label:'التشطيب'},
  {id:'systems',label:'الأنظمة'},{id:'condition',label:'الحالة'},{id:'privacy',label:'الخصوصية'},{id:'feeling',label:'الانطباع'}
];
function inspectionFor(slug:string){return readJSON<InspectionState|null>('atheeldar-inspection-v16-'+slug,null)}
function inspectionScore(s:InspectionState|null){if(!s)return 0;const vals=Object.values(s.scores||{});return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*20):0}

export function InspectionCompare(){
  const [tick,setTick]=useState(0);
  const inspected=useMemo(()=>properties.map(p=>({p,s:inspectionFor(p.slug)})).filter(x=>x.s),[tick]);
  const [selected,setSelected]=useState<string[]>([]);
  useEffect(()=>{const id=window.setTimeout(()=>{const ids=properties.filter(p=>inspectionFor(p.slug)).slice(0,4).map(p=>p.slug);setSelected(ids)},0);return()=>window.clearTimeout(id)},[tick]);
  const seedDemo=()=>{const demos=[
    {slug:properties[0].slug,scores:{light:5,noise:4,layout:5,finish:4,systems:4,condition:4,privacy:5,feeling:5},flags:['صيانة تكييف'],note:'بيانات عرض تجريبية فقط.'},
    {slug:properties[1].slug,scores:{light:5,noise:3,layout:4,finish:5,systems:4,condition:5,privacy:4,feeling:4},flags:['ضوضاء ملحوظة'],note:'بيانات عرض تجريبية فقط.'},
    {slug:properties[2].slug,scores:{light:4,noise:4,layout:4,finish:4,systems:5,condition:4,privacy:3,feeling:4},flags:['خصوصية ضعيفة'],note:'بيانات عرض تجريبية فقط.'},
  ];demos.forEach(d=>writeJSON('atheeldar-inspection-v16-'+d.slug,{scores:d.scores,flags:d.flags,note:d.note,updated:Date.now()}));setTick(v=>v+1)};
  const clearDemo=()=>{properties.forEach(p=>{try{const s=inspectionFor(p.slug);if(s?.note==='بيانات عرض تجريبية فقط.')localStorage.removeItem('atheeldar-inspection-v16-'+p.slug)}catch{}});setTick(v=>v+1)};
  const toggle=(slug:string)=>setSelected(v=>v.includes(slug)?v.filter(x=>x!==slug):v.length<4?[...v,slug]:v);
  const rows=selected.map(id=>{const p=properties.find(x=>x.slug===id)!;const s=inspectionFor(id);return{p,s,score:inspectionScore(s)}}).filter(x=>x.s);
  const leader=[...rows].sort((a,b)=>b.score-a.score)[0];
  return <div className="inspectionCompareV17">
    <aside className="inspectionCompareSideV17"><span>INSPECTION COMPARE</span><h2>قارن ما رأيته <em>بعد المعاينة.</em></h2><p>هنا لا نقارن الإعلان. نقارن تقييمك الحقيقي للإضاءة والهدوء والتوزيع والحالة والخصوصية وغيرها.</p><div className="inspectionCompareActionsV17"><button onClick={seedDemo}><Sparkles/> تشغيل بيانات عرض تجريبية</button><button onClick={clearDemo}><RotateCcw/> إزالة بيانات العرض</button></div><div className="inspectionAvailableV17"><small>تقارير متاحة</small>{inspected.length?inspected.map(x=><button key={x.p.slug} className={selected.includes(x.p.slug)?'active':''} onClick={()=>toggle(x.p.slug)}><span>{selected.includes(x.p.slug)?<Check/>:<Circle/>}</span><div><b>{x.p.title}</b><small>{inspectionScore(x.s)} / 100 · {x.s?.flags.length||0} Red Flags</small></div></button>):<div className="inspectionNoDataV17"><ClipboardCheck/><b>لا توجد تقارير معاينة بعد.</b><p>ابدأ بمعاينة عقار أو شغّل بيانات العرض لتجربة الصفحة.</p></div>}</div></aside>
    <section className="inspectionCompareBoardV17">
      {leader&&<div className="inspectionCompareLeaderV17"><Sparkles/><div><small>HIGHEST INSPECTION SCORE</small><h3>{leader.p.title}</h3><p>{leader.p.city} · {leader.p.district}</p></div><strong>{leader.score}/100</strong></div>}
      {rows.length?<div className="inspectionCompareTableV17"><div className="inspectionCompareHeaderV17"><b>المحور</b>{rows.map(r=><span key={r.p.slug}><img src={r.p.image} alt=""/><b>{r.p.title}</b><small>{r.score}/100</small></span>)}</div>{inspectionLabels.map(row=><div className="inspectionCompareRowV17" key={row.id}><b>{row.label}</b>{rows.map(r=><span key={r.p.slug}>{r.s?.scores[row.id]?r.s.scores[row.id]+'/5':'—'}</span>)}</div>)}<div className="inspectionCompareRowV17 flags"><b>Red Flags</b>{rows.map(r=><span key={r.p.slug}>{r.s?.flags.length||0}</span>)}</div><div className="inspectionCompareRowV17 actions"><b>التقرير</b>{rows.map(r=><span key={r.p.slug}><Link href={'/properties/'+r.p.slug+'/inspection'}>فتح <ArrowLeft/></Link></span>)}</div></div>:<div className="inspectionCompareEmptyV17"><Scale/><h3>اختر تقارير للمقارنة.</h3><p>يمكن مقارنة حتى 4 عقارات بعد تسجيل معايناتها.</p></div>}
    </section>
  </div>
}

type MoveTask={id:string;stage:string;label:string;copy:string};
const moveTasks:MoveTask[]=[
  {id:'docs',stage:'قبل الاستلام',label:'راجع مستندات التسليم',copy:'اجمع النسخ النهائية ومحاضر أو مستندات الصفقة ذات الصلة.'},
  {id:'inspection',stage:'قبل الاستلام',label:'مراجعة الملاحظات الفنية',copy:'أغلق أو وثّق الملاحظات التي ظهرت في المعاينة والفحص.'},
  {id:'services',stage:'قبل الاستلام',label:'خطط للخدمات الأساسية',copy:'حدد إجراءات تفعيل أو نقل الخدمات الرسمية بحسب حالة الأصل.'},
  {id:'keys',stage:'يوم الاستلام',label:'استلام المفاتيح والوصول',copy:'وثّق عدد المفاتيح والبطاقات وأكواد الدخول المتاحة.'},
  {id:'meters',stage:'يوم الاستلام',label:'وثّق العدادات والحالة',copy:'سجل القراءات والصور الأساسية لحالة الأصل يوم الاستلام.'},
  {id:'handover',stage:'يوم الاستلام',label:'محضر استلام شخصي',copy:'اكتب ما تم استلامه وما بقي مفتوحًا للمتابعة.'},
  {id:'security',stage:'الأسبوع الأول',label:'حدّث الوصول والأمان',copy:'راجع الأقفال، الأكواد، أجهزة الوصول وإعدادات المنزل الذكي.'},
  {id:'maintenance',stage:'الأسبوع الأول',label:'جدول الصيانة الأول',copy:'التكييف، الفلاتر، المضخات وأي عناصر تحتاج دورة صيانة.'},
  {id:'furnish',stage:'الأسبوع الأول',label:'خطة الأثاث والمقاسات',copy:'ابدأ بالمساحات الأساسية وتحقق من المقاسات قبل الشراء.'},
  {id:'archive',stage:'الشهر الأول',label:'أنشئ أرشيف الأصل',copy:'احفظ المستندات، الضمانات، الفواتير وأرقام الموردين في مكان واحد.'},
  {id:'budget',stage:'الشهر الأول',label:'راجع ميزانية التشغيل',copy:'سجل المصروفات الفعلية وقارنها بتوقعات ما قبل الشراء.'},
  {id:'review',stage:'الشهر الأول',label:'مراجعة 30 يومًا',copy:'دوّن ما نجح وما يحتاج تعديلًا في المنزل أو خطة الصيانة.'},
];
const moveKey='atheeldar-move-in-v17';

export function MoveInPlanner(){
  const [property,setProperty]=useState(properties[0].slug),[done,setDone]=useState<string[]>([]),[date,setDate]=useState(''),[note,setNote]=useState('');
  useEffect(()=>{const id=window.setTimeout(()=>{const s=readJSON<any>(moveKey,null);if(s){setProperty(s.property||properties[0].slug);setDone(s.done||[]);setDate(s.date||'');setNote(s.note||'')}},0);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>writeJSON(moveKey,{property,done,date,note}),[property,done,date,note]);
  const p=properties.find(x=>x.slug===property)||properties[0];
  const progress=Math.round(done.length/moveTasks.length*100);
  const toggle=(id:string)=>setDone(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
  const stages=[...new Set(moveTasks.map(t=>t.stage))];
  return <div className="moveInPlannerV17">
    <aside className="moveInIdentityV17"><span>MOVE-IN & HANDOVER OS</span><img src={p.image} alt={p.title}/><small>{p.city} · {p.district}</small><h2>{p.title}</h2><label>العقار<select value={property} onChange={e=>setProperty(e.target.value)}>{properties.filter(x=>x.purpose==='للبيع').map(x=><option value={x.slug} key={x.slug}>{x.title} · {x.city}</option>)}</select></label><label>تاريخ الاستلام المتوقع<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><div className="moveProgressV17"><b>{progress}</b><span>%</span><small>اكتمال خطة الانتقال</small><i><em style={{width:progress+'%'}}/></i></div><button onClick={()=>window.print()}><Printer/> طباعة خطة الاستلام</button></aside>
    <section className="moveInBoardV17"><div className="moveInHeadV17"><div><small>FROM CLOSING TO LIVING</small><h1>الصفقة انتهت. <em>التجربة لم تنتهِ.</em></h1><p>خطة عملية من قبل الاستلام إلى أول 30 يومًا، تحفظ محليًا وتمنع التفاصيل الصغيرة من السقوط بين الأطراف.</p></div><KeyRound/></div>{stages.map((stage,si)=><section className="moveStageV17" key={stage}><div className="moveStageTitleV17"><span>0{si+1}</span><h3>{stage}</h3><small>{moveTasks.filter(t=>t.stage===stage&&done.includes(t.id)).length}/{moveTasks.filter(t=>t.stage===stage).length}</small></div><div>{moveTasks.filter(t=>t.stage===stage).map(t=><article key={t.id} className={done.includes(t.id)?'done':''}><button onClick={()=>toggle(t.id)}>{done.includes(t.id)?<CheckCircle2/>:<Circle/>}</button><span><b>{t.label}</b><p>{t.copy}</p></span></article>)}</div></section>)}<label className="moveNoteV17"><small>ملاحظات الاستلام والانتقال</small><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="موردون، قياسات، عناصر ناقصة، مواعيد، أكواد، ملاحظات صيانة..."/></label><div className="moveInFootV17"><ClipboardCheck/><span><b>خطة شخصية تنظيمية</b><small>لا تستبدل إجراءات الجهات الرسمية أو الفحص الفني أو الاستشارات المتخصصة.</small></span><Link href="/transaction-roadmap">العودة لمسار الصفقة <ArrowLeft/></Link></div></section>
  </div>
}
