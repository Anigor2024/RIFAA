import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { InspectionCompare } from '@/components/atheeldar/Phase17Suite';

export const metadata:Metadata={title:'مقارنة المعاينات'};

export default function InspectionComparePage(){
  return <>
    <PageHero
      variant="inspection-compare"
      image="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=88"
      eyebrow="POST-VIEWING INTELLIGENCE · قارن الواقع لا الإعلان"
      title="مقارنة المعاينات"
      copy="قارن حتى 4 عقارات بعد زيارتها فعليًا عبر نفس محاور الإضاءة والهدوء والتوزيع والتشطيب والحالة والخصوصية، مع Red Flags واضحة."
      highlights={['Inspection Score','8 محاور','Red Flags','حتى 4 أصول']}
      stats={[{label:'مصدر البيانات',value:'Inspection Room',note:'محفوظ محليًا'},{label:'المحاور',value:'8',note:'بنفس المقياس'},{label:'العرض',value:'Matrix',note:'مقارنة مباشرة'}]}
      actions={<Link href="/viewing-planner" className="lightOutline">مخطط المعاينات <ArrowLeft/></Link>}
    />
    <section className="section shell"><InspectionCompare/></section>
  </>
}