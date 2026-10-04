import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { TransactionRoadmap } from '@/components/atheeldar/Phase14Suite';
export const metadata:Metadata={title:'مسار الصفقة العقارية'};
export default function TransactionRoadmapPage(){return <><PageHero variant="transaction-roadmap" image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=88" eyebrow="TRANSACTION OS · من الاهتمام حتى الاستلام" title="مسار الصفقة" copy="رحلة تشغيلية تحفظ تقدمك بين المعاينة والعرض والتمويل والفحص والاتفاق والإغلاق والاستلام، مع بوابات واضحة لما يجب مراجعته قبل كل خطوة." highlights={['8 مراحل','حفظ محلي','Deal Room','Due Diligence']} stats={[{label:'المراحل',value:'8',note:'من الاهتمام للاستلام'},{label:'الحالة',value:'قابلة للتحديث',note:'محليًا'},{label:'الهدف',value:'وضوح العملية',note:'قبل الالتزام'}]} actions={<Link href="/trust" className="lightOutline">مركز الثقة <ArrowLeft/></Link>}/><section className="section shell"><TransactionRoadmap/></section></>}