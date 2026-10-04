'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Heart, UserRound, ChevronDown, Search, Command, ArrowLeft, Building2, MapPinned, Home } from 'lucide-react';
import { neighborhoods, projects, properties, money } from '@/lib/atheeldar-data';

const nav = [
  {href:'/properties',label:'العقارات'},
  {href:'/projects',label:'المشاريع'},
  {href:'/neighborhoods',label:'الأحياء'},
  {href:'/investment',label:'الاستثمار'},
  {href:'/finance',label:'التمويل'},
  {href:'/advisors',label:'المستشارون'},
];

export function Header(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [favCount,setFavCount]=useState(0);
  const [scrollProgress,setScrollProgress]=useState(0);
  useEffect(()=>{
    const read=()=>{try{setFavCount(JSON.parse(localStorage.getItem('atheeldar-favorites')||'[]').length)}catch{setFavCount(0)}};
    read(); window.addEventListener('storage',read); window.addEventListener('atheeldar:favorites',read as EventListener);
    return()=>{window.removeEventListener('storage',read);window.removeEventListener('atheeldar:favorites',read as EventListener)};
  },[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(v=>!v)}if(e.key==='Escape')setSearchOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  useEffect(()=>{const read=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setScrollProgress(max>0?Math.min(100,(window.scrollY/max)*100):0)};read();window.addEventListener('scroll',read,{passive:true});window.addEventListener('resize',read);return()=>{window.removeEventListener('scroll',read);window.removeEventListener('resize',read)}},[]);
  const results=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return [] as {type:string,title:string,meta:string,href:string}[];const ps=properties.filter(p=>`${p.title} ${p.city} ${p.district} ${p.type}`.toLowerCase().includes(q)).slice(0,4).map(p=>({type:'عقار',title:p.title,meta:`${p.city} · ${money(p.price)} ر.س`,href:`/properties/${p.slug}`}));const pr=projects.filter(p=>`${p.name} ${p.city} ${p.type}`.toLowerCase().includes(q)).slice(0,3).map(p=>({type:'مشروع',title:p.name,meta:`${p.city} · ${p.type}`,href:`/projects/${p.slug}`}));const ns=neighborhoods.filter(n=>`${n.name} ${n.city} ${n.label}`.toLowerCase().includes(q)).slice(0,3).map(n=>({type:'حي',title:n.name,meta:`${n.city} · ${n.score}/100`,href:`/neighborhoods/${n.slug}`}));return [...ps,...pr,...ns].slice(0,8)},[query]);
  return <>
    <header className="siteHeader">
      <div className="scrollProgress" aria-hidden="true"><i style={{width:`${scrollProgress}%`}}/></div>
      <div className="shell navBar">
        <Link href="/" className="brand" aria-label="أثيلدار الرئيسية">
          <span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span>
        </Link>
        <nav className="desktopNav">
          {nav.map(n=><Link key={n.href} href={n.href} className={pathname.startsWith(n.href)?'active':''}>{n.label}</Link>)}
          <div className="discoverNav">
            <button className={['/about','/account','/dashboard','/market-studio','/decision-center','/lifestyle','/collections','/briefs','/alerts','/viewing-planner'].some(x=>pathname.startsWith(x))?'active':''}>اكتشف <ChevronDown size={13}/></button>
            <div className="discoverPanel">
              <div className="discoverIntro"><span>ATHEELDAR EXPERIENCE</span><b>كل ما تحتاجه لاتخاذ قرار عقاري أوضح.</b><small>تنقّل بين السوق، المكان، الأرقام والخبرة البشرية بدون أن تضيع رحلتك.</small></div>
              <div className="discoverLinks">
                <Link href="/lifestyle"><span>01</span><b>مكتشف أسلوب الحياة</b><small>ابدأ من يومك لا من الفلتر</small></Link>
                <Link href="/market-studio"><span>02</span><b>استوديو السوق</b><small>عدسات، مدن ومصفوفة فرص</small></Link>
                <Link href="/decision-center"><span>03</span><b>مركز القرار</b><small>اربط الأصل بالمكان والأرقام</small></Link>
                <Link href="/collections"><span>04</span><b>المجموعات</b><small>مسارات تحريرية منتقاة</small></Link>
                <Link href="/briefs"><span>05</span><b>موجز أثيلدار</b><small>محتوى معرفي قبل القرار</small></Link>
              </div>
              <Link href="/properties/villa-al-sidr-hittin" className="discoverFeature"><span>اختيار أثيلدار</span><b>فيلا السِدر · حطين</b><small>صفحة عقار كاملة مع قرار وتمويل ومعاينة</small><ArrowLeft/></Link>
            </div>
          </div>
        </nav>
        <div className="navActions">
          <button className="navIcon commandButton" onClick={()=>setSearchOpen(true)} aria-label="البحث الشامل"><Search size={19}/><small>⌘K</small></button>
          <Link href="/account" className="navIcon accountIcon" aria-label="الحساب"><UserRound size={20}/></Link>
          <Link href="/account#favorites" className="navIcon heartIcon" aria-label="المفضلة"><Heart size={20}/>{favCount>0&&<span>{favCount}</span>}</Link>
          <Link href="/contact" className="navCta">تحدث مع مستشار</Link>
          <button className="menuButton" onClick={()=>setOpen(v=>!v)} aria-label="القائمة">{open?<X/>:<Menu/>}</button>
        </div>
      </div>
      {open&&<div className="mobileNav shell">
        <button className="mobileSearchTrigger" onClick={()=>{setOpen(false);setSearchOpen(true)}}><Search size={17}/> بحث شامل في أثيلدار</button>
        {nav.map(n=><Link key={n.href} href={n.href} onClick={()=>setOpen(false)}>{n.label}</Link>)}
        <Link href="/lifestyle" onClick={()=>setOpen(false)}>مكتشف أسلوب الحياة</Link><Link href="/collections" onClick={()=>setOpen(false)}>المجموعات</Link><Link href="/briefs" onClick={()=>setOpen(false)}>موجز أثيلدار</Link><Link href="/market-studio" onClick={()=>setOpen(false)}>استوديو السوق</Link><Link href="/decision-center" onClick={()=>setOpen(false)}>مركز القرار</Link><Link href="/alerts" onClick={()=>setOpen(false)}>التنبيهات الذكية</Link><Link href="/viewing-planner" onClick={()=>setOpen(false)}>مخطط المعاينات</Link><Link href="/about" onClick={()=>setOpen(false)}>عن أثيلدار</Link><Link href="/account" onClick={()=>setOpen(false)}>مساحة العميل</Link><Link href="/dashboard" onClick={()=>setOpen(false)}>بوابة المستشار</Link><Link href="/contact" onClick={()=>setOpen(false)}>تواصل معنا</Link>
      </div>}
    </header>
    {searchOpen&&<div className="commandOverlay" role="dialog" aria-modal="true"><button className="commandBackdrop" onClick={()=>setSearchOpen(false)} aria-label="إغلاق"/><section className="commandPalette"><div className="commandTop"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن عقار، مشروع، حي أو مدينة..."/><span><Command size={13}/> K</span><button onClick={()=>setSearchOpen(false)}><X/></button></div><div className="commandHint">بحث موحد في كامل المنصة · جرّب «حطين» أو «فيلا» أو «جدة»</div><div className="commandResults">{query&&!results.length&&<div className="commandEmpty">لا توجد نتيجة مباشرة. <Link href={`/properties?q=${encodeURIComponent(query)}`} onClick={()=>setSearchOpen(false)}>جرّب البحث الذكي <ArrowLeft/></Link></div>}{results.map(r=><Link key={`${r.type}-${r.href}`} href={r.href} onClick={()=>setSearchOpen(false)}><span className="commandType">{r.type==='عقار'?<Home/>:r.type==='مشروع'?<Building2/>:<MapPinned/>}</span><div><b>{r.title}</b><small>{r.meta}</small></div><ArrowLeft/></Link>)}</div>{!query&&<div className="commandShortcuts"><Link href="/properties" onClick={()=>setSearchOpen(false)}><Home/> كل العقارات</Link><Link href="/lifestyle" onClick={()=>setSearchOpen(false)}><MapPinned/> مكتشف أسلوب الحياة</Link><Link href="/collections" onClick={()=>setSearchOpen(false)}><Building2/> المجموعات</Link><Link href="/briefs" onClick={()=>setSearchOpen(false)}><Search/> موجز أثيلدار</Link></div>}</section></div>}
  </>
}

export function Footer(){
  return <footer className="siteFooter"><div className="shell footerGrid">
    <div><Link href="/" className="brand footerBrand"><span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span></Link><p>منصة عقارية سعودية تجريبية متقدمة لعرض نموذج منتج متكامل للبحث والاستثمار وإدارة رحلة العميل.</p><div className="footerSignal"><span>بحث شامل</span><span>مقارنة</span><span>مختبرات قرار</span><span>CRM</span></div></div>
    <div><b>العقارات</b><Link href="/properties">كل العقارات</Link><Link href="/projects">المشاريع الجديدة</Link><Link href="/neighborhoods">دليل الأحياء</Link></div>
    <div><b>الأدوات</b><Link href="/lifestyle">مكتشف أسلوب الحياة</Link><Link href="/market-studio">استوديو السوق</Link><Link href="/decision-center">مركز القرار</Link><Link href="/alerts">التنبيهات الذكية</Link><Link href="/viewing-planner">مخطط المعاينات</Link></div>
    <div><b>استكشف</b><Link href="/collections">المجموعات</Link><Link href="/briefs">موجز أثيلدار</Link><Link href="/about">عن أثيلدار</Link><Link href="/advisors">المستشارون</Link><Link href="/contact">تواصل معنا</Link></div>
  </div><div className="shell footerBottom"><span>© 2026 أثيلدار العقارية — نموذج أعمال تجريبي؛ البيانات المعروضة لأغراض المعاينة.</span><span>واجهة عربية · تجربة متعددة الصفحات</span></div></footer>
}

export function SiteShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const [concierge,setConcierge]=useState(false);
  return <><Header/><main><div key={pathname} className="routeStage">{children}</div></main>
    <div className={`conciergeDock ${concierge?'open':''}`}>
      {concierge&&<div className="conciergePanel"><div className="conciergeHead"><span>ATHEELDAR CONCIERGE</span><button onClick={()=>setConcierge(false)} aria-label="إغلاق"><X/></button></div><h3>ما الخطوة التالية؟</h3><p>اختصر الطريق إلى أهم المسارات حسب قرارك الحالي.</p><div className="conciergeLinks"><Link href="/properties" onClick={()=>setConcierge(false)}><Search/><span><b>ابحث عن عقار</b><small>بحث ذكي وفلاتر ومقارنة</small></span><ArrowLeft/></Link><Link href="/advisors" onClick={()=>setConcierge(false)}><UserRound/><span><b>طابق مستشارًا</b><small>حسب المدينة ونوع القرار</small></span><ArrowLeft/></Link><Link href="/finance" onClick={()=>setConcierge(false)}><Building2/><span><b>اختبر ميزانيتك</b><small>تمويل وقدرة شرائية</small></span><ArrowLeft/></Link><Link href="/lifestyle" onClick={()=>setConcierge(false)}><MapPinned/><span><b>ابدأ من أسلوب حياتك</b><small>هدوء، عائلة، بحر أو مدينة</small></span><ArrowLeft/></Link></div></div>}
      <button className="conciergeTrigger" onClick={()=>setConcierge(v=>!v)} aria-label="كونسيرج أثيلدار"><span>أ</span><b>اسأل أثيلدار</b></button>
    </div>
    <Footer/></>
}

export function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}){
  return <section className="pageHero"><div className="pageHeroGlow"/><div className="pageHeroLine"/><div className="shell pageHeroFrame"><div className="pageHeroMain"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="pageHeroCopy">{copy}</p>{actions&&<div className="heroActions">{actions}</div>}</div><div className="pageHeroSignature" aria-hidden="true"><span>ATHEELDAR</span><b>REAL ESTATE PLATFORM</b><i/><small>بحث · تحليل · قرار</small></div></div></section>
}

export function Breadcrumbs({items}:{items:{label:string,href?:string}[]}){
  return <div className="breadcrumbs">{items.map((x,i)=><span key={x.label}>{i>0&&<ChevronDown size={13} className="crumbIcon"/>}{x.href?<Link href={x.href}>{x.label}</Link>:<b>{x.label}</b>}</span>)}</div>
}
