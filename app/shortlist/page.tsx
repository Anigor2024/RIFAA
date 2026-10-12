import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { ShortlistRoom } from '@/components/atheeldar/Phase11Suite';
export const metadata:Metadata={title:'غرفة الـShortlist'};
export default function ShortlistPage(){return <><PageHero variant="shortlist" image="/images/atheeldar/catalog/photo-1556761175-b413da4baf72.jpg" eyebrow="CLIENT SHORTLIST · من الحفظ إلى قرار قابل للمراجعة" title="غرفة الـShortlist" copy="مساحة واحدة تجمع المفضلة، المقارنة، مخطط المعاينات والملاحظات، ثم تحولها إلى Decision Pack قابل للطباعة ومشاركته في اجتماع القرار." highlights={['مفضلة','مقارنة','معاينات','Decision Pack']} stats={[{label:'مصادر القرار',value:'3',note:'مفضلة · مقارنة · معاينات'},{label:'الحزمة',value:'حتى 5 أصول',note:'في Decision Pack'},{label:'الخصوصية',value:'Local First',note:'على جهازك'}]} actions={<Link href="/properties" className="lightOutline">أضف عقارات <ArrowLeft/></Link>}/><section className="section shell"><ShortlistRoom/></section></>}