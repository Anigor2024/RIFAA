'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatPrice } from '@/lib/commerce';
import { MAX_ITEM_QUANTITY } from '@/lib/bag-rules';
export function BagDrawer(){
 const {items,removeFromBag,updateQuantity,updateVariant,subtotal,bagCount,isOpen,closeBag}=useBag();
 const {isWishlisted,toggleWishlist}=useWishlist();const {language,isRtl,t}=useLanguage();const ar=language==='ar';
 const dialog=useRef<HTMLDialogElement>(null);const closeRef=useRef(closeBag);
 useEffect(()=>{closeRef.current=closeBag;},[closeBag]);
 useEffect(()=>{
  const node=dialog.current;if(!node||!isOpen)return;
  const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;
  node.showModal();document.body.style.overflow='hidden';
  return()=>{node.close();document.body.style.overflow=overflow;previous?.focus();};
 },[isOpen]);
 return <dialog ref={dialog} onCancel={e=>{e.preventDefault();closeRef.current();}} onClick={e=>{if(e.target===e.currentTarget)closeBag();}}
 aria-labelledby="bag-dialog-title" className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-[#242220] backdrop:bg-black/50 backdrop:backdrop-blur-sm">
 <div className={'absolute inset-y-0 flex w-full max-w-[480px] flex-col bg-[#F7F4EF] shadow-2xl '+(isRtl?'left-0':'right-0')}>
  <header className="flex shrink-0 items-center justify-between border-b border-[#242220]/10 px-5 py-4"><div className="flex items-center gap-3"><ShoppingBag size={21}/><h2 id="bag-dialog-title" className="text-xl font-bold">{t.actions.bag}</h2><span className="text-sm" aria-live="polite">({bagCount})</span></div><button autoFocus type="button" onClick={closeBag} aria-label={t.actions.close} className="flex h-11 w-11 items-center justify-center"><X size={22}/></button></header>
  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-2">
   {!items.length?<div className="flex h-full flex-col items-center justify-center gap-5 py-12 text-center"><ShoppingBag size={42} strokeWidth={1}/><h3 className="text-lg font-bold">{t.actions.emptyBag}</h3><p className="max-w-xs text-sm leading-7 text-[#746657]">{t.actions.emptyBagSub}</p><Link href="/collections" onClick={closeBag} className="bg-[#511D24] px-6 py-3 text-sm font-bold text-white">{t.actions.continueShopping}</Link></div>:items.map(item=>{
    const name=ar?item.product.nameAr:item.product.nameEn;
    return <article key={item.id} className="border-b border-[#242220]/10 py-5 last:border-0"><div className="flex gap-4"><Link href={'/products/'+item.product.slug} onClick={closeBag} className="relative h-[128px] w-[92px] shrink-0 overflow-hidden bg-[#E7E0D4]"><ImageWithFallback src={item.product.image} alt={name} fill sizes="92px" className="object-cover"/></Link><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><Link href={'/products/'+item.product.slug} onClick={closeBag} className="text-sm font-bold leading-6 hover:text-[#511D24]">{name}</Link><button type="button" onClick={()=>removeFromBag(item.id)} aria-label={(ar?'إزالة ':'Remove ')+name} className="flex h-11 w-11 shrink-0 items-center justify-center text-[#746657]"><Trash2 size={17}/></button></div><strong className="mt-1 block text-base">{formatPrice(item.quantity*item.product.price,language)}</strong><button type="button" onClick={()=>{if(!isWishlisted(item.product.id))toggleWishlist(item.product.id);removeFromBag(item.id);}} className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-[#511D24]"><Heart size={15}/>{ar?'احفظها لوقت لاحق':'Save for later'}</button></div></div>
    <div className="mt-4 grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-xs text-[#746657]">{ar?'اللون':'Color'}<select aria-label={(ar?'لون ':'Color of ')+name} value={item.selectedColor.nameEn} onChange={e=>updateVariant(item.id,e.target.value,item.selectedSize)} className="h-11 min-w-0 border border-[#c8bcaa] bg-white px-2 text-sm text-[#242220]">{item.product.colors.map(c=><option key={c.nameEn} value={c.nameEn}>{ar?c.nameAr:c.nameEn}</option>)}</select></label><label className="grid gap-1.5 text-xs text-[#746657]">{ar?'المقاس':'Size'}<select aria-label={(ar?'مقاس ':'Size of ')+name} value={item.selectedSize} onChange={e=>updateVariant(item.id,item.selectedColor.nameEn,e.target.value)} className="h-11 min-w-0 border border-[#c8bcaa] bg-white px-2 text-sm text-[#242220]">{item.product.sizes.map(s=><option key={s}>{s}</option>)}</select></label></div>
    <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-[#746657]">{ar?'الكمية':'Quantity'}</span><div className="flex items-center border border-[#c8bcaa] bg-white"><button type="button" onClick={()=>updateQuantity(item.id,item.quantity-1)} disabled={item.quantity<=1} aria-label={ar?'تقليل الكمية':'Decrease quantity'} className="flex h-11 w-11 items-center justify-center disabled:opacity-30"><Minus size={15}/></button><span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span><button type="button" onClick={()=>updateQuantity(item.id,item.quantity+1)} disabled={item.quantity>=MAX_ITEM_QUANTITY} aria-label={ar?'زيادة الكمية':'Increase quantity'} className="flex h-11 w-11 items-center justify-center disabled:opacity-30"><Plus size={15}/></button></div></div>
   </article>;
   })}
  </div>
  {items.length>0&&<footer className="shrink-0 space-y-3 border-t border-[#242220]/10 bg-[#FFFDFC] p-5 pb-[max(20px,env(safe-area-inset-bottom))]"><div className="flex justify-between text-base"><span>{t.actions.subtotal}</span><strong>{formatPrice(subtotal,language)}</strong></div><p className="text-xs leading-6 text-[#746657]">{ar?'راجع المقاس واللون أعلاه. الشحن والخصم يظهران في الخطوة التالية. الطلب تجريبي ولا تُخصم أموال.':'Review sizes and colors above. Delivery and discounts follow at checkout. Demo orders do not charge money.'}</p><Link href="/checkout" onClick={closeBag} className="flex min-h-12 items-center justify-center gap-3 bg-[#511D24] px-5 py-3 text-sm font-bold text-white hover:bg-[#331218]">{ar?'مراجعة وإتمام الطلب':'Review & checkout'}{isRtl?<ArrowLeft size={18}/>:<ArrowRight size={18}/>}</Link></footer>}
 </div></dialog>;
}
