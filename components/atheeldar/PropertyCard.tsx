'use client';
import Link from 'next/link';
import { Heart, Scale, BedDouble, Bath, Maximize2, BadgeCheck } from 'lucide-react';
import type { Property } from '@/lib/atheeldar-data';
import { money } from '@/lib/atheeldar-data';
import { useEffect, useState } from 'react';

function getSet(key:string){try{return new Set<string>(JSON.parse(localStorage.getItem(key)||'[]'))}catch{return new Set<string>()}}

export function PropertyCard({p,onCompare}:{p:Property,onCompare?:(slug:string)=>void}){
  const [fav,setFav]=useState(false);
  useEffect(()=>{const read=()=>setFav(getSet('atheeldar-favorites').has(p.slug));const id=window.setTimeout(read,0);return()=>window.clearTimeout(id)},[p.slug]);
  const toggle=()=>{const s=getSet('atheeldar-favorites');fav?s.delete(p.slug):s.add(p.slug);localStorage.setItem('atheeldar-favorites',JSON.stringify([...s]));setFav(!fav);window.dispatchEvent(new Event('atheeldar:favorites'))};
  return <article className="propertyCard">
    <div className="propertyMedia">
      <Link href={`/properties/${p.slug}`}><img src={p.image} alt={p.title}/></Link>
      <div className="mediaBadges"><span>{p.badge}</span>{p.verified&&<span className="verified"><BadgeCheck size={14}/> موثق تجريبيًا</span>}</div>
      <button className={`heartButton ${fav?'on':''}`} onClick={toggle} aria-label="المفضلة"><Heart size={19} fill={fav?'currentColor':'none'}/></button>
    </div>
    <div className="propertyContent">
      <div className="propertyMeta"><span>{p.purpose}</span><span>{p.type}</span><span>تقييم {p.score}/100</span></div>
      <Link href={`/properties/${p.slug}`} className="propertyTitle">{p.title}</Link>
      <p className="propertyLocation">{p.city} · {p.district}</p>
      <div className="propertySpecs">{p.beds>0&&<span><BedDouble size={15}/>{p.beds}</span>}{p.baths>0&&<span><Bath size={15}/>{p.baths}</span>}<span><Maximize2 size={15}/>{money(p.area)} م²</span></div>
      <div className="propertyBottom"><div><b>{money(p.price)} ر.س</b>{p.purpose==='للإيجار'&&<small>/ سنوي</small>}</div><div className="cardActions">{onCompare&&<button onClick={()=>onCompare(p.slug)} title="مقارنة"><Scale size={17}/></button>}<Link href={`/properties/${p.slug}`}>التفاصيل</Link></div></div>
    </div>
  </article>
}
