import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { PrivateClientBrief } from '@/components/atheeldar/Phase15Suite';
export const metadata:Metadata={title:'Private Client Brief'};
export default function ClientBriefPage(){return <><PageHero variant="client-brief" image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=88" eyebrow="PRIVATE CLIENT · من الرغبة إلى Brief واضح" title="ملف العميل الخاص" copy="حوّل الحديث العام عن العقار إلى ملف احتياج منظم يحتوي الهدف والمدينة والميزانية والتوقيت والأولويات، ثم اطبعه أو خذه مباشرة إلى جلسة المستشار." highlights={['Advisor Handoff','أولويات','Model Matches','Print / PDF']} stats={[{label:'المدخلات',value:'6+',note:'هدف · مدينة · ميزانية...'},{label:'الأولويات',value:'حتى 5',note:'مرتبة ضمن الملف'},{label:'الناتج',value:'Client Brief',note:'قابل للطباعة'}]} actions={<Link href="/advisors" className="lightOutline">المستشارون <ArrowLeft/></Link>}/><section className="section shell"><PrivateClientBrief/></section></>}