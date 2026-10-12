'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readJSON, readStoredIds, STORAGE_KEYS, subscribeStoredIds, toggleStoredId, writeJSON, writeStoredIds } from '@/lib/browser-storage';
import { readPropertySearchParams, writePropertySearchParams } from '@/lib/property-search';
import { properties, money, type Property } from '@/lib/atheeldar-data';
import { CalendarDays, CheckCircle2, Heart, Phone, Save, TrendingUp, WalletCards, UserRoundCheck, Gauge, ShieldAlert, Trash2, Clock3, BarChart3, Eye, Bookmark, Compass } from 'lucide-react';

function safe<T=any>(key:string):T[]{const value=readJSON<unknown>(key,[]);return Array.isArray(value)?value as T[]:[]}

const temporarySaveNotice='تعذّر الحفظ الدائم في هذا المتصفح. المسودة متاحة خلال هذه الزيارة فقط.';

export function PropertyActionPanel({property}:{property:Property}) {
  const [fav,setFav]=useState(false);
  const [bookingResult,setBookingResult]=useState<'saved'|'temporary'|null>(null);
  const [status,setStatus]=useState('');

  useEffect(()=>{
    const read=()=>setFav(readStoredIds(STORAGE_KEYS.favorites).includes(property.slug));
    const unsubscribe=subscribeStoredIds(read);
    read();
    const recent=readStoredIds(STORAGE_KEYS.recent);
    writeStoredIds(STORAGE_KEYS.recent,[property.slug,...recent.filter(slug=>slug!==property.slug)].slice(0,8));
    return unsubscribe;
  },[property.slug]);

  const toggle=()=>{
    const result=toggleStoredId(STORAGE_KEYS.favorites,property.slug);
    setStatus(result.persisted?(result.added?'حُفظ العقار في المفضلة.':'أُزيل العقار من المفضلة.'):temporarySaveNotice);
  };
  const book=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const request={id:Date.now(),property:property.title,slug:property.slug,date:data.get('date'),time:data.get('time'),name:data.get('name'),phone:data.get('phone'),status:'draft',delivery:'local-only'};
    const result=writeJSON('atheeldar-bookings',[request,...safe('atheeldar-bookings')].slice(0,20));
    setBookingResult(result.persisted?'saved':'temporary');
  };

  return <aside className="actionPanel">
    <div className="actionPrice"><span>{property.purpose}</span><b>{money(property.price)} ر.س</b>{property.purpose==='للإيجار'&&<small>سنويًا</small>}</div>
    <button type="button" className={`favoriteWide ${fav?'on':''}`} onClick={toggle} aria-pressed={fav}><Heart size={18} aria-hidden="true" fill={fav?'currentColor':'none'}/>{fav?'محفوظ في المفضلة':'حفظ في المفضلة'}</button>
    <p className="propertyStatus" role="status" aria-live="polite">{status}</p>
    <div className="panelDivider"/>
    <h3>خطط لمعاينة خاصة</h3>
    {bookingResult?<div className="successBox" role="status">
      <CheckCircle2 aria-hidden="true"/><b>حُفظت مسودة طلب المعاينة</b>
      <p>يمكنك مراجعتها في مساحة العميل على هذا المتصفح. الموعد المقترح غير مؤكّد ولم يُرسل إلى مستشار.</p>
      {bookingResult==='temporary'&&<p>{temporarySaveNotice}</p>}
      <a href="/account">راجع الطلب في مساحة العميل</a>
    </div>:<form onSubmit={book} className="bookingForm">
      <p className="demoNotice">نموذج توضيحي يحفظ مسودة في متصفحك فقط. استخدم بيانات تجريبية؛ لا يتم إرسال طلب أو حجز موعد فعلي.</p>
      <label>الاسم<input name="name" required placeholder="اسم تجريبي" autoComplete="off"/></label>
      <label>الجوال<input name="phone" type="tel" required placeholder="05xxxxxxxx" inputMode="tel" autoComplete="off"/></label>
      <div className="form2"><label>اليوم المقترح<input name="date" type="date" required/></label><label>الوقت المقترح<select name="time"><option>10:00 ص</option><option>1:00 م</option><option>4:00 م</option><option>7:00 م</option></select></label></div>
      <button type="submit" className="primaryWide"><CalendarDays size={17} aria-hidden="true"/> حفظ طلب المعاينة</button>
    </form>}
    <a className="callLink" href="/contact"><Phone size={17} aria-hidden="true"/> خيارات التواصل</a>
  </aside>;
}

export function InvestmentLab(){
  const [price,setPrice]=useState(2500000),[rent,setRent]=useState(180000),[occupancy,setOccupancy]=useState(92),[costs,setCosts]=useState(26000),[growth,setGrowth]=useState(4.5);
  const gross=rent/price*100, net=((rent*occupancy/100)-costs)/price*100, future=price*Math.pow(1+growth/100,5), income=rent*occupancy/100-costs;
  const total5=income*5+(future-price), risk=occupancy>=90&&net>=5?'متوازن':occupancy>=80&&net>=3.5?'متوسط':'يحتاج مراجعة';
  const preset=(name:'محافظ'|'متوازن'|'نمو')=>{if(name==='محافظ'){setOccupancy(82);setGrowth(2.5);setCosts(34000)}else if(name==='متوازن'){setOccupancy(92);setGrowth(4.5);setCosts(26000)}else{setOccupancy(96);setGrowth(6);setCosts(22000)}};
  return <><div className="scenarioTabs"><span>سيناريوهات جاهزة</span><button onClick={()=>preset('محافظ')}>محافظ</button><button className="active" onClick={()=>preset('متوازن')}>متوازن</button><button onClick={()=>preset('نمو')}>نمو</button></div><div className="toolGrid"><section className="calculatorBox"><div className="toolHeader"><TrendingUp/><div><span>ATHEELDAR INVESTMENT LAB</span><h2>مختبر المستثمر</h2></div></div><p>غيّر الفرضيات وشاهد أثرها مباشرة. جميع النتائج تقديرية لأغراض العرض وليست توصية استثمارية.</p><label>قيمة العقار <b>{money(price)} ر.س</b><input type="range" min="500000" max="10000000" step="100000" value={price} onChange={e=>setPrice(+e.target.value)}/></label><label>الدخل الإيجاري السنوي<input type="number" value={rent} onChange={e=>setRent(+e.target.value)}/></label><div className="form2"><label>الإشغال المتوقع %<input type="number" min="0" max="100" value={occupancy} onChange={e=>setOccupancy(+e.target.value)}/></label><label>المصاريف السنوية<input type="number" value={costs} onChange={e=>setCosts(+e.target.value)}/></label></div><label>نمو القيمة السنوي %<input type="number" step="0.1" value={growth} onChange={e=>setGrowth(+e.target.value)}/></label><div className="riskRead"><Gauge/><span><small>قراءة السيناريو</small><b>{risk}</b></span><i style={{width:`${Math.min(100,Math.max(10,net*12+occupancy/4))}%`}}/></div></section><section className="metricBoard"><div><span>العائد الإجمالي</span><b>{gross.toFixed(2)}%</b><small>قبل المصاريف والإشغال</small></div><div><span>العائد الصافي التقديري</span><b>{net.toFixed(2)}%</b><small>بعد المصاريف والإشغال</small></div><div><span>صافي الدخل السنوي</span><b>{money(Math.round(income))}</b><small>ر.س / سنوي</small></div><div><span>حصيلة 5 سنوات</span><b>{money(Math.round(total5))}</b><small>دخل + نمو قيمة افتراضي</small></div><div className="metricFeatured"><span>القيمة بعد 5 سنوات</span><b>{money(Math.round(future))} ر.س</b><small>على فرض نمو سنوي {growth}%</small></div></section></div></>
}

export function FinanceLab(){
  const [price,setPrice]=useState(2000000),[down,setDown]=useState(20),[years,setYears]=useState(20),[rate,setRate]=useState(4.75),[income,setIncome]=useState(28000),[debt,setDebt]=useState(2500);
  const loan=price*(1-down/100), r=rate/100/12,n=years*12,pmt=r?loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):loan/n,burden=(pmt+debt)/income*100,afford=burden<45?'مرونة جيدة':burden<55?'يحتاج موازنة':'ضغط تمويلي مرتفع';
  const totalPaid=pmt*n+(price*down/100),financeCost=Math.max(0,totalPaid-price),maxPayment=Math.max(0,income*.45-debt),capacity=pmt?Math.min(100,maxPayment/pmt*100):100;
  return <div className="financeWorkspace"><section className="calculatorBox"><div className="toolHeader"><WalletCards/><div><span>SMART FINANCE</span><h2>محاكاة التمويل</h2></div></div><label>سعر العقار <b>{money(price)} ر.س</b><input type="range" min="500000" max="8000000" step="50000" value={price} onChange={e=>setPrice(+e.target.value)}/></label><div className="form2"><label>الدفعة الأولى %<input type="number" value={down} onChange={e=>setDown(+e.target.value)}/></label><label>مدة التمويل<select value={years} onChange={e=>setYears(+e.target.value)}><option value="10">10 سنوات</option><option value="15">15 سنة</option><option value="20">20 سنة</option><option value="25">25 سنة</option><option value="30">30 سنة</option></select></label></div><label>معدل سنوي افتراضي %<input type="number" step="0.05" value={rate} onChange={e=>setRate(+e.target.value)}/></label><div className="form2"><label>الدخل الشهري<input type="number" value={income} onChange={e=>setIncome(+e.target.value)}/></label><label>التزامات شهرية<input type="number" value={debt} onChange={e=>setDebt(+e.target.value)}/></label></div><div className="capacityMeter"><span><b>هامش القدرة</b><small>مقارنة القسط بسقف افتراضي 45% من الدخل بعد الالتزامات</small></span><div><i style={{width:`${capacity}%`}}/></div><strong>{capacity.toFixed(0)}%</strong></div></section><section className="financeSummary"><span>القسط الشهري التقديري</span><b>{money(Math.round(pmt))} ر.س</b><div className="financeFacts"><div><small>مبلغ التمويل</small><strong>{money(Math.round(loan))} ر.س</strong></div><div><small>نسبة العبء التقديرية</small><strong>{burden.toFixed(1)}%</strong></div><div><small>أقصى قسط مريح نموذجيًا</small><strong>{money(Math.round(maxPayment))} ر.س</strong></div><div><small>تكلفة تمويل تقريبية</small><strong>{money(Math.round(financeCost))} ر.س</strong></div><div><small>قراءة أولية</small><strong>{afford}</strong></div></div><p>هذه أداة توضيحية ولا تمثل عرضًا تمويليًا أو موافقة ائتمانية.</p></section></div>
}

export function AdvisorBooking({advisor}:{advisor:string}) {
  const [result,setResult]=useState<'saved'|'temporary'|null>(null);
  const save=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const request={id:Date.now(),advisor,name:data.get('name'),phone:data.get('phone'),date:data.get('date'),status:'draft',delivery:'local-only'};
    const saved=writeJSON('atheeldar-bookings',[request,...safe('atheeldar-bookings')].slice(0,20));
    setResult(saved.persisted?'saved':'temporary');
  };
  return <form className="advisorBook" onSubmit={save}>
    {result?<div className="successBox" role="status"><UserRoundCheck aria-hidden="true"/><b>حُفظت مسودة جلسة مع {advisor}</b><p>يمكن مراجعتها في مساحة العميل على هذا المتصفح. لم تُحجز جلسة فعلية ولم تُرسل إلى المستشار.</p>{result==='temporary'&&<p>{temporarySaveNotice}</p>}<a href="/account">مراجعة الطلب المحفوظ</a></div>:<>
      <p className="demoNotice">اختر موعدًا مقترحًا لمسودتك. هذه تجربة توضيحية تحفظ بياناتك في المتصفح فقط؛ استخدم بيانات تجريبية.</p>
      <label>الاسم<input name="name" required placeholder="اسم تجريبي" autoComplete="off"/></label>
      <label>الجوال<input name="phone" type="tel" inputMode="tel" required placeholder="رقم تجريبي" autoComplete="off"/></label>
      <label>اليوم المقترح<input name="date" type="date" required/></label>
      <button type="submit">حفظ طلب الجلسة</button>
    </>}
  </form>;
}

export function ClientSpace(){
  const [,setTick]=useState(0);
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState('');
  useEffect(()=>{
    const timer=window.setTimeout(()=>setReady(true),0);
    const unsubscribe=subscribeStoredIds(()=>setTick(value=>value+1));
    return()=>{window.clearTimeout(timer);unsubscribe()};
  },[]);
  const read=(key:string):any[]=>ready?safe(key):[];
  const records=(key:string)=>read(key).filter(value=>value&&typeof value==='object'&&!Array.isArray(value));
  const text=(value:unknown,fallback='')=>typeof value==='string'||typeof value==='number'?String(value):fallback;
  const ids=(key:string)=>ready?readStoredIds(key):[];
  const favs=properties.filter(property=>ids(STORAGE_KEYS.favorites).includes(property.slug));
  const recent=ids(STORAGE_KEYS.recent).map(slug=>properties.find(property=>property.slug===slug)).filter((property):property is Property=>Boolean(property));
  const watched=properties.filter(property=>ids('atheeldar-market-watch').includes(property.slug));
  const searches=records('atheeldar-saved-searches').filter(search=>typeof search.id==='number'||typeof search.id==='string');
  const bookings=records('atheeldar-bookings');
  const decisionPaths=records('atheeldar-decision-paths').filter(path=>properties.some(property=>property.slug===path.property));

  // Saved browser data is untrusted: only canonical relative property-search URLs may be reopened.
  const restoredSearch=(entry:any)=>{
    let params:URLSearchParams|undefined;
    if(typeof entry.url==='string'&&entry.url.startsWith('/')&&!entry.url.startsWith('//')&&!entry.url.includes('\\')){
      try{
        const url=new URL(entry.url,'https://atheeldar.invalid');
        if(url.origin==='https://atheeldar.invalid'&&(url.pathname==='/properties'||url.pathname==='/properties/'))params=url.searchParams;
      }catch{}
    }
    if(!params){
      params=new URLSearchParams();
      if(typeof entry.query==='string')params.set('q',entry.query);
      for(const key of ['city','type','purpose','max','beds','minArea','maxArea','quick','sort','view','residentialOnly']){
        const value=entry[key];
        if(typeof value==='string'||typeof value==='number'||typeof value==='boolean')params.set(key,String(value));
      }
    }
    const state=readPropertySearchParams(params);
    const query=writePropertySearchParams(state).toString();
    return{state,href:'/properties'+(query?'?'+query:'')};
  };
  const removeSearch=(id:number|string)=>{
    const result=writeJSON('atheeldar-saved-searches',searches.filter(search=>search.id!==id));
    setNotice(result.persisted?'حُذف البحث المحفوظ.':'حُذف البحث لهذه الزيارة فقط؛ التخزين الدائم غير متاح.');
  };

  if(!ready)return <p role="status">نستعيد مساحتك واختياراتك المحفوظة…</p>;
  return <>
    <div className="accountKpis"><div><Heart/><span><small>المفضلة</small><b>{favs.length}</b></span></div><div><Save/><span><small>بحوث محفوظة</small><b>{searches.length}</b></span></div><div><CalendarDays/><span><small>طلبات معاينة محفوظة</small><b>{bookings.length}</b></span></div><div><Eye/><span><small>شوهد مؤخرًا</small><b>{recent.length}</b></span></div></div>
    <p className="propertyStatus" role="status" aria-live="polite">{notice}</p>
    <div className="clientGrid">
      <section className="clientMain">
        <div className="clientIntro"><span>ATHEELDAR CLIENT SPACE</span><h2>مساحتك العقارية في مكان واحد</h2><p>المفضلة والبحث المحفوظ وسجل المشاهدة وطلبات المعاينة المحفوظة تعمل معًا لتكوين رحلة عميل متصلة.</p></div>
        <h3 id="favorites">العقارات المحفوظة</h3>
        {favs.length?<div className="savedList">{favs.map(property=><Link href={'/properties/'+property.slug} key={property.slug}><img src={property.image} alt={property.title} width={120} height={90} loading="lazy" decoding="async"/><span><b>{property.title}</b><small>{property.city} · {money(property.price)} ر.س{property.purpose==='للإيجار'?' سنويًا':''}</small></span></Link>)}</div>:<div className="emptyBox">لا توجد عقارات محفوظة بعد.</div>}
        <h3>شوهد مؤخرًا</h3>
        {recent.length?<div className="savedList recentList">{recent.slice(0,4).map(property=><Link href={'/properties/'+property.slug} key={property.slug}><img src={property.image} alt={property.title} width={120} height={90} loading="lazy" decoding="async"/><span><b>{property.title}</b><small>{property.city} · {property.type}</small></span></Link>)}</div>:<div className="emptyBox">افتح تفاصيل أي عقار وسيظهر هنا تلقائيًا.</div>}
        <h3>قائمة مراقبة السوق</h3>
        {watched.length?<div className="savedList watchList">{watched.map(property=><Link href={'/properties/'+property.slug} key={property.slug}><img src={property.image} alt={property.title} width={120} height={90} loading="lazy"/><span><b>{property.title}</b><small>{property.city} · {property.type}</small></span><Bookmark/></Link>)}</div>:<div className="emptyBox">أضف أصولًا من استوديو السوق لتظهر هنا.</div>}
        <h3>مسارات القرار المحفوظة</h3>
        {decisionPaths.length?<div className="simpleList decisionPathList">{decisionPaths.map((path,index)=><div key={text(path.id,String(index))}><Compass size={17}/><span>{text(path.goal)} · {text(path.city)}</span><small>{money(typeof path.budget==='number'?path.budget:0)} ر.س</small><Link href={'/properties/'+path.property}>فتح</Link></div>)}</div>:<div className="emptyBox">احفظ مسارًا من مركز القرار ليظهر هنا.</div>}
        <h3>عمليات البحث المحفوظة</h3>
        {searches.length?<div className="simpleList">{searches.map(entry=>{
          const {state,href}=restoredSearch(entry);
          const label=state.query||[state.city,state.type,state.purpose].filter(value=>value!=='الكل').join(' · ')||'جميع العقارات';
          return <div key={entry.id}><Save size={17}/><span>{label}</span><small>حتى {money(state.max)} ر.س{state.purpose==='للإيجار'?' سنويًا':''}</small><Link href={href} className="savedSearchOpen" aria-label={'استعادة البحث: '+label}>فتح النتائج</Link><button type="button" onClick={()=>removeSearch(entry.id)} aria-label={'حذف البحث: '+label}><Trash2/></button></div>;
        })}</div>:<div className="emptyBox">احفظ بحثًا من صفحة العقارات ليظهر هنا ويمكنك فتحه من جديد.</div>}
      </section>
      <aside className="clientAside"><h3>طلبات الجلسات والمعاينات</h3><p>مسودات محفوظة في هذا المتصفح؛ المواعيد المقترحة غير مؤكدة.</p>
        {bookings.length?<div className="bookingList">{bookings.map((booking,index)=><div key={text(booking.id,String(index))}><CalendarDays/><span><b>{text(booking.property)||text(booking.advisor)||'جلسة عقارية'}</b><small>{text(booking.date)} {text(booking.time)}</small></span></div>)}</div>:<p>لا توجد طلبات محفوظة بعد.</p>}
        <div className="clientTip"><Clock3/><span><b>تلميح ذكي</b><small>احفظ أكثر من عقار ثم استخدم المقارنة قبل إعداد طلب المعاينة.</small></span></div><Link href="/properties" className="primaryWide">استكشف العقارات</Link>
      </aside>
    </div>
  </>;
}
const seeded=[{id:'L-1024',name:'عبدالله القحطاني',goal:'فيلا شمال الرياض',status:'new',value:6800000},{id:'L-1021',name:'نورة السبيعي',goal:'استثمار شقة جدة',status:'contacted',value:2200000},{id:'L-1018',name:'محمد الزهراني',goal:'أرض تطوير',status:'viewing',value:3100000},{id:'L-1014',name:'هند المطيري',goal:'بنتهاوس الرياض',status:'negotiation',value:4500000}];
export function CRMBoard(){const [,setRefresh]=useState(0);const [ready,setReady]=useState(false);useEffect(()=>{const id=window.setTimeout(()=>setReady(true),0);const unsubscribe=subscribeStoredIds(()=>setRefresh(v=>v+1));return()=>{window.clearTimeout(id);unsubscribe()}},[]);const stored=ready?safe('atheeldar-leads'):[];const all=[...stored,...seeded];const statuses=[['new','جديد'],['contacted','تم التواصل'],['viewing','معاينة'],['negotiation','تفاوض']];const next=(id:string)=>{const arr=safe('atheeldar-leads');const x=arr.find((a:any)=>String(a.id)===String(id));if(x){x.status=x.status==='new'?'contacted':x.status==='contacted'?'viewing':'negotiation';writeJSON('atheeldar-leads',arr);setRefresh(v=>v+1)}};const newCount=all.filter((x:any)=>x.status==='new').length,viewCount=all.filter((x:any)=>x.status==='viewing').length,negCount=all.filter((x:any)=>x.status==='negotiation').length,conversion=all.length?Math.round(negCount/all.length*100):0;return <><p className="demoNotice">لوحة توضيحية محفوظة في هذا المتصفح. البطاقات الأولية بيانات تجريبية، وتغيير المرحلة لا يرسل رسائل أو ينفذ تواصلًا فعليًا.</p><div className="crmKpis"><div><span>Leads النشطة</span><b>{all.length}</b></div><div><span>قيمة الفرص النموذجية</span><b>{money(all.reduce((a:number,b:any)=>a+(b.value||0),0))}</b></div><div><span>في مرحلة المعاينة</span><b>{viewCount}</b></div><div><span>مؤشر التفاوض</span><b>{conversion}%</b></div></div><div className="crmPulse"><div><BarChart3/><span><small>نبض المسار</small><b>{newCount} جديد · {viewCount} معاينة · {negCount} تفاوض</b></span></div><div className="funnelLine"><i style={{width:`${Math.max(12,100-newCount*8)}%`}}/><i style={{width:`${Math.max(8,viewCount*22)}%`}}/><i style={{width:`${Math.max(5,negCount*24)}%`}}/></div><div><ShieldAlert/><span><small>أولوية المتابعة</small><b>{newCount>2?'يوجد عملاء يحتاجون اتصالًا':'المسار تحت السيطرة'}</b></span></div></div><div className="crmBoard">{statuses.map(([key,label])=><section key={key}><h3>{label}<span>{all.filter((x:any)=>x.status===key).length}</span></h3>{all.filter((x:any)=>x.status===key).map((l:any)=><article key={l.id}><small>{l.id}</small><b>{l.name}</b><p>{l.goal}</p>{l.value&&<span>{money(l.value)} ر.س</span>}{String(l.id).startsWith('L-')?null:<button onClick={()=>next(String(l.id))}>نقل للمرحلة التالية</button>}</article>)}</section>)}</div></>}

export function ContactLeadForm() {
  const [result,setResult]=useState<'saved'|'temporary'|null>(null);
  const save=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const request={id:'WEB-'+Date.now(),name:data.get('name'),phone:data.get('phone'),goal:data.get('goal'),channel:data.get('channel'),urgency:data.get('urgency'),details:data.get('details'),status:'new',delivery:'local-only',created:new Date().toISOString()};
    const saved=writeJSON('atheeldar-leads',[request,...safe('atheeldar-leads')].slice(0,50));
    setResult(saved.persisted?'saved':'temporary');
  };
  return <form className="contactLeadForm" onSubmit={save}>
    {result?<div className="successBox" role="status"><CheckCircle2 aria-hidden="true"/><b>حُفظ ملخص طلبك في هذا المتصفح</b><p>يمكن مراجعته في لوحة المتابعة التجريبية من المتصفح نفسه. لم يُرسل الطلب إلى مستشار أو إلى أي قناة تواصل.</p><a href="/dashboard">مراجعة المسودة في لوحة المتابعة</a>{result==='temporary'&&<p>{temporarySaveNotice}</p>}</div>:<>
      <p className="demoNotice">جهّز ملخص احتياجك واحفظه للمراجعة. النموذج توضيحي ولا يرسل رسائل أو طلبات فعلية؛ استخدم بيانات تجريبية.</p>
      <div className="form2"><label>الاسم<input name="name" required autoComplete="off"/></label><label>الجوال<input name="phone" type="tel" inputMode="tel" required autoComplete="off"/></label></div>
      <label>الهدف<select name="goal"><option>شراء عقار</option><option>استئجار عقار</option><option>استثمار عقاري</option><option>مشروع جديد</option><option>تسويق عقار</option><option>تمويل</option></select></label>
      <div className="form2"><label>قناة التواصل المفضلة<select name="channel"><option>اتصال هاتفي</option><option>واتساب</option><option>بريد إلكتروني</option></select></label><label>توقيت الاحتياج<select name="urgency"><option>خلال أسبوع</option><option>خلال شهر</option><option>خلال 3 أشهر</option><option>أستكشف فقط</option></select></label></div>
      <label>تفاصيل الطلب<textarea name="details" rows={5} placeholder="المدينة، نوع العقار، الميزانية أو أي تفاصيل مهمة..."/></label>
      <button type="submit" className="primaryWide">حفظ ملخص الطلب</button>
    </>}
  </form>;
}
