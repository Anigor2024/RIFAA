'use client';
import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import type { Language } from '@/types';
import { DICTIONARY } from '@/data/translations';
export type TranslationDictionary = (typeof DICTIONARY)['ar'] | (typeof DICTIONARY)['en'];
interface LanguageContextType {
 language:Language;direction:'rtl'|'ltr';isRtl:boolean;
 setLanguage:(language:Language)=>void;toggleLanguage:()=>void;t:TranslationDictionary;
}
const LanguageContext=createContext<LanguageContextType|undefined>(undefined);
const KEY='rifaa_language',EVENT='rifaa-language-change';
let memory:Language='ar';let storageBlocked=false;
function subscribe(fn:()=>void){window.addEventListener('storage',fn);window.addEventListener(EVENT,fn);return()=>{window.removeEventListener('storage',fn);window.removeEventListener(EVENT,fn);};}
function snapshot():Language{try{if(!storageBlocked){const saved=localStorage.getItem(KEY);if(saved==='ar'||saved==='en')memory=saved;}}catch{storageBlocked=true;}return memory;}
function serverSnapshot():Language{return 'ar';}
function setLanguage(language:Language){memory=language;try{localStorage.setItem(KEY,language);}catch{storageBlocked=true;}window.dispatchEvent(new Event(EVENT));}
export function LanguageProvider({children}:{children:React.ReactNode}){
 const language=useSyncExternalStore(subscribe,snapshot,serverSnapshot);
 const direction=language==='ar'?'rtl':'ltr';
 // DOM synchronization must not overwrite a persisted preference with the SSR fallback.
 useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=direction;},[language,direction]);
 return <LanguageContext.Provider value={{language,direction,isRtl:language==='ar',setLanguage,toggleLanguage:()=>setLanguage(snapshot()==='ar'?'en':'ar'),t:DICTIONARY[language]}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error('useLanguage must be used within a LanguageProvider');return context;}
