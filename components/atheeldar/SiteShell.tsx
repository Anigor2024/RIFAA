'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Heart, UserRound, ChevronDown } from 'lucide-react';

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
  const [favCount,setFavCount]=useState(0);
  useEffect(()=>{
    const read=()=>{try{setFavCount(JSON.parse(localStorage.getItem('atheeldar-favorites')||'[]').length)}catch{setFavCount(0)}};
    read(); window.addEventListener('storage',read); window.addEventListener('atheeldar:favorites',read as EventListener);
    return()=>{window.removeEventListener('storage',read);window.removeEventListener('atheeldar:favorites',read as EventListener)};
  },[]);
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
          <Link href="/account" className="navIcon" aria-label="الحساب"><UserRound size={20}/></Link>
          <Link href="/account#favorites" className="navIcon heartIcon" aria-label="المفضلة"><Heart size={20}/>{favCount>0&&<span>{favCount}</span>}</Link>
          <Link href="/contact" className="navCta">تحدث مع مستشار</Link>
          <button className="menuButton" onClick={()=>setOpen(v=>!v)} aria-label="القائمة">{open?<X/>:<Menu/>}</button>
        </div>
      </div>
      {open&&<div className="mobileNav shell">
        {nav.map(n=><Link key={n.href} href={n.href} onClick={()=>setOpen(false)}>{n.label}</Link>)}
        <Link href="/about" onClick={()=>setOpen(false)}>عن أثيلدار</Link><Link href="/account" onClick={()=>setOpen(false)}>مساحة العميل</Link><Link href="/dashboard" onClick={()=>setOpen(false)}>بوابة المستشار</Link><Link href="/contact" onClick={()=>setOpen(false)}>تواصل معنا</Link>
      </div>}
    </header>
  </>
}

export function Footer(){
  return <footer className="siteFooter"><div className="shell footerGrid">
    <div><Link href="/" className="brand footerBrand"><span className="brandMark">أ</span><span className="brandWords"><b>أثيلدار</b><small>ATHEELDAR REAL ESTATE</small></span></Link><p>منصة عقارية سعودية تجريبية متقدمة لعرض نموذج منتج متكامل للبحث والاستثمار وإدارة رحلة العميل.</p></div>
    <div><b>العقارات</b><Link href="/properties">كل العقارات</Link><Link href="/projects">المشاريع الجديدة</Link><Link href="/neighborhoods">دليل الأحياء</Link></div>
    <div><b>الأدوات</b><Link href="/investment">مختبر المستثمر</Link><Link href="/finance">التمويل العقاري</Link><Link href="/account">مساحة العميل</Link><Link href="/dashboard">بوابة المستشار</Link></div>
    <div><b>الشركة</b><Link href="/about">عن أثيلدار</Link><Link href="/advisors">المستشارون</Link><Link href="/contact">تواصل معنا</Link><span>الرياض · المملكة العربية السعودية</span></div>
  </div><div className="shell footerBottom"><span>© 2026 أثيلدار العقارية — نموذج أعمال تجريبي؛ البيانات المعروضة لأغراض المعاينة.</span><span>واجهة عربية · تجربة متعددة الصفحات</span></div></footer>
}

export function SiteShell({children}:{children:React.ReactNode}){return <><Header/><main>{children}</main><Footer/></>}

export function PageHero({eyebrow,title,copy,actions}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode}){
  return <section className="pageHero"><div className="shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="pageHeroCopy">{copy}</p>{actions&&<div className="heroActions">{actions}</div>}</div></section>
}

export function Breadcrumbs({items}:{items:{label:string,href?:string}[]}){
  return <div className="breadcrumbs">{items.map((x,i)=><span key={x.label}>{i>0&&<ChevronDown size={13} className="crumbIcon"/>}{x.href?<Link href={x.href}>{x.label}</Link>:<b>{x.label}</b>}</span>)}</div>
}
