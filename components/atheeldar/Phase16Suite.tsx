'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, BookmarkCheck, Check, CheckCircle2, Circle, ClipboardCheck, FileText, Gauge, Home, LayoutGrid, MapPin, Maximize2, PenLine, Printer, RotateCcw, ShieldCheck, Sparkles, Star, Sun, Volume2, Wrench, Zap, UsersRound } from 'lucide-react';
import { money, properties, type Property } from '@/lib/atheeldar-data';
import { readJSON, subscribeStoredIds, writeJSON } from '@/lib/browser-storage';

type JournalStatus='مرشح قوي'|'أحتاج مراجعة'|'احتياط'|'مستبعد';
type JournalEntry={slug:string;status:JournalStatus;reasons:string[];note:string;updated:number;inspection?:number};
const journalKey='atheeldar-decision-journal-v16';

const journalStatuses:JournalStatus[]=['مرشح قوي','أحتاج مراجعة','احتياط','مستبعد'];
const temporaryInspectionNotice='تعذّر الحفظ الدائم بالكامل في هذا المتصفح. التغييرات الحالية متاحة خلال هذه الزيارة فقط.';

function record(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{}}
function cleanJournal(value:unknown):JournalEntry[]{
  if(!Array.isArray(value))return[];
  const seen=new Set<string>();
  return value.flatMap(item=>{
    const entry=record(item);
    if(typeof entry.slug!=='string'||seen.has(entry.slug)||!properties.some(property=>property.slug===entry.slug))return[];
    seen.add(entry.slug);
    const valid:JournalEntry={
      slug:entry.slug,
      status:journalStatuses.includes(entry.status as JournalStatus)?entry.status as JournalStatus:'أحتاج مراجعة',
      reasons:Array.isArray(entry.reasons)?[...new Set(entry.reasons.filter((reason):reason is string=>typeof reason==='string'&&reasonOptions.includes(reason)))].slice(0,5):[],
      note:typeof entry.note==='string'?entry.note.slice(0,10000):'',
      updated:typeof entry.updated==='number'&&Number.isFinite(entry.updated)&&entry.updated>=0?entry.updated:0,
    };
    if(typeof entry.inspection==='number'&&Number.isFinite(entry.inspection)&&entry.inspection>=0&&entry.inspection<=100)valid.inspection=Math.round(entry.inspection);
    return[valid];
  });
}
function readJournal():JournalEntry[]{return cleanJournal(readJSON<unknown>(journalKey,[]))}
function writeJournal(value:JournalEntry[]){
  const result=writeJSON(journalKey,cleanJournal(value));
  if(typeof window!=='undefined')window.dispatchEvent(new Event('atheeldar:journal'));
  return result;
}

const reasonOptions=['سعر مناسب','موقع قوي','خصوصية','توزيع ممتاز','إضاءة طبيعية','جودة تشطيب','قريب من الخدمات','عائد محتمل','يحتاج صيانة','سعر مرتفع','ضوضاء','مساحات غير مناسبة'];

export function PropertySignatureWalkthrough({property}:{property:Property}){
  const scenes=[
    {k:'01',label:'ARRIVAL',title:'الانطباع الأول',copy:'اقرأ واجهة الأصل وموقعه قبل الدخول. في '+property.district+' تبدأ قيمة التجربة من السياق بقدر ما تبدأ من التصميم.',image:property.gallery[0]||property.image},
    {k:'02',label:'LIVING',title:'المشهد اليومي',copy:property.area+' م² و'+(property.beds||'—')+' غرف تعني أن السؤال ليس عن المساحة فقط، بل عن سهولة الحركة والضوء واستخدام كل متر.',image:property.gallery[1]||property.image},
    {k:'03',label:'DETAIL',title:'التفاصيل التي تبقى',copy:property.features.slice(0,3).join(' · ')+' — عناصر تصنع الفرق بعد أن يختفي أثر الصورة الأولى.',image:property.gallery[2]||property.gallery[0]||property.image},
  ];
  const [active,setActive]=useState(0);
  const scene=scenes[active];
  return <section className="signatureWalkV16">
    <div className="signatureWalkMediaV16"><img src={scene.image} alt={property.title}/><div className="signatureWalkShadeV16"/><div className="signatureWalkStampV16"><span>ATHEELDAR</span><b>{scene.k}</b><small>PROPERTY WALKTHROUGH</small></div><div className="signatureWalkCaptionV16"><span>{scene.label}</span><h2>{scene.title}</h2><p>{scene.copy}</p></div></div>
    <aside className="signatureWalkRailV16"><div><small>SIGNATURE WALKTHROUGH</small><h3>شاهد الأصل <em>كمشهد متكامل.</em></h3><p>ثلاثة فصول سريعة تحول معرض الصور من سلايدر إلى قصة قرار.</p></div><div className="signatureWalkTabsV16">{scenes.map((s,i)=><button key={s.k} onClick={()=>setActive(i)} className={i===active?'active':''}><span>{s.k}</span><div><small>{s.label}</small><b>{s.title}</b></div><ArrowLeft/></button>)}</div><div className="signatureWalkFactsV16"><span><Maximize2/><b>{money(property.area)}</b><small>م²</small></span><span><Gauge/><b>{property.score}</b><small>/100</small></span><span><MapPin/><b>{property.district}</b><small>{property.city}</small></span></div><Link href={'/properties/'+property.slug+'/inspection'}>جهّز تقييم المعاينة <ArrowLeft/></Link></aside>
  </section>
}

export function PropertyDecisionMemo({property}:{property:Property}){
  const [status,setStatus]=useState<JournalStatus>('أحتاج مراجعة'),[reasons,setReasons]=useState<string[]>([]),[note,setNote]=useState(''),[saved,setSaved]=useState(false);
  useEffect(()=>{const id=window.setTimeout(()=>{const e=readJournal().find(x=>x.slug===property.slug);if(e){setStatus(e.status);setReasons(e.reasons||[]);setNote(e.note||'')}},0);return()=>window.clearTimeout(id)},[property.slug]);
  const toggle=(r:string)=>setReasons(v=>v.includes(r)?v.filter(x=>x!==r):[...v,r].slice(0,5));
  const save=()=>{const all=readJournal();const old=all.find(x=>x.slug===property.slug);const next:JournalEntry={slug:property.slug,status,reasons,note,updated:Date.now(),inspection:old?.inspection};writeJournal([next,...all.filter(x=>x.slug!==property.slug)].slice(0,20));setSaved(true);window.setTimeout(()=>setSaved(false),1400)};
  return <section className="decisionMemoV16"><div className="decisionMemoIntroV16"><PenLine/><span>DECISION MEMORY</span><h2>سجّل <em>لماذا.</em></h2><p>بعد عدة عقارات، الذاكرة تخلط التفاصيل. أثيلدار تحفظ سبب موقفك من كل أصل بدل حفظ رابط فقط.</p><Link href="/decision-journal">افتح سجل القرار <ArrowLeft/></Link></div><div className="decisionMemoEditorV16"><div className="decisionMemoStatusesV16">{(['مرشح قوي','أحتاج مراجعة','احتياط','مستبعد'] as JournalStatus[]).map(x=><button key={x} className={status===x?'active':''} onClick={()=>setStatus(x)}>{status===x?<CheckCircle2/>:<Circle/>}{x}</button>)}</div><div className="decisionReasonChipsV16">{reasonOptions.slice(0,8).map(r=><button key={r} className={reasons.includes(r)?'active':''} onClick={()=>toggle(r)}>{reasons.includes(r)?<Check/>:'+'}{r}</button>)}</div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="مثال: ممتاز للعائلة، لكن أحتاج التأكد من الضوضاء مساءً..."/><button className="decisionMemoSaveV16" onClick={save}><BookmarkCheck/>{saved?'تم الحفظ':'احفظ موقفك من العقار'}</button></div></section>
}

type InspectionItem={id:string;label:string;copy:string;icon:typeof Sun};
const inspectionItems:InspectionItem[]=[
  {id:'light',label:'الإضاءة الطبيعية',copy:'قوة الضوء وتوزيعه في المساحات الرئيسية.',icon:Sun},
  {id:'noise',label:'الهدوء والضوضاء',copy:'الشارع، الجيران، الأجهزة والعزل.',icon:Volume2},
  {id:'layout',label:'جودة التوزيع',copy:'الحركة، الخصوصية واستغلال المساحة.',icon:LayoutGrid},
  {id:'finish',label:'التشطيبات',copy:'الأبواب، الأرضيات، الدهانات والتفاصيل.',icon:Sparkles},
  {id:'systems',label:'الأنظمة والخدمات',copy:'كهرباء، تكييف، مياه وتجهيزات أساسية.',icon:Zap},
  {id:'condition',label:'الحالة والصيانة',copy:'آثار رطوبة، تشققات أو احتياج صيانة.',icon:Wrench},
  {id:'privacy',label:'الخصوصية',copy:'الواجهات، النوافذ، المداخل والجيران.',icon:ShieldCheck},
  {id:'feeling',label:'الانطباع العام',copy:'هل تستطيع تخيل استخدام الأصل يوميًا؟',icon:Home},
];

type InspectionState={scores:Record<string,number>;flags:string[];note:string;updated:number};
const flagsList=['رطوبة أو تسريب','تشققات ظاهرة','ضوضاء ملحوظة','روائح','صيانة تكييف','ضعف ضغط المياه','مشكلة مواقف','خصوصية ضعيفة'];

function parseInspection(value:unknown):InspectionState{
  const saved=record(value);
  const rawScores=record(saved.scores);
  const scores:Record<string,number>={};
  inspectionItems.forEach(item=>{
    const score=rawScores[item.id];
    if(typeof score==='number'&&Number.isInteger(score)&&score>=1&&score<=5)scores[item.id]=score;
  });
  return{
    scores,
    flags:Array.isArray(saved.flags)?[...new Set(saved.flags.filter((flag):flag is string=>typeof flag==='string'&&flagsList.includes(flag)))]:[],
    note:typeof saved.note==='string'?saved.note.slice(0,10000):'',
    updated:typeof saved.updated==='number'&&Number.isFinite(saved.updated)&&saved.updated>=0?saved.updated:0,
  };
}

export function InspectionRoom({property}:{property:Property}){
  const key='atheeldar-inspection-v16-'+property.slug;
  const [report,setReport]=useState<InspectionState>(()=>parseInspection(null));
  const [loadedKey,setLoadedKey]=useState<string|null>(null);
  const [saveStatus,setSaveStatus]=useState('');
  const ready=loadedKey===key;

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      setReport(parseInspection(readJSON<unknown>(key,null)));
      setLoadedKey(key);
      setSaveStatus('');
    },0);
    return()=>window.clearTimeout(timer);
  },[key]);

  const {scores,flags,note}=report;
  const answered=Object.keys(scores).length;
  const avg=answered?Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/answered*20):0;
  const update=(next:InspectionState)=>{
    if(!ready)return;
    setReport(parseInspection(next));
    setSaveStatus('لديك تعديلات لم تُحفظ بعد. استخدم «حفظ تقرير المعاينة» لحفظها.');
  };
  const setScore=(id:string,value:number)=>update({...report,scores:{...scores,[id]:value}});
  const toggleFlag=(flag:string)=>update({...report,flags:flags.includes(flag)?flags.filter(value=>value!==flag):[...flags,flag]});
  const save=()=>{
    if(!ready)return;
    const next=parseInspection({...report,updated:Date.now()});
    const reportResult=writeJSON(key,next);
    const all=readJournal();
    const old=all.find(entry=>entry.slug===property.slug);
    const entry:JournalEntry=old?{...old,updated:next.updated}:{slug:property.slug,status:'أحتاج مراجعة',reasons:[],note:'',updated:next.updated};
    if(answered)entry.inspection=avg;
    else delete entry.inspection;
    const journalResult=writeJournal([entry,...all.filter(item=>item.slug!==property.slug)]);
    setReport(next);
    setSaveStatus(reportResult.persisted&&journalResult.persisted?'حُفظ تقرير المعاينة وحُدّث ملخصه في سجل القرار.':temporaryInspectionNotice);
  };
  const reset=()=>{
    if(!ready)return;
    // A null tombstone also clears the shared memory fallback when storage is blocked.
    const reportResult=writeJSON(key,null);
    const all=readJournal();
    const old=all.find(entry=>entry.slug===property.slug);
    let journalPersisted=true;
    if(old){
      const entry={...old,updated:Date.now()};
      delete entry.inspection;
      journalPersisted=writeJournal([entry,...all.filter(item=>item.slug!==property.slug)]).persisted;
    }
    setReport(parseInspection(null));
    setSaveStatus(reportResult.persisted&&journalPersisted?'مُسح تقرير المعاينة ونتيجته من سجل القرار. احتفظنا بموقفك وملاحظاتك الأخرى في السجل.':temporaryInspectionNotice);
  };
  return <div className="inspectionRoomV16" aria-busy={!ready}>
    <aside className="inspectionIdentityV16"><span>ATHEELDAR INSPECTION ROOM</span><img src={property.image} alt={property.title}/><small>{property.city} · {property.district}</small><h1>{property.title}</h1><b>{money(property.price)} ر.س{property.purpose==='للإيجار'?' سنويًا':''}</b><div className="inspectionScoreV16"><Gauge aria-hidden="true"/><strong>{answered?avg:'—'}</strong><span>/100</span><small>{answered}/8 محاور قيّمتها</small></div><p>هذا التقييم شخصي لمساعدتك في تنظيم ملاحظات المعاينة، وليس تقرير فحص هندسي.</p><button type="button" onClick={()=>window.print()}><Printer aria-hidden="true"/> طباعة التقرير</button><Link href={'/properties/'+property.slug}>العودة للعقار <ArrowLeft/></Link></aside>
    <section className="inspectionWorkspaceV16"><div className="inspectionHeadV16"><div><small>POST-VIEWING SCORECARD</small><h2>قيّم ما رأيته، <em>لا ما تذكره لاحقًا.</em></h2><p>استخدم مقياس 1–5 لكل محور أثناء أو بعد المعاينة مباشرة.</p></div><div className={avg>=80?'great':avg>=60?'good':'watch'}><b>{avg||'—'}</b><span>{avg>=80?'انطباع قوي':avg>=60?'يحتاج موازنة':answered?'راجع المخاطر':'ابدأ التقييم'}</span></div></div>
      <p className="propertyStatus" role="status" aria-live="polite">{ready?saveStatus:'نستعيد تقرير المعاينة المحفوظ…'}</p>
      <div className="inspectionGridV16">{inspectionItems.map(item=>{const I=item.icon;const value=scores[item.id]||0;return <article key={item.id}><I aria-hidden="true"/><div><b>{item.label}</b><p>{item.copy}</p></div><div className="inspectionStarsV16" role="group" aria-label={item.label}>{[1,2,3,4,5].map(score=><button type="button" key={score} disabled={!ready} className={score<=value?'active':''} onClick={()=>setScore(item.id,score)} aria-label={`${item.label}: ${score} من 5`} aria-pressed={score===value}><Star aria-hidden="true"/></button>)}</div><strong>{value?value+'/5':'—'}</strong></article>})}</div>
      <div className="inspectionFlagsV16"><div><AlertTriangle aria-hidden="true"/><span><small>نقاط للمراجعة</small><b>علّم أي نقطة تحتاج تحققًا أعمق</b></span></div><div>{flagsList.map(flag=><button type="button" key={flag} disabled={!ready} className={flags.includes(flag)?'active':''} onClick={()=>toggleFlag(flag)} aria-pressed={flags.includes(flag)}>{flags.includes(flag)?<Check aria-hidden="true"/>:<Circle aria-hidden="true"/>}{flag}</button>)}</div></div>
      <label className="inspectionNoteV16"><small>ملاحظة المعاينة</small><textarea value={note} disabled={!ready} maxLength={10000} onChange={event=>update({...report,note:event.target.value})} placeholder="دوّن ما لن يظهر في الصور: إحساس المكان، صوت الشارع، رائحة، جودة الإضاءة، أسئلة للمالك..."/></label>
      <div className="inspectionActionsV16"><button type="button" disabled={!ready||(!answered&&!note.trim()&&!flags.length)} onClick={save}><ClipboardCheck aria-hidden="true"/>حفظ تقرير المعاينة</button><button type="button" disabled={!ready} onClick={reset}><RotateCcw aria-hidden="true"/>إعادة التقييم</button><Link href="/decision-journal">فتح سجل القرار <ArrowLeft/></Link><Link href="/inspection-compare">قارن المعاينات <ArrowLeft/></Link></div>
    </section>
  </div>
}

export function DecisionJournal(){
  const [entries,setEntries]=useState<JournalEntry[]>([]);
  const [filter,setFilter]=useState<'الكل'|JournalStatus>('الكل');
  const [storageStatus,setStorageStatus]=useState('');
  useEffect(()=>{const read=()=>setEntries(readJournal());const id=window.setTimeout(read,0);const unsubscribe=subscribeStoredIds(read);window.addEventListener('atheeldar:journal',read);return()=>{window.clearTimeout(id);unsubscribe();window.removeEventListener('atheeldar:journal',read)}},[]);
  const visible=entries.filter(e=>filter==='الكل'||e.status===filter).sort((a,b)=>b.updated-a.updated);
  const strong=entries.filter(e=>e.status==='مرشح قوي').length;
  const inspected=entries.filter(e=>typeof e.inspection==='number').length;
  const remove=(slug:string)=>{const result=writeJournal(readJournal().filter(entry=>entry.slug!==slug));setEntries(readJournal());setStorageStatus(result.persisted?'أُزيل العقار من سجل القرار.':temporaryInspectionNotice)};
  return <div className="decisionJournalV16">
    <aside className="journalSummaryV16"><span>ATHEELDAR DECISION JOURNAL</span><h2>ذاكرة قرار <em>لا تضيع مع كثرة الخيارات.</em></h2><p>الروابط المحفوظة تخبرك ماذا رأيت. السجل يخبرك لماذا أبقيته أو استبعدته.</p><Link className="journalHouseholdLinkV17" href="/household-room"><UsersRound/> افتح غرفة قرار الأسرة <ArrowLeft/></Link><div className="journalStatsV16"><article><b>{entries.length}</b><small>أصل في السجل</small></article><article><b>{strong}</b><small>مرشح قوي</small></article><article><b>{inspected}</b><small>بتقييم معاينة</small></article></div><button onClick={()=>window.print()}><Printer/> طباعة سجل القرار</button></aside>
    <section className="journalBoardV16"><div className="journalToolbarV16"><div><small>FILTER BY DECISION</small><b>{visible.length} نتيجة</b></div><div>{(['الكل','مرشح قوي','أحتاج مراجعة','احتياط','مستبعد'] as const).map(x=><button type="button" key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)} aria-pressed={filter===x}>{x}</button>)}</div></div>
      <p className="propertyStatus" role="status" aria-live="polite">{storageStatus}</p>
      {visible.length?<div className="journalCardsV16">{visible.map(e=>{const p=properties.find(x=>x.slug===e.slug);if(!p)return null;return <article key={e.slug} className={e.status==='مرشح قوي'?'strong':''}><img src={p.image} alt={p.title}/><div className="journalCardTopV16"><span>{e.status}</span>{typeof e.inspection==='number'&&<b>تقييم معاينتك {e.inspection}/100</b>}</div><small>{p.city} · {p.district}</small><h3>{p.title}</h3><strong>{money(p.price)} ر.س{p.purpose==='للإيجار'?' سنويًا':''}</strong>{e.reasons.length>0&&<div className="journalReasonsV16">{e.reasons.map(r=><span key={r}>{r}</span>)}</div>}{e.note&&<p>“{e.note}”</p>}<div className="journalCardActionsV16"><Link href={'/properties/'+p.slug}>العقار <ArrowLeft/></Link><Link href={'/properties/'+p.slug+'/inspection'}>المعاينة <ArrowLeft/></Link><button type="button" onClick={()=>remove(e.slug)} aria-label={`إزالة ${p.title} من سجل القرار`}>إزالة</button></div></article>})}</div>:<div className="journalEmptyV16"><FileText/><h3>سجل القرار فارغ حتى الآن.</h3><p>افتح تقرير معاينة لأي عقار واحفظ تقييمك ليظهر هنا.</p><Link href="/properties">استكشف العقارات <ArrowLeft/></Link></div>}
    </section>
  </div>
}
