'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Columns3, Globe, Heart, Menu, Search, Shirt, ShoppingBag, UserRound } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useSearch } from '@/context/SearchContext';
import { useCompare } from '@/context/CompareContext';
import { MEGA_NAVIGATION, type MegaNavKey } from '@/data/navigation';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
export function Header(){const pathname=usePathname();return <HeaderContent key={pathname} pathname={pathname}/>;}
function HeaderContent({pathname}:{pathname:string}){
 const{language,toggleLanguage,t}=useLanguage();const ar=language==='ar';
 const{wishlistCount}=useWishlist();const{bagCount,openBag}=useBag();const{openSearch}=useSearch();const{compareCount}=useCompare();
 const[scrolled,setScrolled]=useState(false);const[mobile,setMobile]=useState(false);const[active,setActive]=useState<MegaNavKey|null>(null);
 const header=useRef<HTMLElement>(null);const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);const dark=pathname==='/'&&!scrolled&&!active;
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>28);const frame=requestAnimationFrame(scroll);window.addEventListener('scroll',scroll,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);};},[]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{const el=event.target as HTMLElement;const typing=el.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(el.tagName);if(!typing&&((event.key==='/'&&!event.ctrlKey&&!event.metaKey)||((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'))){event.preventDefault();setActive(null);openSearch();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[openSearch]);
 useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current);},[]);
 const stopClose=()=>{if(closeTimer.current)clearTimeout(closeTimer.current);closeTimer.current=null;};
 const close=()=>{stopClose();setActive(null);};
 const schedule=()=>{stopClose();closeTimer.current=setTimeout(()=>{if(!header.current?.contains(document.activeElement))setActive(null);},220);};
 function open(key:MegaNavKey){stopClose();setActive(key);}
 function enterMenu(key:MegaNavKey){open(key);requestAnimationFrame(()=>header.current?.querySelector<HTMLAnchorElement>('[data-mega-menu="'+key+'"] a')?.focus());}
 const icon='relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10';
 const count=(n:number)=>n>0?<span className="absolute end-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#511D24] px-1 text-[10px] font-bold text-white ring-1 ring-white/50">{n>99?'99+':n}</span>:null;
 const config=MEGA_NAVIGATION.find(item=>item.key===active);
 return <><header ref={header} className={'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 '+(dark?'border-white/10 bg-gradient-to-b from-black/80 via-black/45 to-black/15 text-white':'border-[#242220]/10 bg-[#F7F4EF]/[0.98] text-[#242220] shadow-sm backdrop-blur-xl')}
 onMouseEnter={stopClose} onMouseLeave={schedule} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))close();}}
 onKeyDown={e=>{if(e.key==='Escape'&&active){e.preventDefault();close();trigger.current?.focus();}}}>
 <div className="mx-auto max-w-[1340px] px-3 sm:px-5 lg:px-8">
  <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-1 lg:h-[84px]">
   <div className="flex min-w-0 items-center"><button type="button" className={icon+' lg:hidden'} onClick={()=>{close();setMobile(true);}} aria-label={ar?'فتح القائمة':'Open navigation menu'}><Menu size={22}/></button><button type="button" className="hidden min-h-11 items-center gap-2 text-sm font-semibold lg:inline-flex" onClick={toggleLanguage} aria-label={ar?'Switch to English':'التبديل إلى العربية'}><Globe size={17}/>{ar?'EN':'العربية'}</button><Link href="/fitting-room" className="ms-5 hidden items-center gap-2 text-xs font-semibold xl:flex"><Shirt size={17}/>{ar?'غرفة القياس':'Fitting room'}</Link></div>
   <Link href="/" onClick={close} className="flex items-baseline justify-center gap-2.5 whitespace-nowrap" aria-label={ar?'رِفْعة، الرئيسية':'RIFAA home'}><span className="text-[29px] font-bold leading-none tracking-tight sm:text-[34px] lg:text-[40px]">{t.brandName}</span><span className={'font-editorial text-[16px] font-semibold tracking-[0.12em] sm:text-xl lg:text-[26px] '+(dark?'text-[#efece6]':'text-[#511D24]')}>RIFAA</span></Link>
   <div className="flex min-w-0 items-center justify-end"><button type="button" className={icon} onClick={()=>{close();openSearch();}} aria-label={t.actions.search} aria-keyshortcuts="Control+K Meta+K /"><Search size={21}/></button><Link href="/account" className={icon+' !hidden lg:!inline-flex'} aria-label={t.actions.account}><UserRound size={20}/></Link><Link href="/compare" className={icon+' !hidden xl:!inline-flex'} aria-label={ar?'استوديو المقارنة':'Compare Studio'}><Columns3 size={19}/>{count(compareCount)}</Link><Link href="/wishlist" className={icon+' !hidden lg:!inline-flex'} aria-label={t.actions.wishlist}><Heart size={20}/>{count(wishlistCount)}</Link><button type="button" className={icon} onClick={()=>{close();openBag();}} aria-label={t.actions.bag}><ShoppingBag size={21}/>{count(bagCount)}</button></div>
  </div>
  <nav aria-label={ar?'التنقل الرئيسي':'Primary navigation'} className="hidden items-center justify-center gap-1 border-t border-current/10 lg:flex">
   {MEGA_NAVIGATION.map(item=>{const expanded=active===item.key;const current=pathname===item.href||pathname.startsWith(item.href+'/');return <div key={item.key} className={'group relative flex items-center '+(expanded||current?'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-[#B59A73]':'')} onMouseEnter={()=>open(item.key)}>
    <Link href={item.href} onClick={close} aria-current={current?'page':undefined} className="flex min-h-[50px] items-center ps-3 text-[16px] font-bold xl:ps-4 xl:text-[18px]">{ar?item.labelAr:item.labelEn}</Link>
    <button type="button" aria-label={(ar?'فتح قائمة ':'Open ')+(ar?item.labelAr:item.labelEn)} aria-expanded={expanded} aria-controls={'mega-'+item.key} className="flex h-11 w-8 items-center justify-center xl:w-9" onClick={e=>{trigger.current=e.currentTarget;expanded?close():open(item.key);}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();trigger.current=e.currentTarget;enterMenu(item.key);}}}><ChevronDown size={15} className={'transition-transform '+(expanded?'rotate-180':'')}/></button>
   </div>;})}
  </nav>
 </div>
 {config&&<div id={'mega-'+config.key} className="absolute inset-x-0 top-full hidden max-h-[calc(100dvh-140px)] overflow-y-auto bg-[#F7F4EF] lg:block" onMouseEnter={stopClose} onMouseLeave={schedule}><MegaMenu config={config} onNavigate={close}/></div>}
 </header><MobileMenu isOpen={mobile} onClose={()=>setMobile(false)}/></>;
}
