'use client';
import React, { createContext, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import type { Product, ProductColor, CartItem } from '@/types';
import { DEMO_PRODUCTS } from '@/data/products';
import { addSelections, changeVariant, MAX_ITEM_QUANTITY, normalizeBag, type BagSelection } from '@/lib/bag-rules';
interface BagContextType {
  items:CartItem[]; addToBag:(product:Product,color:ProductColor,size:string,quantity?:number)=>void;
  addManyToBag:(selections:BagSelection[])=>void; removeFromBag:(id:string)=>void;
  updateQuantity:(id:string,quantity:number)=>void;
  updateVariant:(id:string,colorName:string,size:string)=>void;
  clearBag:()=>void;bagCount:number;subtotal:number;isOpen:boolean;isHydrated:boolean;openBag:()=>void;closeBag:()=>void;
}
const BagContext=createContext<BagContextType|undefined>(undefined);
const KEY='rifaa_bag',EVENT='rifaa-bag-change';let memory='[]';let storageBlocked=false;
function subscribe(fn:()=>void){window.addEventListener('storage',fn);window.addEventListener(EVENT,fn);return()=>{window.removeEventListener('storage',fn);window.removeEventListener(EVENT,fn);};}
function snapshot(){try{if(!storageBlocked)memory=localStorage.getItem(KEY)||'[]';}catch{storageBlocked=true;}return memory;}
function serverSnapshot(){return null;}
function parse(raw:string|null){try{return normalizeBag(JSON.parse(raw||'[]'),DEMO_PRODUCTS);}catch{return [];}}
function read(){return parse(snapshot());}
function write(items:CartItem[]){memory=JSON.stringify(normalizeBag(items,DEMO_PRODUCTS));try{localStorage.setItem(KEY,memory);}catch{storageBlocked=true;}window.dispatchEvent(new Event(EVENT));}
export function BagProvider({children}:{children:React.ReactNode}){
 const raw=useSyncExternalStore(subscribe,snapshot,serverSnapshot);
 const items=useMemo(()=>parse(raw),[raw]);const [isOpen,setIsOpen]=useState(false);
 function addManyToBag(selections:BagSelection[]){write(addSelections(read(),selections,DEMO_PRODUCTS));if(selections.length)setIsOpen(true);}
 function addToBag(product:Product,color:ProductColor,size:string,quantity=1){addManyToBag([{product,color,size,quantity}]);}
 function removeFromBag(id:string){write(read().filter(i=>i.id!==id));}
 function updateQuantity(id:string,quantity:number){if(!Number.isFinite(quantity))return;if(quantity<1){removeFromBag(id);return;}write(read().map(i=>i.id===id?{...i,quantity:Math.min(MAX_ITEM_QUANTITY,Math.floor(quantity))}:i));}
 function updateVariant(id:string,colorName:string,size:string){write(changeVariant(read(),id,colorName,size,DEMO_PRODUCTS));}
 return <BagContext.Provider value={{items,addToBag,addManyToBag,removeFromBag,updateQuantity,updateVariant,
 clearBag:()=>write([]),bagCount:items.reduce((n,i)=>n+i.quantity,0),subtotal:items.reduce((n,i)=>n+i.quantity*i.product.price,0),
 isOpen,isHydrated:raw!==null,openBag:()=>setIsOpen(true),closeBag:()=>setIsOpen(false)}}>{children}</BagContext.Provider>;
}
export function useBag(){const context=useContext(BagContext);if(!context)throw new Error('useBag must be used within a BagProvider');return context;}
