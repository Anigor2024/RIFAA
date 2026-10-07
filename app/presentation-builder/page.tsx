import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { PresentationBuilder } from '@/components/atheeldar/Phase18Suite';

export const metadata:Metadata={title:'Presentation Studio'};

export default function PresentationBuilderPage(){
  return <>
    <PageHero
      variant="presentation-builder"
      image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=88"
      eyebrow="EXECUTIVE SHOWCASE · من Shortlist إلى عرض عميل"
      title="Presentation Studio"
      copy="ابنِ عرضًا فاخرًا من العقارات المختارة، اضبط زاوية القرار، ثم افتح رابط Presentation قابلًا للمشاركة والطباعة أمام العميل."
      highlights={['حتى 5 أصول','Shareable URL','Executive View','Print / PDF']}
      stats={[{label:'طريقة المشاركة',value:'URL',note:'يحمل الاختيارات'},{label:'الشرائح',value:'Dynamic',note:'حسب الأصول'},{label:'العرض',value:'Full-screen',note:'بدون تشتيت'}]}
      actions={<Link href="/shortlist" className="lightOutline">غرفة الـShortlist <ArrowLeft/></Link>}
    />
    <section className="section shell"><PresentationBuilder/></section>
  </>
}