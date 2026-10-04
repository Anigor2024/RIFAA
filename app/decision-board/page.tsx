import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { DecisionBoard } from '@/components/atheeldar/Phase07Suite';
export const metadata:Metadata={title:'لوحة القرار'};
export default function Page(){return <><PageHero variant="decision-board" image="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=88" eyebrow="COMPARE WHAT MATTERS · قارن ما يهم فعلًا" title="لوحة القرار" copy="رتّب الأصول المحفوظة بأوزانك أنت: جودة الأصل، نمط الحياة، الاستثمار وملاءمة الميزانية — لترى لماذا يتغير الاختيار عندما تتغير الأولويات." highlights={['أوزان مرنة','ترتيب ديناميكي','محفوظاتك الحالية']} stats={[{label:'نوع المقارنة',value:'Weighted',note:'حسب أولوياتك'},{label:'الأصول',value:'محفوظة',note:'من رحلتك'},{label:'الناتج',value:'ترتيب أوضح',note:'وليس حكمًا نهائيًا'}]} actions={<Link href="/properties" className="lightOutline">أضف عقارات <ArrowLeft/></Link>}/><section className="section shell"><DecisionBoard/></section></>}