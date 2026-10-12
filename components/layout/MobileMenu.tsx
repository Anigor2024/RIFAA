'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Shirt, Globe, UserRound, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MEGA_NAVIGATION } from '@/data/navigation';
export function MobileMenu({isOpen,onClose}:{isOpen:boolean;onClose:()=>void}){
 const{language,isRtl,toggleLanguage}=useLanguage();const ar=language==='ar';const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=dialog.current;if(!isOpen||!el)return;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;el.showModal();document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=overflow;previous?.focus();};},[isOpen]);
 return <dialog ref={dialog} aria-labelledby="mobile-nav-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-[#242220] backdrop:bg-black/55 backdrop:backdrop-blur-sm">
 <div className={'absolute inset-y-0 flex w-[min(94vw,440px)] flex-col bg-[#F7F4EF] shadow-2xl '+(isRtl?'right-0':'left-0')}>
  <div className="flex items-center justify-between border-b border-[#242220]/10 px-5 py-4"><h2 id="mobile-nav-title" className="text-2xl font-bold">{ar?'اكتشف رِفْعة':'Explore RIFAA'}</h2><button type="button" autoFocus onClick={onClose} aria-label={ar?'إغلاق القائمة':'Close navigation'} className="flex h-11 w-11 items-center justify-center"><X size={23}/></button></div>
  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6"><Link href="/fitting-room" onClick={onClose} className="my-5 flex items-center gap-3 bg-[#511D24] px-4 py-4 text-base font-bold text-white"><Shirt size={22}/>{ar?'جرّب غرفة القياس':'Explore the fitting room'}</Link>
   {MEGA_NAVIGATION.map(item=><details key={item.key} className="group border-b border-[#242220]/10"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden"><span>{ar?item.labelAr:item.labelEn}</span><ChevronDown size={18} className="transition-transform group-open:rotate-180"/></summary><div className="pb-5 ps-3"><Link href={item.href} onClick={onClose} className="mb-3 flex min-h-11 items-center text-sm font-bold text-[#511D24]">{ar?item.ctaAr:item.ctaEn}</Link>{item.groups.map(group=><section key={group.titleEn} className="mt-4"><h3 className="mb-2 text-xs font-bold text-[#746657]">{ar?group.titleAr:group.titleEn}</h3>{group.items.map(link=><Link key={link.href+link.en} href={link.href} onClick={onClose} className="flex min-h-11 items-center text-sm hover:text-[#511D24]">{ar?link.ar:link.en}</Link>)}</section>)}</div></details>)}
   <div className="mt-6 grid grid-cols-2 gap-3"><Link href="/account" onClick={onClose} className="flex min-h-12 items-center justify-center gap-2 border border-[#c8bcaa] text-sm"><UserRound size={17}/>{ar?'حسابي':'My account'}</Link><Link href="/wishlist" onClick={onClose} className="flex min-h-12 items-center justify-center gap-2 border border-[#c8bcaa] text-sm"><Heart size={17}/>{ar?'المفضلة':'Wishlist'}</Link></div>
  </div>
  <div className="flex shrink-0 items-center justify-between border-t border-[#242220]/10 p-5 pb-[max(20px,env(safe-area-inset-bottom))]"><span className="text-xs">SAR · {ar?'السعودية':'Saudi Arabia'}</span><button type="button" onClick={toggleLanguage} className="flex min-h-11 items-center gap-2 px-3 text-sm font-bold"><Globe size={18}/>{ar?'English':'العربية'}</button></div>
 </div></dialog>;
}
