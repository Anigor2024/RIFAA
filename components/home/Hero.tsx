'use client';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,Sparkles} from 'lucide-react';
import {useLanguage} from '@/context/LanguageContext';
import {ImageWithFallback} from '@/components/common/ImageWithFallback';
export function Hero(){
 const{language,isRtl}=useLanguage(),ar=language==='ar';
 return <section className="rf15-couture-hero" aria-labelledby="rifaa-home-title">
  <div className="rf15-campaign-photo"><ImageWithFallback src="/images/rifaa-editorial-v6.webp" alt={ar?'عباية عنابية في فناء سعودي من الحجر الطبيعي':'Burgundy abaya in a Saudi limestone courtyard'} fill priority sizes="(max-width:760px) 100vw, 62vw" className="object-cover"/><div className="rf15-department-links">{[{href:'/women',ar:'النساء',en:'Women'},{href:'/men',ar:'الرجال',en:'Men'},{href:'/kids',ar:'الأطفال',en:'Kids'}].map((item,index)=><Link href={item.href} key={item.href}><small>{String(index+1).padStart(2,'0')}</small>{ar?item.ar:item.en}</Link>)}</div></div>
  <div className="rf15-campaign-copy"><div><h1 id="rifaa-home-title">{ar?<>أناقة سعودية،<br/><em>بلمسة معاصرة</em></>:<>Saudi elegance<br/><em>A modern expression</em></>}</h1><p>{ar?'قطع مختارة بعناية، وتفاصيل تحكي ذوقك.':'Considered pieces. Details that express your style.'}</p><div className="rf15-campaign-actions"><Link href="/collections" className="rf15-primary">{ar?'اكتشف التشكيلة':'Explore the collection'}{isRtl?<ArrowLeft size={19}/>:<ArrowRight size={19}/>}</Link><Link href="/discover" className="rf15-secondary">{ar?'منسّق رِفعة':'RIFAA Curator'}<Sparkles size={17}/></Link></div></div><span className="rf15-campaign-word" aria-hidden="true">RIFAA</span></div>
 </section>;
}
