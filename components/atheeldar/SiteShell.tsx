'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Heart, UserRound, ChevronDown, Search, Command, ArrowLeft, Building2, MapPinned, Home, LayoutDashboard, ShieldCheck } from 'lucide-react';
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
            <button className={['/about','/account','/dashboard','/market-studio','/decision-center','/decision-board','/compare','/shortlist','/trust','/lifestyle','/collections','/briefs','/alerts','/viewing-planner'].some(x=>pathname.startsWith(x))?'active':''}>اكتشف <ChevronDown size={13}/></button>
            <div className="discoverPanel megaExperience">
              <div className="discoverIntro"><span>ATHEELDAR EXPERIENCE</span><b>منصة قرار، لا قائمة إعلانات.</b><small>اختر نقطة البداية الأقرب لك ثم انتقل بين السوق والمكان والأرقام والخبرة البشرية بدون فقدان سياقك.</small></div>
              <div className="megaJourneyGrid">
                <div className="megaJourneyGroup"><span>01 · اكتشف</span><Link href="/lifestyle"><b>أسلوب الحياة</b><small>ابدأ من يومك واحتياجاتك</small></Link><Link href="/market-studio"><b>استوديو السوق</b><small>مدن، عدسات وفرص</small></Link><Link href="/collections"><b>المجموعات</b><small>مختارات تحريرية</small></Link></div>
                <div className="megaJourneyGroup"><span>02 · قرر</span><Link href="/decision-center"><b>مركز القرار</b><small>اربط العقار والحي والأرقام</small></Link><Link href="/decision-board"><b>لوحة القرار</b><small>رتب المحفوظات بأوزانك</small></Link><Link href="/compare"><b>مقارنة العقارات</b><small>حتى 3 أصول في سياق واحد</small></Link><Link href="/shortlist"><b>غرفة الـShortlist</b><small>Decision Pack من محفوظاتك</small></Link><Link href="/viewing-planner"><b>مخطط المعاينات</b><small>حوّل المفضلة إلى يوم منظم</small></Link></div>
                <div className="megaJourneyGroup"><span>03 · تحقق</span><Link href="/trust"><b>مركز الثقة</b><small>اعرف ما يحتاج تحققًا</small></Link><Link href="/briefs"><b>موجز أثيلدار</b><small>اقرأ قبل أن تقارن</small></Link><Link href="/alerts"><b>التنبيهات الذكية</b><small>احفظ شروط بحثك</small></Link></div>
              </div>
              <div className="megaExperienceBottom"><Link href="/properties/villa-al-sidr-hittin" className="discoverFeature"><span>اختيار أثيلدار</span><b>فيلا السِدر · حطين</b><small>تجربة عقار كاملة: قصة، ثقة، تمويل ومعاينة</small><ArrowLeft/></Link><div className="megaSignals"><span>بحث شامل ⌘K</span><span>مقارنة</span><span>تمويل</span><span>CRM</span></div></div>
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
        <Link href="/lifestyle" onClick={()=>setOpen(false)}>مكتشف أسلوب الحياة</Link><Link href="/collections" onClick={()=>setOpen(false)}>المجموعات</Link><Link href="/briefs" onClick={()=>setOpen(false)}>موجز أثيلدار</Link><Link href="/market-studio" onClick={()=>setOpen(false)}>استوديو السوق</Link><Link href="/decision-center" onClick={()=>setOpen(false)}>مركز القرار</Link><Link href="/alerts" onClick={()=>setOpen(false)}>التنبيهات الذكية</Link><Link href="/viewing-planner" onClick={()=>setOpen(false)}>مخطط المعاينات</Link><Link href="/compare" onClick={()=>setOpen(false)}>مقارنة العقارات</Link><Link href="/shortlist" onClick={()=>setOpen(false)}>غرفة الـShortlist</Link><Link href="/decision-board" onClick={()=>setOpen(false)}>لوحة القرار</Link><Link href="/trust" onClick={()=>setOpen(false)}>مركز الثقة</Link><Link href="/about" onClick={()=>setOpen(false)}>عن أثيلدار</Link><Link href="/account" onClick={()=>setOpen(false)}>مساحة العميل</Link><Link href="/dashboard" onClick={()=>setOpen(false)}>بوابة المستشار</Link><Link href="/contact" onClick={()=>setOpen(false)}>تواصل معنا</Link>
      </div>}
    </header>
    {searchOpen&&<div className="commandOverlay" role="dialog" aria-modal="true"><button className="commandBackdrop" onClick={()=>setSearchOpen(false)} aria-label="إغلاق"/><section className="commandPalette"><div className="commandTop"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن عقار، مشروع، حي أو مدينة..."/><span><Command size={13}/> K</span><button onClick={()=>setSearchOpen(false)}><X/></button></div><div className="commandHint">بحث موحد في كامل المنصة · جرّب «حطين» أو «فيلا» أو «جدة»</div><div className="commandResults">{query&&!results.length&&<div className="commandEmpty">لا توجد نتيجة مباشرة. <Link href={`/properties?q=${encodeURIComponent(query)}`} onClick={()=>setSearchOpen(false)}>جرّب البحث الذكي <ArrowLeft/></Link></div>}{results.map(r=><Link key={`${r.type}-${r.href}`} href={r.href} onClick={()=>setSearchOpen(false)}><span className="commandType">{r.type==='عقار'?<Home/>:r.type==='مشروع'?<Building2/>:<MapPinned/>}</span><div><b>{r.title}</b><small>{r.meta}</small></div><ArrowLeft/></Link>)}</div>{!query&&<div className="commandShortcuts"><Link href="/properties" onClick={()=>setSearchOpen(false)}><Home/> كل العقارات</Link><Link href="/lifestyle" onClick={()=>setSearchOpen(false)}><MapPinned/> مكتشف أسلوب الحياة</Link><Link href="/collections" onClick={()=>setSearchOpen(false)}><Building2/> المجموعات</Link><Link href="/briefs" onClick={()=>setSearchOpen(false)}><Search/> موجز أثيلدار</Link></div>}</section></div>}
  </>
}

export function Footer(){
  return <footer className="siteFooter"><div className="shell footerGrid">
    <div><Link href="/" className="brand footerBrand"><span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span></Link><p>منصة عقارية سعودية تجريبية متقدمة لعرض نموذج منتج متكامل للبحث والاستثمار وإدارة رحلة العميل.</p><div className="footerSignal"><span>بحث شامل</span><span>مقارنة</span><span>مختبرات قرار</span><span>CRM</span></div></div>
    <div><b>العقارات</b><Link href="/properties">كل العقارات</Link><Link href="/projects">المشاريع الجديدة</Link><Link href="/neighborhoods">دليل الأحياء</Link></div>
    <div><b>الأدوات</b><Link href="/lifestyle">مكتشف أسلوب الحياة</Link><Link href="/compare">مقارنة العقارات</Link><Link href="/shortlist">غرفة الـShortlist</Link><Link href="/decision-board">لوحة القرار</Link><Link href="/market-studio">استوديو السوق</Link><Link href="/decision-center">مركز القرار</Link><Link href="/alerts">التنبيهات الذكية</Link><Link href="/viewing-planner">مخطط المعاينات</Link></div>
    <div><b>استكشف</b><Link href="/collections">المجموعات</Link><Link href="/briefs">موجز أثيلدار</Link><Link href="/trust">مركز الثقة</Link><Link href="/about">عن أثيلدار</Link><Link href="/advisors">المستشارون</Link><Link href="/contact">تواصل معنا</Link></div>
  </div><div className="shell footerBottom"><span>© 2026 أثيلدار العقارية — نموذج أعمال تجريبي؛ البيانات المعروضة لأغراض المعاينة.</span><span>واجهة عربية · تجربة متعددة الصفحات</span></div></footer>
}

export function SiteShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const [concierge,setConcierge]=useState(false);
  return <><Header/><main><div key={pathname} className="routeStage">{children}</div></main>
    <div className={`conciergeDock ${concierge?'open':''}`}>
      {concierge&&<div className="conciergePanel"><div className="conciergeHead"><span>ATHEELDAR CONCIERGE</span><button onClick={()=>setConcierge(false)} aria-label="إغلاق"><X/></button></div><h3>ما الخطوة التالية؟</h3><p>اختصر الطريق إلى أهم المسارات حسب قرارك الحالي.</p><div className="conciergeLinks"><Link href="/properties" onClick={()=>setConcierge(false)}><Search/><span><b>ابحث عن عقار</b><small>بحث ذكي وفلاتر ومقارنة</small></span><ArrowLeft/></Link><Link href="/advisors" onClick={()=>setConcierge(false)}><UserRound/><span><b>طابق مستشارًا</b><small>حسب المدينة ونوع القرار</small></span><ArrowLeft/></Link><Link href="/finance" onClick={()=>setConcierge(false)}><Building2/><span><b>اختبر ميزانيتك</b><small>تمويل وقدرة شرائية</small></span><ArrowLeft/></Link><Link href="/lifestyle" onClick={()=>setConcierge(false)}><MapPinned/><span><b>ابدأ من أسلوب حياتك</b><small>هدوء، عائلة، بحر أو مدينة</small></span><ArrowLeft/></Link><Link href="/compare" onClick={()=>setConcierge(false)}><LayoutDashboard/><span><b>قارن الأصول</b><small>السعر، السياق، العائلة والاستثمار</small></span><ArrowLeft/></Link><Link href="/shortlist" onClick={()=>setConcierge(false)}><LayoutDashboard/><span><b>جهّز Shortlist</b><small>حزمة قرار قابلة للطباعة</small></span><ArrowLeft/></Link><Link href="/decision-board" onClick={()=>setConcierge(false)}><LayoutDashboard/><span><b>رتّب خياراتك</b><small>لوحة قرار مرجّحة ومحفوظة</small></span><ArrowLeft/></Link><Link href="/trust" onClick={()=>setConcierge(false)}><ShieldCheck/><span><b>راجع الثقة</b><small>ما المتاح وما يحتاج تحققًا</small></span><ArrowLeft/></Link></div></div>}
      <button className="conciergeTrigger" onClick={()=>setConcierge(v=>!v)} aria-label="كونسيرج أثيلدار"><span>أ</span><b>اسأل أثيلدار</b></button>
    </div>
    <nav className="mobileBottomDock" aria-label="تنقل سريع"><Link href="/" className={pathname==='/'?'active':''}><Home/><span>الرئيسية</span></Link><Link href="/properties" className={pathname.startsWith('/properties')?'active':''}><Search/><span>العقارات</span></Link><Link href="/decision-board" className={pathname.startsWith('/decision-board')?'active':''}><LayoutDashboard/><span>القرار</span></Link><Link href="/account" className={pathname.startsWith('/account')?'active':''}><UserRound/><span>حسابي</span></Link></nav>
    <Footer/></>
}

type HeroStat={label:string,value:string,note?:string};
export function PageHero({eyebrow,title,copy,actions,variant='default',image,rail,panel,stats=[],highlights=[]}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode,variant?:string,image?:string,rail?:React.ReactNode,panel?:React.ReactNode,stats?:HeroStat[],highlights?:string[]}){
  return <section className={`pageHero signaturePageHero signaturePageHero--${variant}`}>
    {image&&<div className="signatureHeroMedia" aria-hidden="true"><img src={image} alt=""/></div>}
    <div className="signatureHeroOverlay" aria-hidden="true"/>
    <div className={`shell signatureHeroShell ${rail?'hasRail':''}`}>
      {rail&&<aside className="signatureHeroRail">{rail}</aside>}
      <div className="signatureHeroMain">
        <div className="signatureHeroTop"><p className="eyebrow">{eyebrow}</p>{highlights.length>0&&<div className="signatureHeroHighlights">{highlights.map(x=><span key={x}>{x}</span>)}</div>}</div>
        <div className={`signatureHeroEditorial ${panel?'hasPanel':''}`}><div className="signatureHeroCopy"><h1>{title}</h1><p className="pageHeroCopy">{copy}</p>{actions&&<div className="heroActions">{actions}</div>}</div>{panel&&<div className="signatureHeroPanel">{panel}</div>}</div>
        {stats.length>0&&<div className="signatureHeroStats">{stats.map(x=><article key={x.label}><small>{x.label}</small><b>{x.value}</b>{x.note&&<span>{x.note}</span>}</article>)}</div>}
      </div>
    </div>
  </section>
}

export function Breadcrumbs({items}:{items:{label:string,href?:string}[]}){
  return <div className="breadcrumbs">{items.map((x,i)=><span key={x.label}>{i>0&&<ChevronDown size={13} className="crumbIcon"/>}{x.href?<Link href={x.href}>{x.label}</Link>:<b>{x.label}</b>}</span>)}</div>
}
