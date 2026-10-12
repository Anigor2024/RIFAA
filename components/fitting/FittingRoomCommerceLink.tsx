'use client';
import Link from 'next/link';
import { Shirt, LockKeyhole } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
export function FittingRoomCommerceLink({productId}:{productId:string}){
 const{language}=useLanguage();const ar=language==='ar';
 return <aside className="mx-auto max-w-7xl px-5 pb-12 lg:px-8"><Link href={'/fitting-room?product='+encodeURIComponent(productId)} className="flex flex-col justify-between gap-5 border border-[#c8bcaa] bg-[#eee8df] p-6 sm:flex-row sm:items-center"><div><span className="flex items-center gap-2 text-lg font-bold text-[#511D24]"><Shirt size={21}/>{ar?'شاهد القطعة على صورتك':'Preview this piece on your photo'}</span><p className="mt-2 text-sm leading-7 text-[#746657]">{ar?'معاينة بصرية ثنائية الأبعاد، لا تقيس الجسم ولا تضمن المقاس.':'A 2D visual composition, not a body measurement or size guarantee.'}</p></div><span className="flex items-center gap-2 text-sm font-semibold text-[#511D24]"><LockKeyhole size={17}/>{ar?'غرفة القياس الخاصة':'Private fitting room'}</span></Link></aside>;
}
