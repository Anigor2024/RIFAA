import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { HouseholdDecisionRoom } from '@/components/atheeldar/Phase17Suite';

export const metadata:Metadata={title:'غرفة قرار الأسرة'};

export default function HouseholdRoomPage(){
  return <>
    <PageHero
      variant="household-room"
      image="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=88"
      eyebrow="HOUSEHOLD CONSENSUS · القرار ليس فرديًا دائمًا"
      title="غرفة قرار الأسرة"
      copy="دع كل شخص يقيّم نفس العقارات بطريقته، ثم شاهد متوسط التفضيل ودرجة الاتفاق والفجوة التي تحتاج نقاشًا قبل تثبيت القرار."
      highlights={['حتى 4 عقارات','3 آراء','درجة اتفاق','ملاحظات منفصلة']}
      stats={[{label:'المشاركون',value:'3',note:'قابلون للتخصيص'},{label:'المقياس',value:'1–5',note:'لكل أصل'},{label:'الناتج',value:'Consensus',note:'متوسط + اتفاق'}]}
      actions={<Link href="/decision-journal" className="lightOutline">سجل القرار <ArrowLeft/></Link>}
    />
    <section className="section shell"><HouseholdDecisionRoom/></section>
  </>
}