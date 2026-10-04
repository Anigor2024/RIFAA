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
  useEffect(()=>{
    const read=()=>{try{setFavCount(JSON.parse(localStorage.getItem('atheeldar-favorites')||'[]').length)}catch{setFavCount(0)}};
    read(); window.addEventListener('storage',read); window.addEventListener('atheeldar:favorites',read as EventListener);
    return()=>{window.removeEventListener('storage',read);window.removeEventListener('atheeldar:favorites',read as EventListener)};
  },[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(v=>!v)}if(e.key==='Escape')setSearchOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  const results=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return [] as {type:string,title:string,meta:string,href:string}[];const ps=properties.filter(p=>`${p.title} ${p.city} ${p.district} ${p.type}`.toLowerCase().includes(q)).slice(0,4).map(p=>({type:'عقار',title:p.title,meta:`${p.city} · ${money(p.price)} ر.س`,href:`/properties/${p.slug}`}));const pr=projects.filter(p=>`${p.name} ${p.city} ${p.type}`.toLowerCase().includes(q)).slice(0,3).map(p=>({type:'مشروع',title:p.name,meta:`${p.city} · ${p.type}`,href:`/projects/${p.slug}`}));const ns=neighborhoods.filter(n=>`${n.name} ${n.city} ${n.label}`.toLowerCase().includes(q)).slice(0,3).map(n=>({type:'حي',title:n.name,meta:`${n.city} · ${n.score}/100`,href:`/neighborhoods/${n.slug}`}));return [...ps,...pr,...ns].slice(0,8)},[query]);
  return <>
    <header className="siteHeader">
      <div className="shell navBar">
        <Link href="/" className="brand" aria-label="أثيلدار الرئيسية">
          <span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span>
        </Link>
        <nav className="desktopNav">
          {nav.map(n=><Link key={n.href} href={n.href} className={pathname.startsWith(n.href)?'active':''}>{n.label}</Link>)}
          <Link href="/about" className={pathname==='/about'?'active':''}>عن أثيلدار</Link>
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
        <Link href="/about" onClick={()=>setOpen(false)}>عن أثيلدار</Link><Link href="/account" onClick={()=>setOpen(false)}>مساحة العميل</Link><Link href="/dashboard" onClick={()=>setOpen(false)}>بوابة المستشار</Link><Link href="/contact" onClick={()=>setOpen(false)}>تواصل معنا</Link>
      </div>}
    </header>
    {searchOpen&&<div className="commandOverlay" role="dialog" aria-modal="true"><button className="commandBackdrop" onClick={()=>setSearchOpen(false)} aria-label="إغلاق"/><section className="commandPalette"><div className="commandTop"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن عقار، مشروع، حي أو مدينة..."/><span><Command size={13}/> K</span><button onClick={()=>setSearchOpen(false)}><X/></button></div><div className="commandHint">بحث موحد في كامل المنصة · جرّب «حطين» أو «فيلا» أو «جدة»</div><div className="commandResults">{query&&!results.length&&<div className="commandEmpty">لا توجد نتيجة مباشرة. <Link href={`/properties?q=${encodeURIComponent(query)}`} onClick={()=>setSearchOpen(false)}>جرّب البحث الذكي <ArrowLeft/></Link></div>}{results.map(r=><Link key={`${r.type}-${r.href}`} href={r.href} onClick={()=>setSearchOpen(false)}><span className="commandType">{r.type==='عقار'?<Home/>:r.type==='مشروع'?<Building2/>:<MapPinned/>}</span><div><b>{r.title}</b><small>{r.meta}</small></div><ArrowLeft/></Link>)}</div>{!query&&<div className="commandShortcuts"><Link href="/properties" onClick={()=>setSearchOpen(false)}><Home/> كل العقارات</Link><Link href="/projects" onClick={()=>setSearchOpen(false)}><Building2/> المشاريع الجديدة</Link><Link href="/neighborhoods" onClick={()=>setSearchOpen(false)}><MapPinned/> دليل الأحياء</Link></div>}</section></div>}
  </>
}

export function Footer(){
  return <footer className="siteFooter"><div className="shell footerGrid">
    <div><Link href="/" className="brand footerBrand"><span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span></Link><p>منصة عقارية سعودية تجريبية متقدمة لعرض نموذج منتج متكامل للبحث والاستثمار وإدارة رحلة العميل.</p><div className="footerSignal"><span>بحث شامل</span><span>مقارنة</span><span>مختبرات قرار</span><span>CRM</span></div></div>
    <div><b>العقارات</b><Link href="/properties">كل العقارات</Link><Link href="/projects">المشاريع الجديدة</Link><Link href="/neighborhoods">دليل الأحياء</Link></div>
    <div><b>الأدوات</b><Link href="/investment">مختبر المستثمر</Link><Link href="/finance">التمويل العقاري</Link><Link href="/account">مساحة العميل</Link><Link href="/dashboard">بوابة المستشار</Link></div>
    <div><b>الشركة</b><Link href="/about">عن أثيلدار</Link><Link href="/advisors">المستشارون</Link><Link href="/contact">تواصل معنا</Link><span>الرياض · المملكة العربية السعودية</span></div>
  </div><div className="shell footerBottom"><span>© 2026 أثيلدار العقارية — نموذج أعمال تجريبي؛ البيانات المعروضة لأغراض المعاينة.</span><span>واجهة عربية · تجربة متعددة الصفحات</span></div></footer>
}

export function SiteShell({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}

export function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}){
  return <section className="pageHero"><div className="pageHeroGlow"/><div className="shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="pageHeroCopy">{copy}</p>{actions&&<div className="heroActions">{actions}</div>}</div></section>
}

export function Breadcrumbs({items}:{items:{label:string,href?:string}[]}){
  return <div className="breadcrumbs">{items.map((x,i)=><span key={x.label}>{i>0&&<ChevronDown size={13} className="crumbIcon"/>}{x.href?<Link href={x.href}>{x.label}</Link>:<b>{x.label}</b>}</span>)}</div>
}
