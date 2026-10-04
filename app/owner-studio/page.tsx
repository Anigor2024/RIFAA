import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { OwnerStudio } from '@/components/atheeldar/Phase14Suite';
export const metadata:Metadata={title:'استوديو المالك'};
export default function OwnerStudioPage(){return <><PageHero variant="owner-studio" image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=88" eyebrow="OWNER EXPERIENCE · قبل أن تنشر العقار" title="استوديو المالك" copy="قيّم جاهزية الأصل للتسويق من المستندات والصور والصيانة إلى التسعير والمعاينات، ثم كوّن Owner Brief واضح قبل دخول السوق." highlights={['جاهزية العرض','سياق سعري','مستندات','معاينات']} stats={[{label:'التقييم',value:'Go-to-Market',note:'جاهزية تسويقية'},{label:'المحاور',value:'6',note:'مستندات · صور · صيانة...'},{label:'الناتج',value:'Owner Brief',note:'خطوة تالية واضحة'}]} actions={<Link href="/contact" className="lightOutline">تحدث مع مستشار <ArrowLeft/></Link>}/><section className="section shell"><OwnerStudio/></section></>}