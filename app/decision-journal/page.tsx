import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { DecisionJournal } from '@/components/atheeldar/Phase16Suite';

export const metadata:Metadata={title:'سجل القرار'};

export default function DecisionJournalPage(){
  return <>
    <PageHero
      variant="decision-journal"
      image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=88"
      eyebrow="DECISION MEMORY · لا تعتمد على الذاكرة"
      title="سجل القرار"
      copy="اجمع موقفك الحقيقي من كل أصل: لماذا أعجبك، ما الذي يقلقك، وما الذي ظهر بعد المعاينة. سجل واحد يعيد لك منطق القرار بدل قائمة روابط صامتة."
      highlights={['مرشح قوي','أحتاج مراجعة','Inspection Score','Print / PDF']}
      stats={[{label:'الهدف',value:'Decision Memory',note:'سبب القرار'},{label:'المصدر',value:'العقار + المعاينة',note:'في سجل واحد'},{label:'الحفظ',value:'Local',note:'على جهازك'}]}
      actions={<Link href="/properties" className="lightOutline">استكشف العقارات <ArrowLeft/></Link>}
    />
    <section className="section shell"><DecisionJournal/></section>
  </>
}