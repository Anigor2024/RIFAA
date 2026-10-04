'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Building2, Gem, MapPinned, Sparkles, TrendingUp } from 'lucide-react';
import { neighborhoods, properties, money } from '@/lib/atheeldar-data';

const cities=['الرياض','جدة','الدرعية','الخبر'] as const;
type City=typeof cities[number];

export function HomeImmersion(){
  const [city,setCity]=useState<City>('الرياض');
  const cityProperties=useMemo(()=>properties.filter(p=>p.city===city),[city]);
  const cityNeighborhoods=useMemo(()=>neighborhoods.filter(n=>n.city===city),[city]);
  const visual=cityNeighborhoods[0]?.image||cityProperties[0]?.image||neighborhoods[0].image;
  const avg=cityNeighborhoods.length?Math.round(cityNeighborhoods.reduce((s,n)=>s+n.score,0)/cityNeighborhoods.length):cityProperties.length?Math.round(cityProperties.reduce((s,p)=>s+p.score,0)/cityProperties.length):0;
  const from=cityProperties.length?Math.min(...cityProperties.map(p=>p.price)):0;
  const collections=[
    {tag:'SIGNATURE LIVING',title:'مختارات السكن الفاخر',copy:'فلل وبنتهاوس بهوية معمارية وتفاصيل ضيافة وخصوصية.',href:'/properties?q=فيلا فاخرة بالرياض',image:properties[0].image,icon:<Gem/>},
    {tag:'INVESTMENT LENS',title:'أصول بعين المستثمر',copy:'عقارات يظهر فيها العائد والسياق المكاني قبل اتخاذ القرار.',href:'/properties?q=استثمار',image:properties[4].image,icon:<TrendingUp/>},
    {tag:'NEW GENERATION',title:'الجيل الجديد من المشاريع',copy:'مشاريع حديثة بخطط دفع وتقدم إنشائي وصفحات مستقلة.',href:'/projects',image:properties[3].image,icon:<Building2/>},
  ];
  return <>
    <section className="editorialCollections"><div className="shell">
      <div className="sectionHead editorialHead"><div><p className="eyebrow">CURATED PATHS</p><h2>لا تبحث بالطريقة نفسها <em>في كل مرة</em></h2></div><p>مسارات تحريرية جاهزة تختصر على العميل نقطة البداية وتحوّل الاستكشاف إلى تجربة لها سياق.</p></div>
      <div className="collectionGrid">{collections.map((c,i)=><Link href={c.href} key={c.title} className={`collectionCard c${i+1}`}><img src={c.image} alt=""/><div className="collectionShade"/><div className="collectionTop"><span>{c.icon}{c.tag}</span><b>0{i+1}</b></div><div className="collectionBottom"><h3>{c.title}</h3><p>{c.copy}</p><strong>استكشف المسار <ArrowLeft/></strong></div></Link>)}</div>
    </div></section>
    <section className="cityAtlas"><div className="shell cityAtlasGrid">
      <div className="cityAtlasControl"><p className="eyebrow light">ATHEELDAR CITY ATLAS</p><h2>السوق يتغير عندما <em>يتغير المكان</em></h2><p>بدّل المدينة لترى صورة سريعة للمخزون والأحياء والمؤشرات داخل نموذج أثيلدار.</p><div className="cityTabs">{cities.map(c=><button key={c} className={city===c?'active':''} onClick={()=>setCity(c)}>{c}</button>)}</div><div className="cityMetrics"><div><span>العقارات</span><b>{cityProperties.length}</b></div><div><span>الأحياء</span><b>{cityNeighborhoods.length}</b></div><div><span>متوسط المؤشر</span><b>{avg||'—'}</b></div><div><span>يبدأ من</span><b>{from?money(from):'—'}</b><small>{from?'ر.س':''}</small></div></div><Link href={`/properties?q=${encodeURIComponent(city)}`} className="atlasCta">استكشف عقارات {city} <ArrowLeft/></Link></div>
      <div className="cityAtlasVisual"><img key={visual} src={visual} alt={city}/><div className="atlasShade"/><div className="atlasCompass"><MapPinned/><span><small>المدينة النشطة</small><b>{city}</b></span></div><div className="atlasDistricts">{cityNeighborhoods.slice(0,3).map(n=><Link key={n.slug} href={`/neighborhoods/${n.slug}`}><span>{n.score}</span><b>{n.name}</b><small>{n.label}</small></Link>)}{!cityNeighborhoods.length&&<div className="atlasEmpty">سيتم توسيع ملفات هذه المدينة في النسخ التالية.</div>}</div></div>
    </div></section>
    <section className="decisionRibbon shell"><div className="decisionRibbonHead"><Sparkles/><span><small>ATHEELDAR DECISION FLOW</small><b>رحلة واحدة، بدون قفزات عشوائية.</b></span></div><div className="decisionSteps"><Link href="/properties"><span>01</span><b>اكتشف</b><small>ابحث بطريقتك</small></Link><Link href="/neighborhoods"><span>02</span><b>افهم المكان</b><small>قارن الأحياء</small></Link><Link href="/finance"><span>03</span><b>اختبر الأرقام</b><small>تمويل وعائد</small></Link><Link href="/advisors"><span>04</span><b>تحرك بثقة</b><small>مستشار ومعاينة</small></Link></div></section>
  </>
}
