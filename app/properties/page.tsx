import type {Metadata} from 'next';
import Link from 'next/link';
import {Suspense} from 'react';
import {ArrowLeft} from 'lucide-react';
import {PropertyExplorer} from '@/components/atheeldar/PropertyExplorer';
export const metadata:Metadata={title:'اكتشف العقارات',description:'ابحث عن عقارك بحسب المدينة والميزانية ونوع العقار. احفظ بحثك، قارن اختياراتك وخطط للمعاينة.'};
export default async function PropertiesPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const params=await searchParams;
 return <><section className="at-simple-hero at-properties-hero"><div className="shell"><div><h1>لنجد المساحة التي تشبهك.</h1><p>ابحث بطريقتك، احتفظ بما يعجبك، وقارن التفاصيل على مهل.</p></div><Link href="/home-finder" className="at-text-link">تحتاج مساعدة في الاختيار؟<ArrowLeft size={18}/></Link></div></section><section id="explorer" className="shell explorerSection at-new-explorer"><Suspense fallback={<p>نجهّز العقارات...</p>}><PropertyExplorer initialQuery={params.q||''}/></Suspense></section></>;
}
