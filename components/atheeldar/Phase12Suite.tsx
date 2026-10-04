'use client';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Building2, Compass, Heart, Home, Layers3, MapPinned, Route, Scale, Sparkles, Target, TrendingUp, WalletCards } from 'lucide-react';
import { neighborhoods, projects, properties, money, type Property } from '@/lib/atheeldar-data';

type Intent='سكن'|'عائلة'|'استثمار'|'مشروع جديد';

const intentMeta:{
  [K in Intent]:{
    kicker:string;title:string;copy:string;icon:typeof Home;property:(p:Property)=>boolean;tool:string;toolLabel:string;district?:string
  }
}={
  'سكن':{kicker:'PRIMARY HOME',title:'سكن يناسب يومك، لا مجرد مواصفات.',copy:'نوازن بين جودة الأصل والموقع والمساحة والراحة اليومية ثم نوجّهك إلى الحي والعقار الأقرب.',icon:Home,property:p=>p.purpose==='للبيع'&&p.beds>=3,tool:'/lifestyle',toolLabel:'اختبر أسلوب حياتك'},
  'عائلة':{kicker:'FAMILY FIT',title:'قرار عائلي يبدأ من المكان.',copy:'المساحة وحدها لا تكفي؛ نضع الحي والخدمات والحركة اليومية والخصوصية داخل القرار.',icon:Compass,property:p=>p.beds>=4,tool:'/neighborhoods',toolLabel:'قارن الأحياء'},
  'استثمار':{kicker:'INVESTMENT LENS',title:'أصل مفهوم قبل أن يكون عائدًا.',copy:'اقرأ العائد وسعر المتر وجودة الأصل والسيولة في سياق واحد قبل الانتقال إلى قرار مالي.',icon:TrendingUp,property:p=>!!p.investment,tool:'/investment',toolLabel:'افتح مختبر المستثمر'},
  'مشروع جديد':{kicker:'NEW DEVELOPMENT',title:'اكتشف المشروع على مستوى الوحدة.',copy:'تقدم إنشائي، خطط دفع، وحدات، توقيت تسليم، ومسار اهتمام منظم بدل كتيب تسويقي ثابت.',icon:Building2,property:p=>!!p.newBuild,tool:'/projects',toolLabel:'استكشف المشاريع'},
};

function safeCount(key:string){if(typeof window==='undefined')return 0;try{return JSON.parse(localStorage.getItem(key)||'[]').length}catch{return 0}}

export function HomeIntentStudio(){
  const [intent,setIntent]=useState<Intent>('سكن');
  const meta=intentMeta[intent];
  const property=useMemo(()=>properties.find(meta.property)||properties[0],[intent]);
  const neighborhood=useMemo(()=>neighborhoods.find(n=>n.slug===property.neighborhoodSlug)||neighborhoods[0],[property]);
  const project=projects[0];
  const Icon=meta.icon;
  return <section className="intentStudioV12">
    <div className="intentStudioIntro">
      <span>ATHEELDAR INTENT STUDIO</span>
      <h2>ابدأ من <em>سبب البحث.</em></h2>
      <p>نفس السوق يبدو مختلفًا حسب الهدف. غيّر النية، وسيتغير أمامك الأصل والسياق والأداة التالية.</p>
      <div className="intentTabsV12">{(Object.keys(intentMeta) as Intent[]).map(x=>{const I=intentMeta[x].icon;return <button key={x} onClick={()=>setIntent(x)} className={intent===x?'active':''}><I/>{x}</button>})}</div>
    </div>
    <div className="intentFeatureV12">
      <img src={property.image} alt={property.title}/>
      <div className="intentShadeV12"/>
      <div className="intentFeatureTop"><span><Icon/>{meta.kicker}</span><b>{property.score}/100</b></div>
      <div className="intentFeatureCopy"><small>{property.city} · {property.district}</small><h3>{meta.title}</h3><p>{meta.copy}</p><strong>{property.title}</strong><b>{money(property.price)} ر.س</b><Link href={`/properties/${property.slug}`}>فتح الأصل المقترح <ArrowLeft/></Link></div>
    </div>
    <aside className="intentContextV12">
      <article><MapPinned/><span><small>السياق المكاني</small><b>{neighborhood.name}</b><p>{neighborhood.label}</p></span><Link href={`/neighborhoods/${neighborhood.slug}`}><ArrowLeft/></Link></article>
      <article><Layers3/><span><small>مشروع يستحق المتابعة</small><b>{project.name}</b><p>{project.progress}% تقدم نموذجي</p></span><Link href={`/projects/${project.slug}`}><ArrowLeft/></Link></article>
      <article className="intentNextTool"><Target/><span><small>الخطوة المقترحة</small><b>{meta.toolLabel}</b></span><Link href={meta.tool}><ArrowLeft/></Link></article>
    </aside>
  </section>
}

export function HomeMomentumStrip(){
  const [ready,setReady]=useState(false),[fav,setFav]=useState(0),[compare,setCompare]=useState(0),[plan,setPlan]=useState(0);
  useEffect(()=>{const read=()=>{setFav(safeCount('atheeldar-favorites'));setCompare(safeCount('atheeldar-compare'));setPlan(safeCount('atheeldar-viewing-plan'));setReady(true)};const id=window.setTimeout(read,0);window.addEventListener('atheeldar:favorites',read as EventListener);window.addEventListener('atheeldar:compare',read as EventListener);return()=>{window.clearTimeout(id);window.removeEventListener('atheeldar:favorites',read as EventListener);window.removeEventListener('atheeldar:compare',read as EventListener)}},[]);
  return <section className="homeMomentumV12">
    <div className="momentumLeadV12"><Sparkles/><span><small>YOUR ATHEELDAR MOMENTUM</small><b>{ready&&fav+compare+plan>0?'رحلتك مستمرة من حيث توقفت.':'ابدأ الآن، وسنحفظ سياق رحلتك.'}</b></span></div>
    <div className="momentumSignalsV12"><Link href="/account#favorites"><Heart/><span><small>المفضلة</small><b>{ready?fav:'—'}</b></span></Link><Link href="/compare"><Scale/><span><small>المقارنة</small><b>{ready?compare:'—'}</b></span></Link><Link href="/viewing-planner"><Route/><span><small>المعاينات</small><b>{ready?plan:'—'}</b></span></Link></div>
    <Link href="/shortlist" className="momentumCtaV12"><span><small>DECISION PACK</small><b>غرفة الـShortlist</b></span><ArrowLeft/></Link>
  </section>
}

export function SignatureProofGrid(){
  const cards=[
    {n:'01',icon:Compass,title:'ابدأ من النية',copy:'السكن والعائلة والاستثمار والمشروع الجديد لا يجب أن تبدأ بنفس الفلاتر.',href:'/lifestyle'},
    {n:'02',icon:Scale,title:'قارن في السياق',copy:'السعر والمساحة وسعر المتر والعائلة والاستثمار داخل شاشة واحدة.',href:'/compare'},
    {n:'03',icon:WalletCards,title:'اختبر الأرقام',copy:'القدرة الشرائية والقسط والعائد قبل أن يصبح الإعلان قرارًا.',href:'/finance'},
    {n:'04',icon:Route,title:'حوّل البحث إلى خطة',copy:'Shortlist، معاينات، ملاحظات وDecision Pack في رحلة متصلة.',href:'/shortlist'},
  ];
  return <section className="signatureProofV12">{cards.map(c=>{const Icon=c.icon;return <Link href={c.href} key={c.n}><span>{c.n}</span><Icon/><b>{c.title}</b><p>{c.copy}</p><strong>استكشف <ArrowLeft/></strong></Link>})}</section>
}
