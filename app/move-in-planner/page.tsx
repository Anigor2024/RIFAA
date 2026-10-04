import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { MoveInPlanner } from '@/components/atheeldar/Phase17Suite';

export const metadata:Metadata={title:'خطة الاستلام والانتقال'};

export default function MoveInPlannerPage(){
  return <>
    <PageHero
      variant="move-in-planner"
      image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=88"
      eyebrow="HANDOVER OS · ما بعد إغلاق الصفقة"
      title="خطة الاستلام والانتقال"
      copy="من مراجعة المستندات والملاحظات الفنية إلى المفاتيح والخدمات والصيانة والأثاث وأول 30 يومًا — رحلة ما بعد الشراء في خطة واحدة."
      highlights={['12 مهمة','4 مراحل','حفظ محلي','Print / PDF']}
      stats={[{label:'المراحل',value:'4',note:'قبل الاستلام → 30 يومًا'},{label:'المهام',value:'12',note:'قابلة للتعليم'},{label:'الناتج',value:'Move-In Plan',note:'قابلة للطباعة'}]}
      actions={<Link href="/transaction-roadmap" className="lightOutline">مسار الصفقة <ArrowLeft/></Link>}
    />
    <section className="section shell"><MoveInPlanner/></section>
  </>
}