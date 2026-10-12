import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GlobalComparisonWorkbench } from '@/components/atheeldar/Phase10Suite';
export const metadata:Metadata={title:'مقارنة العقارات',description:'قارن حتى ثلاثة عقارات من اختياراتك، مع تفاصيل المساحة والمزايا ووحدات أسعار الشراء والإيجار السنوي.'};
export default function ComparePage(){return <><section className="at-simple-hero at-properties-hero"><div className="shell"><div><h1>كل التفاصيل، جنبًا إلى جنب.</h1><p>اختر حتى ثلاثة عقارات وقارن السعر والمساحة والمزايا، مع توضيح أسعار الشراء والإيجار السنوي.</p></div><Link href="/properties" className="at-text-link">استكشف العقارات <ArrowLeft size={18} aria-hidden="true"/></Link></div></section><section className="section shell"><GlobalComparisonWorkbench/></section></>}
