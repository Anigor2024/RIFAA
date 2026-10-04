import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { AreaMatchMatrix } from '@/components/atheeldar/Phase15Suite';
export const metadata:Metadata={title:'مصفوفة ملاءمة الأحياء'};
export default function AreaMatchPage(){return <><PageHero variant="area-match" image="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1600&q=88" eyebrow="AREA INTELLIGENCE · المكان قبل الإعلان" title="مصفوفة ملاءمة الأحياء" copy="قارن حتى 4 أحياء وفق هدفك أنت — عائلة، حضري، استثمار أو هدوء — وشاهد كيف تتغير الأوزان والنتيجة بدل الاعتماد على ترتيب ثابت." highlights={['حتى 4 أحياء','أوزان ديناميكية','عائلة','حضري','استثمار']} stats={[{label:'الأهداف',value:'4',note:'تغيّر الأوزان'},{label:'المؤشرات',value:'عائلة · مشي · طلب · جودة',note:'داخل النموذج'},{label:'الناتج',value:'Best Match',note:'حسب هدفك'}]} actions={<Link href="/neighborhoods" className="lightOutline">دليل الأحياء <ArrowLeft/></Link>}/><section className="section shell"><AreaMatchMatrix/></section></>}