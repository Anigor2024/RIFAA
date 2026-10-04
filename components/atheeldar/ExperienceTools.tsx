'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, Compass, Sparkles, Target, WalletCards } from 'lucide-react';
import { advisors, neighborhoods, properties, money } from '@/lib/atheeldar-data';

export function HomeJourneyPlanner(){
  const [goal,setGoal]=useState('شراء');
  const [city,setCity]=useState('الرياض');
  const [budget,setBudget]=useState(5000000);
  const [priority,setPriority]=useState('السكن العائلي');
  const matches=useMemo(()=>properties
    .filter(p=>(city==='الكل'||p.city===city)&&(goal==='إيجار'?p.purpose==='للإيجار':p.purpose==='للبيع')&&p.price<=budget)
    .sort((a,b)=>b.score-a.score).slice(0,3),[goal,city,budget]);
  const query=`${goal==='إيجار'?'إيجار':'شراء'} ${city==='الكل'?'':city} أقل من ${(budget/1000000).toFixed(1)} مليون`;
  return <div className="journeyPlanner">
    <div className="journeyIntro"><span><Sparkles size={16}/> ATHEELDAR PATHFINDER</span><h2>حوّل رغبتك إلى <em>مسار قرار</em></h2><p>أدخل أربع إشارات فقط، وسنقترح لك نقطة البداية والعقارات الأقرب لطلبك داخل نموذج المنصة.</p></div>
    <div className="journeyControls">
      <label>هدفك<select value={goal} onChange={e=>setGoal(e.target.value)}><option>شراء</option><option>إيجار</option><option>استثمار</option></select></label>
      <label>المدينة<select value={city} onChange={e=>setCity(e.target.value)}><option>الرياض</option><option>جدة</option><option>الخبر</option><option>الدرعية</option><option>الكل</option></select></label>
      <label>السقف المالي<b>{money(budget)} ر.س</b><input type="range" min="500000" max="10000000" step="250000" value={budget} onChange={e=>setBudget(+e.target.value)}/></label>
      <label>الأولوية<select value={priority} onChange={e=>setPriority(e.target.value)}><option>السكن العائلي</option><option>العائد الاستثماري</option><option>الفخامة والخصوصية</option><option>القرب من الأعمال</option></select></label>
    </div>
    <div className="journeyResult"><div className="journeyResultHead"><div><small>المسار المقترح</small><b>{goal==='استثمار'?'ابدأ بمختبر الاستثمار ثم قارن الفرص':'ابدأ بالبحث الذكي ثم افتح ملفات الأحياء'}</b></div><Target/></div><div className="journeyMatches">{matches.length?matches.map(p=><Link key={p.slug} href={`/properties/${p.slug}`}><span>{p.score}</span><div><b>{p.title}</b><small>{p.city} · {p.district} · {money(p.price)} ر.س</small></div><ArrowLeft/></Link>):<p>وسّع الميزانية أو اختر مدينة أخرى لإظهار نتائج.</p>}</div><div className="journeyActions"><Link href={`/properties?q=${encodeURIComponent(query)}`} className="primaryWide">فتح النتائج الذكية <ArrowLeft/></Link>{goal==='استثمار'&&<Link href="/investment" className="secondaryWide">اختبر العائد <WalletCards size={17}/></Link>}</div><small className="modelNote">الأولوية المختارة: {priority}. المطابقة هنا توضيحية وتعتمد بيانات النموذج الحالية.</small></div>
  </div>
}

export function NeighborhoodCompare(){
  const [a,setA]=useState(neighborhoods[0].slug),[b,setB]=useState(neighborhoods[1].slug);
  const first=neighborhoods.find(n=>n.slug===a)!,second=neighborhoods.find(n=>n.slug===b)!;
  const row=(label:string,x:string|number,y:string|number)=><div className="compareRow"><b>{label}</b><span>{x}</span><span>{y}</span></div>;
  return <div className="neighborhoodCompare"><div className="compareChooser"><div><p className="eyebrow">مقارنة مباشرة</p><h2>ضع حيّين <em>جنبًا إلى جنب</em></h2><p>أداة سريعة لاختبار اختلاف نمط الحياة والطلب قبل الانتقال إلى العقار نفسه.</p></div><div className="compareSelects"><select value={a} onChange={e=>setA(e.target.value)}>{neighborhoods.map(n=><option key={n.slug} value={n.slug}>{n.name} · {n.city}</option>)}</select><span>VS</span><select value={b} onChange={e=>setB(e.target.value)}>{neighborhoods.map(n=><option key={n.slug} value={n.slug}>{n.name} · {n.city}</option>)}</select></div></div><div className="compareMatrix"><div className="compareRow head"><b>المؤشر</b><span>{first.name}</span><span>{second.name}</span></div>{row('تقييم أثيلدار',`${first.score}/100`,`${second.score}/100`)}{row('الطلب',first.demand,second.demand)}{row('قابلية المشي',first.walk,second.walk)}{row('ملاءمة العائلات',first.family,second.family)}{row('النطاق السعري',first.price,second.price)}</div><div className="compareFoot"><Link href={`/neighborhoods/${first.slug}`}>ملف {first.name} <ArrowLeft/></Link><Link href={`/neighborhoods/${second.slug}`}>ملف {second.name} <ArrowLeft/></Link></div></div>
}

export function ProjectPaymentPlanner({price}:{price:number}){
  const [booking,setBooking]=useState(5),[down,setDown]=useState(20),[construction,setConstruction]=useState(40);
  const bookingValue=price*booking/100,downValue=price*down/100,constructionValue=price*construction/100,handover=Math.max(0,price-bookingValue-downValue-constructionValue);
  return <div className="paymentPlanner"><div><span className="tinyLabel"><Building2 size={15}/> PAYMENT PLAN STUDIO</span><h2>شكّل سيناريو <em>دفعاتك</em></h2><p>حرّك النسب وشاهد توزيع قيمة الوحدة على مراحل نموذجية للمشروع.</p></div><div className="paymentControls"><label>الحجز {booking}%<input type="range" min="2" max="10" value={booking} onChange={e=>setBooking(+e.target.value)}/></label><label>الدفعة الأولى {down}%<input type="range" min="10" max="40" value={down} onChange={e=>setDown(+e.target.value)}/></label><label>أثناء الإنشاء {construction}%<input type="range" min="20" max="60" value={construction} onChange={e=>setConstruction(+e.target.value)}/></label></div><div className="paymentStages"><div><span>01</span><small>حجز</small><b>{money(Math.round(bookingValue))} ر.س</b></div><div><span>02</span><small>دفعة أولى</small><b>{money(Math.round(downValue))} ر.س</b></div><div><span>03</span><small>أثناء الإنشاء</small><b>{money(Math.round(constructionValue))} ر.س</b></div><div><span>04</span><small>عند التسليم</small><b>{money(Math.round(handover))} ر.س</b></div></div><p className="modelNote">محاكاة عرض فقط؛ خطط الدفع الفعلية يحددها المطور والعقد.</p></div>
}

export function AdvisorMatcher(){
  const [city,setCity]=useState('الرياض'),[goal,setGoal]=useState('سكن فاخر');
  const matched=advisors.find(a=>a.city===city && (goal==='استثمار'?a.focus.includes('عوائد')||a.role.includes('استثمار'):true)) || advisors.find(a=>a.city===city) || advisors[0];
  return <div className="advisorMatcher"><div><span><Compass size={16}/> SMART ADVISOR MATCH</span><h2>اختر المستشار <em>الأقرب لصفقتك</em></h2></div><div className="advisorMatcherControls"><select value={city} onChange={e=>setCity(e.target.value)}><option>الرياض</option><option>جدة</option><option>الخبر</option></select><select value={goal} onChange={e=>setGoal(e.target.value)}><option>سكن فاخر</option><option>استثمار</option><option>مشروع جديد</option></select></div><div className="advisorMatchCard"><img src={matched.image} alt={matched.name}/><div><small>الترشيح الأقرب</small><h3>{matched.name}</h3><p>{matched.role}</p><span>{matched.focus}</span></div><CheckCircle2/></div></div>
}
