import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { ProjectCompareWorkbench } from '@/components/atheeldar/Phase13Suite';
export const metadata:Metadata={title:'مقارنة المشاريع'};
export default function ProjectComparePage(){return <><PageHero variant="project-compare" image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=88" eyebrow="PROJECT INTELLIGENCE · قارن المشروع قبل الوحدة" title="مقارنة المشاريع" copy="ضع المشاريع الجديدة جنبًا إلى جنب من زاوية نقطة الدخول، التقدم، التسليم، حجم المجتمع والمرافق — ثم انتقل إلى مستوى الوحدة عندما تضيق القائمة." highlights={['حتى 3 مشاريع','التقدم','التسليم','نقطة الدخول']} stats={[{label:'المقارنة',value:'Project Level',note:'قبل الوحدة'},{label:'الاختيار',value:'حتى 3',note:'مشاريع'},{label:'الهدف',value:'Shortlist أوضح',note:'للمتابعة'}]} actions={<Link href="/projects" className="lightOutline">استكشف المشاريع <ArrowLeft/></Link>}/><section className="section shell"><ProjectCompareWorkbench/></section></>}