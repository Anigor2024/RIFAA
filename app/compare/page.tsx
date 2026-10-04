import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { GlobalComparisonWorkbench } from '@/components/atheeldar/Phase10Suite';
export const metadata:Metadata={title:'مقارنة العقارات'};
export default function ComparePage(){return <><PageHero variant="compare" image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=88" eyebrow="ATHEELDAR COMPARE · قارن ما يهم" title="مقارنة العقارات" copy="مقارنة مستقلة تصل إليها من أي بطاقة عقار، وتضع السعر والمساحة وسعر المتر والجودة وملاءمة العائلة وزاوية الاستثمار في مشهد واحد." highlights={['حتى 3 عقارات','سعر المتر','ملاءمة العائلة','زاوية الاستثمار']} stats={[{label:'نوع المقارنة',value:'Contextual',note:'أكثر من السعر'},{label:'الأصول',value:'حتى 3',note:'في الشاشة'},{label:'الأهداف',value:'سكن · عائلة · استثمار',note:'تغيّر القراءة'}]} actions={<Link href="/properties" className="lightOutline">أضف عقارات <ArrowLeft/></Link>}/><section className="section shell"><GlobalComparisonWorkbench/></section></>}