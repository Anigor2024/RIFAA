import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { TrustCenter } from '@/components/atheeldar/Phase07Suite';
export const metadata:Metadata={title:'مركز الثقة'};
export default function Page(){return <><PageHero variant="trust" image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=88" eyebrow="TRUST BEFORE TRANSACTION · الثقة قبل الالتزام" title="مركز الثقة" copy="افصل بوضوح بين اكتمال بيانات العرض، فحص الأصل، وجاهزية الصفقة، حتى تبقى التجربة الفاخرة صادقة ولا توحي بتحقق رسمي لم يحدث." highlights={['بيانات العرض','فحص الأصل','المستندات','جاهزية الصفقة']} stats={[{label:'المبدأ',value:'شفافية',note:'قبل التسويق'},{label:'مستويات التحقق',value:'3',note:'عرض · أصل · صفقة'},{label:'الهدف',value:'ثقة أوضح',note:'بدون مبالغة'}]} actions={<Link href="/briefs" className="lightOutline">اقرأ موجز أثيلدار <ArrowLeft/></Link>}/><section className="section shell"><TrustCenter/></section></>}