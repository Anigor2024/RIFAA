'use client';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useState,type KeyboardEvent} from 'react';
import {ArrowLeft,CalendarDays,Calculator,ChevronDown,Heart,MapPin,Scale,Search} from 'lucide-react';
import {properties} from '@/lib/atheeldar-data';
import {decisionTools,toolGroups} from '@/lib/decision-tools';
import {readStoredIds,STORAGE_KEYS,subscribeStoredIds} from '@/lib/browser-storage';
import {normalizeArabic} from '@/lib/property-search';
import {PropertyCard} from './PropertyCard';

type Mode='buy'|'rent'|'invest';
function moveTab<T extends string>(event:KeyboardEvent<HTMLButtonElement>,values:readonly T[],current:T,select:(value:T)=>void){
  let index=values.indexOf(current);
  if(event.key==='ArrowLeft')index=(index+1)%values.length;
  else if(event.key==='ArrowRight')index=(index-1+values.length)%values.length;
  else if(event.key==='Home')index=0;
  else if(event.key==='End')index=values.length-1;
  else return;
  event.preventDefault();
  select(values[index]);
  (event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index])?.focus();
}
export function HomeHero(){
  const [mode,setMode]=useState<Mode>('buy');
  const [city,setCity]=useState('الكل');
  const [type,setType]=useState('الكل');
  const [budget,setBudget]=useState('');
  const changeMode=(next:Mode)=>{setMode(next);setBudget('')};
  const budgets=mode==='rent'?[100000,200000,300000,500000,1000000]:[1500000,3000000,5000000,7500000,10000000];
  const budgetLabel=(amount:number)=>mode==='rent'?`${(amount/1000).toLocaleString('en-US')} ألف ر.س سنويًا`:`${amount/1000000} مليون ر.س`;
  return <>
    <section className="at-hero" aria-labelledby="at-home-title">
      <Image className="at-hero-photo" src="/images/atheeldar/villa-dusk.png" alt="عمارة معاصرة وحديقة مضاءة عند المساء — صورة تعبيرية" fill sizes="100vw" priority quality={85}/>
      <div className="at-hero-shade" aria-hidden="true"/>
      <div className="shell at-hero-inner"><div className="at-hero-copy"><h1 id="at-home-title">مساحتك القادمة،<br/>تبدأ من هنا.</h1><p>بيوت تشبهك. أحياء تناسب يومك. وقرار ترى تفاصيله بوضوح.</p><div className="at-hero-actions"><Link href="/properties" className="at-button at-button-brass">اكتشف العقارات<ArrowLeft size={21}/></Link><a href="#home-finder" className="at-hero-link">ساعدني أختار</a></div></div><div className="at-hero-caption"><b>تفاصيل تصنع الفارق</b><span>مساحات للعيش، لا للمشاهدة فقط</span></div></div>
    </section>
    <section className="shell at-home-search-wrap" aria-label="البحث عن عقارك">
      <div className="at-home-search"><div className="at-mode-tabs" role="tablist" aria-label="الغرض من البحث">{[{key:'buy',label:'للشراء'},{key:'rent',label:'للإيجار'},{key:'invest',label:'للاستثمار'}].map(item=><button key={item.key} type="button" role="tab" aria-selected={mode===item.key} tabIndex={mode===item.key?0:-1} onKeyDown={event=>moveTab(event,['buy','rent','invest'] as const,mode,changeMode)} aria-controls="at-search-fields" id={`at-mode-${item.key}`} onClick={()=>changeMode(item.key as Mode)}>{item.label}</button>)}</div>
        <form action="/properties" method="get" id="at-search-fields" aria-labelledby={`at-mode-${mode}`} role="tabpanel" className="at-search-fields">
          <input type="hidden" name="purpose" value={mode==='rent'?'للإيجار':'للبيع'}/>{mode==='invest'&&<input type="hidden" name="quick" value="استثماري"/>}
          <label className="at-select"><small>المدينة</small><span><MapPin size={20}/><select aria-label="المدينة" name="city" value={city} onChange={event=>setCity(event.target.value)}><option value="الكل">اختر المدينة</option>{['الرياض','جدة','الخبر','الدرعية'].map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={17}/></span></label>
          <label className="at-select"><small>نوع العقار</small><span><HomeIcon/><select aria-label="نوع العقار" name="type" value={type} onChange={event=>setType(event.target.value)}><option value="الكل">كل العقارات</option>{['فيلا','شقة','بنتهاوس','تاون هاوس','أرض','مكتب'].map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={17}/></span></label>
          <label className="at-select"><small>{mode==='rent'?'الميزانية السنوية':'الميزانية'}</small><span><Calculator size={19}/><select aria-label="الميزانية" name="max" value={budget} onChange={event=>setBudget(event.target.value)}><option value="">اختر الميزانية</option>{budgets.map(amount=><option key={amount} value={amount}>حتى {budgetLabel(amount)}</option>)}</select><ChevronDown size={17}/></span></label>
          <button type="submit" className="at-button at-search-submit"><Search size={21}/>ابحث عن عقارك</button>
        </form>
        <div className="at-city-shortcuts"><span>أو اختر من المدن الشائعة:</span>{['الرياض','جدة','الخبر','الدرعية'].map(item=><button key={item} type="button" aria-pressed={city===item} onClick={()=>setCity(city===item?'الكل':item)}>{item}</button>)}<Link href="/properties" className="at-advanced-search">البحث المتقدم<ArrowLeft size={15}/></Link></div>
      </div>
    </section>
  </>;
}
function HomeIcon(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-9h6v9"/></svg>}

export function HomeSelections(){
  const [selected,setSelected]=useState('الكل');
  const tabs=['الكل','للعائلة','للإيجار','للاستثمار'];
  const filtered=properties.filter(p=>selected==='الكل'?p.featured:selected==='للعائلة'?p.beds>=4&&p.type!=='أرض'&&p.type!=='مكتب':selected==='للإيجار'?p.purpose==='للإيجار':p.investment&&p.purpose==='للبيع').slice(0,3);
  return <section className="at-section shell at-featured" aria-labelledby="at-featured-title"><div className="at-section-heading"><h2 id="at-featured-title">مختارات تستحق أن تراها.</h2><Link href="/properties" className="at-text-link">جميع العقارات<ArrowLeft size={19}/></Link></div><div className="at-selection-tabs" role="tablist" aria-label="مختارات العقارات">{tabs.map(tab=><button id={`selection-${tabs.indexOf(tab)}`} key={tab} role="tab" aria-selected={tab===selected} tabIndex={tab===selected?0:-1} onKeyDown={event=>moveTab(event,tabs,selected,setSelected)} aria-controls="at-selections" onClick={()=>setSelected(tab)}>{tab}</button>)}</div><div className="propertyGrid" id="at-selections" role="tabpanel" aria-labelledby={`selection-${tabs.indexOf(selected)}`}><h3 className="at-sr-only">{selected}</h3>{filtered.map(p=><PropertyCard key={p.slug} p={p}/>)}</div><p className="at-catalog-note">عقارات وصور توضيحية لاستكشاف التجربة.</p></section>;
}

export function JourneyResume(){
  const [counts,setCounts]=useState({favorites:0,compare:0,viewings:0});
  useEffect(()=>{const count=(key:string)=>readStoredIds(key).filter(slug=>properties.some(p=>p.slug===slug)).length;const read=()=>setCounts({favorites:count(STORAGE_KEYS.favorites),compare:count(STORAGE_KEYS.compare),viewings:count(STORAGE_KEYS.viewingPlan)});read();return subscribeStoredIds(read)},[]);
  if(!counts.favorites&&!counts.compare&&!counts.viewings)return null;
  const next=counts.viewings?{href:'/viewing-planner',label:'راجع خطة المعاينات'}:counts.compare?{href:'/compare',label:'أكمل المقارنة'}:counts.favorites>=2?{href:'/decision-board',label:'رتّب اختياراتك'}:{href:'/account#favorites',label:'عد إلى محفوظاتك'};
  return <aside className="shell at-resume" aria-label="رحلتك المحفوظة"><div><span className="at-resume-icon"><Heart size={21}/></span><span><b>اختياراتك هنا. أكمل من حيث وصلت.</b><small>{counts.favorites} في المفضلة · {counts.compare} للمقارنة · {counts.viewings} للمعاينة</small></span></div><Link href={next.href}>{next.label}<ArrowLeft size={18}/></Link></aside>;
}
const cityStories=[{city:'الرياض',caption:'إيقاع المدينة، وهدوء البيت',image:'/images/atheeldar/riyadh.jpg'},{city:'جدة',caption:'للحياة وجه آخر على البحر',image:'/images/atheeldar/jeddah.jpg'},{city:'الخبر',caption:'مساحة أهدأ لكل يوم',image:'/images/atheeldar/khobar.jpg'}];
export function HomeCities(){return <section className="at-section shell at-cities" aria-labelledby="at-cities-title"><div className="at-section-heading"><h2 id="at-cities-title">الحي جزء من حكايتك.</h2><Link href="/neighborhoods" className="at-text-link">اكتشف الأحياء<ArrowLeft size={19}/></Link></div><div className="at-city-grid">{cityStories.map(city=><Link key={city.city} href={`/properties?city=${encodeURIComponent(city.city)}`} className="at-city-tile"><img src={city.image} alt={city.city} width={600} height={430} loading="lazy"/><div><h3>{city.city}</h3><p>{city.caption}</p></div><span className="at-city-arrow"><ArrowLeft size={21}/></span></Link>)}</div></section>}
const coreTools=[{Icon:Scale,title:'قارن على مهل',description:'ضع التفاصيل جنبًا إلى جنب، واختر ما يهمك.',label:'مقارنة العقارات',href:'/compare'},{Icon:Calculator,title:'اعرف ميزانيتك',description:'اختبر القسط والتكلفة قبل أن تختار.',label:'حاسبة التمويل',href:'/finance'},{Icon:CalendarDays,title:'خطط للمعاينة',description:'رتّب زياراتك واحتفظ بملاحظات كل عقار.',label:'مخطط المعاينات',href:'/viewing-planner'}];
export function HomeDecisionTools(){return <section className="at-decision-section"><div className="shell"><div className="at-section-heading"><h2>كل ما تحتاجه لقرار أوضح.</h2></div><div className="at-core-tools">{coreTools.map(({Icon,...tool})=><article key={tool.href}><Icon size={33}/><div><h3>{tool.title}</h3><p>{tool.description}</p><Link className="at-text-link" href={tool.href}>{tool.label}<ArrowLeft size={17}/></Link></div></article>)}</div><div className="at-all-tools"><Link href="/tools" className="at-text-link">استكشف كل أدوات القرار<ArrowLeft size={19}/></Link></div></div></section>}
export function ToolsDirectory(){
  const [group,setGroup]=useState('الكل');const [query,setQuery]=useState('');
  const filtered=decisionTools.filter(tool=>(group==='الكل'||tool.group===group)&&normalizeArabic(`${tool.title} ${tool.description}`).includes(normalizeArabic(query)));
  return <section className="shell at-tools-directory"><label className="at-directory-search"><Search size={22}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="ما الذي تريد إنجازه؟" aria-label="ابحث في أدوات القرار"/>{query&&<button onClick={()=>setQuery('')} aria-label="مسح البحث">مسح</button>}</label><div className="at-tool-tabs" aria-label="فئات الأدوات">{toolGroups.map(item=><button key={item} aria-pressed={item===group} onClick={()=>setGroup(item)}>{item}</button>)}</div><p className="at-tools-count" aria-live="polite">{filtered.length} أداة {group!=='الكل'?`في «${group}»`:'ترافقك في رحلتك'}</p><div className="at-tool-directory-grid">{filtered.map((tool,index)=><Link href={tool.href} key={tool.href}><small>{tool.group}</small><h2>{tool.title}</h2><p>{tool.description}</p><span><span>{String(index+1).padStart(2,'0')}</span><ArrowLeft size={21}/></span></Link>)}</div>{!filtered.length&&<div className="at-tools-empty"><h2>لم نجد أداة بهذا الاسم.</h2><p>جرّب «مقارنة» أو «تمويل»، أو اعرض كل الأدوات.</p><button className="at-button" onClick={()=>{setQuery('');setGroup('الكل')}}>عرض جميع الأدوات</button></div>}</section>;
}
