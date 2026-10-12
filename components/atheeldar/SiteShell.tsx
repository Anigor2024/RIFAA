'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowUp,ChevronLeft,Heart,Home,LayoutGrid,Menu,Search,X} from 'lucide-react';
import {neighborhoods,projects,properties,money} from '@/lib/atheeldar-data';
import {decisionTools} from '@/lib/decision-tools';
import {readStoredIds,STORAGE_KEYS,subscribeStoredIds} from '@/lib/browser-storage';
import {useOverlay} from '@/hooks/use-overlay';

const navigation=[{href:'/properties',label:'العقارات'},{href:'/projects',label:'المشاريع'},{href:'/neighborhoods',label:'الأحياء'},{href:'/tools',label:'أدوات القرار'}];
const normalize=(value:string)=>value.toLowerCase().replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F\u0670]/g,'').replace(/ى/g,'ي');
function Brand({footer=false}:{footer?:boolean}){
  return <Link href="/" className={`at-brand ${footer?'at-brand-footer':''}`} aria-label="أثيلدار — الرئيسية"><span className="at-brand-mark" aria-hidden="true">أ</span><span><b>أثيلدار</b><small>ATHEELDAR</small></span></Link>;
}
export function Header(){
  const pathname=usePathname();
  const [menuOpen,setMenuOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [favCount,setFavCount]=useState(0);
  const searchRef=useOverlay<HTMLElement>(searchOpen,()=>setSearchOpen(false));
  const menuRef=useOverlay<HTMLElement>(menuOpen,()=>setMenuOpen(false));
  useEffect(()=>{const read=()=>setFavCount(readStoredIds(STORAGE_KEYS.favorites).filter(slug=>properties.some(p=>p.slug===slug)).length);read();return subscribeStoredIds(read)},[]);
  useEffect(()=>{const key=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setMenuOpen(false);setSearchOpen(value=>!value)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  const results=useMemo(()=>{
    const q=normalize(query.trim());if(!q)return [];
    const candidates=[
      ...properties.map(p=>({title:p.title,meta:`${p.city} · ${p.district} · ${p.type} · ${money(p.price)} ر.س${p.purpose==='للإيجار'?' سنويًا':''}`,href:`/properties/${p.slug}`,category:'عقار'})),
      ...projects.map(p=>({title:p.name,meta:`${p.city} · مشروع سكني`,href:`/projects/${p.slug}`,category:'مشروع'})),
      ...neighborhoods.map(p=>({title:p.name,meta:p.city,href:`/neighborhoods/${p.slug}`,category:'حي'})),
      ...decisionTools.map(t=>({title:t.title,meta:t.description,href:t.href,category:'أداة'})),
    ];return candidates.filter(item=>q.split(/\s+/).every(word=>normalize(`${item.title} ${item.meta}`).includes(word))).slice(0,7);
  },[query]);
  return <>
    <a className="at-skip" href="#main-content">انتقل إلى المحتوى</a>
    <header className="at-header"><div className="shell at-nav"><Brand/>
      <nav className="at-desktop-nav" aria-label="التنقل الرئيسي">{navigation.map(item=><Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href)?'page':undefined}>{item.label}</Link>)}</nav>
      <div className="at-nav-actions"><button className="at-icon" onClick={()=>setSearchOpen(true)} aria-label="البحث في أثيلدار" title="البحث — Ctrl+K"><Search size={21}/></button><Link className="at-icon at-nav-heart" href="/account#favorites" aria-label={`المفضلة${favCount?`، ${favCount} عقارات`:''}`}><Heart size={21}/>{favCount>0&&<span>{favCount}</span>}</Link><Link className="at-button at-nav-start" href="/home-finder">ابدأ رحلتك<ArrowLeft size={17}/></Link><button className="at-icon at-menu-button" onClick={()=>setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="at-mobile-menu" aria-label="فتح القائمة"><Menu size={24}/></button></div>
    </div></header>
    {menuOpen&&<div className="at-overlay"><button className="at-backdrop" aria-label="إغلاق القائمة" onClick={()=>setMenuOpen(false)}/><nav ref={menuRef} id="at-mobile-menu" className="at-mobile-menu" role="dialog" aria-modal="true" aria-labelledby="at-menu-title" tabIndex={-1}><div className="at-modal-heading"><b id="at-menu-title">أهلًا بك في أثيلدار</b><button className="at-icon" onClick={()=>setMenuOpen(false)} aria-label="إغلاق القائمة"><X/></button></div>{navigation.map(item=><Link href={item.href} key={item.href} onClick={()=>setMenuOpen(false)}>{item.label}<ArrowLeft size={19}/></Link>)}<Link href="/account" onClick={()=>setMenuOpen(false)}>مساحتي ومحفوظاتي<Heart size={19}/></Link><Link href="/compare" onClick={()=>setMenuOpen(false)}>مقارنة العقارات<ArrowLeft size={19}/></Link><Link href="/advisors" onClick={()=>setMenuOpen(false)}>المستشارون<ArrowLeft size={19}/></Link><Link href="/contact" onClick={()=>setMenuOpen(false)}>تواصل معنا<ArrowLeft size={19}/></Link><Link className="at-button" href="/home-finder" onClick={()=>setMenuOpen(false)}>ساعدني أختار<ArrowLeft size={18}/></Link></nav></div>}
    {searchOpen&&<div className="at-overlay at-search-overlay"><button className="at-backdrop" aria-label="إغلاق البحث" onClick={()=>setSearchOpen(false)}/><section ref={searchRef} className="at-search-modal" role="dialog" aria-modal="true" aria-labelledby="at-search-title" tabIndex={-1}>
      <div className="at-modal-heading"><h2 id="at-search-title">إلى أين نأخذك؟</h2><button className="at-icon" onClick={()=>setSearchOpen(false)} aria-label="إغلاق البحث"><X/></button></div>
      <form action="/properties" onSubmit={()=>setSearchOpen(false)} className="at-command-input"><Search size={23}/><input name="q" value={query} onChange={event=>setQuery(event.target.value)} placeholder="عقار، حي، مشروع أو أداة..." aria-label="عبارة البحث" autoComplete="off"/><button type="submit" className="at-button">ابحث</button></form>
      {query?<div className="at-search-results" aria-live="polite">{results.map(result=><Link key={result.href} href={result.href} onClick={()=>setSearchOpen(false)}><small>{result.category}</small><span><b>{result.title}</b><span>{result.meta}</span></span><ArrowLeft size={19}/></Link>)}{!results.length&&<p className="at-empty-copy">لم نجد تطابقًا مباشرًا. جرّب وصف احتياجك في البحث المتقدم.</p>}<Link className="at-search-all" href={`/properties?q=${encodeURIComponent(query)}`} onClick={()=>setSearchOpen(false)}>ابحث عن «{query}» في العقارات<ArrowLeft size={18}/></Link></div>:<div className="at-search-suggestions"><span>ابدأ من هنا</span><div>{[{href:'/properties',label:'جميع العقارات'},{href:'/home-finder',label:'ساعدني أختار'},{href:'/finance',label:'حاسبة التمويل'},{href:'/compare',label:'المقارنة'},{href:'/tools',label:'كل أدوات القرار'}].map(item=><Link key={item.href} href={item.href} onClick={()=>setSearchOpen(false)}>{item.label}<ArrowLeft size={17}/></Link>)}</div></div>}
      <div className="at-search-hint">Enter للبحث<span>Esc للإغلاق</span></div>
    </section></div>}
  </>;
}
export function Footer(){return <footer className="at-footer"><div className="shell"><div className="at-footer-main"><div className="at-footer-brand"><Brand footer/><p>لعقار يشبه حياتك.</p><small>نسخة استعراضية. العقارات والصور والأسعار المعروضة توضيحية. تحفظ اختياراتك وطلباتك على هذا الجهاز.</small></div><div><h3>اكتشف</h3><Link href="/properties">العقارات</Link><Link href="/projects">المشاريع</Link><Link href="/neighborhoods">الأحياء</Link><Link href="/collections">المجموعات</Link></div><div><h3>رحلتك</h3><Link href="/home-finder">اختر ما يشبهك</Link><Link href="/compare">المقارنة</Link><Link href="/finance">حاسبة التمويل</Link><Link href="/viewing-planner">مخطط المعاينات</Link><Link href="/tools">أدوات القرار</Link></div><div><h3>أثيلدار</h3><Link href="/about">من نحن</Link><Link href="/trust">دليل التحقق</Link><Link href="/briefs">دليل المشتري</Link><Link href="/contact">تواصل معنا</Link><Link href="/account">مساحتي</Link></div></div><div className="at-footer-bottom"><span>© {new Date().getFullYear()} أثيلدار. جميع الحقوق محفوظة.</span><button onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}>إلى الأعلى<ArrowUp size={17}/></button></div></div></footer>}
export function SiteShell({children}:{children:React.ReactNode}){const pathname=usePathname();return <><Header/><main id="main-content" tabIndex={-1}><div key={pathname} className="routeStage">{children}</div></main><Footer/><nav className="at-mobile-dock" aria-label="التنقل السريع">{[{href:'/',label:'الرئيسية',Icon:Home},{href:'/properties',label:'العقارات',Icon:Search},{href:'/account',label:'محفوظاتي',Icon:Heart},{href:'/tools',label:'أدواتي',Icon:LayoutGrid}].map(({href,label,Icon})=><Link key={href} href={href} aria-current={(href==='/'?pathname==='/':pathname.startsWith(href))?'page':undefined}><Icon size={21}/><span>{label}</span></Link>)}</nav></>}

type HeroStat={label:string,value:string,note?:string};
export function PageHero({eyebrow,title,copy,actions,variant='default',image,rail,panel,stats=[],highlights=[]}:{eyebrow:string,title:string,copy:string,actions?:React.ReactNode,variant?:string,image?:string,rail?:React.ReactNode,panel?:React.ReactNode,stats?:HeroStat[],highlights?:string[]}){
 const label=eyebrow.split('·').map(item=>item.trim()).find(item=>/[\u0600-\u06FF]/.test(item));
 return <section className={`pageHero signaturePageHero signaturePageHero--${variant}`}>{image&&<div className="signatureHeroMedia" aria-hidden="true"><img src={image} alt=""/></div>}<div className="signatureHeroOverlay" aria-hidden="true"/><div className={`shell signatureHeroShell ${rail?'hasRail':''}`}>{rail&&<aside className="signatureHeroRail">{rail}</aside>}<div className="signatureHeroMain">{(label||highlights.length>0)&&<div className="signatureHeroTop">{label&&<p className="eyebrow">{label}</p>}{highlights.length>0&&<div className="signatureHeroHighlights">{highlights.map(item=><span key={item}>{item}</span>)}</div>}</div>}<div className={`signatureHeroEditorial ${panel?'hasPanel':''}`}><div className="signatureHeroCopy"><h1>{title}</h1><p className="pageHeroCopy">{copy}</p>{actions&&<div className="heroActions">{actions}</div>}</div>{panel&&<div className="signatureHeroPanel">{panel}</div>}</div>{stats.length>0&&<div className="signatureHeroStats">{stats.map(item=><article key={item.label}><small>{item.label}</small><b>{item.value}</b>{item.note&&<span>{item.note}</span>}</article>)}</div>}</div></div></section>;
}
export function Breadcrumbs({items}:{items:{label:string,href?:string}[]}){return <nav className="breadcrumbs" aria-label="مسار الصفحة">{items.map((item,index)=><span key={item.label}>{index>0&&<ChevronLeft size={14}/ >}{item.href?<Link href={item.href}>{item.label}</Link>:<b aria-current="page">{item.label}</b>}</span>)}</nav>}
