import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BellRing, Route } from 'lucide-react';
import { ClientSpace } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'مساحة العميل'};
export default function AccountPage(){return <><PageHero variant="account" image="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=88" eyebrow="CLIENT WORKSPACE · حسابك العقاري" title="مساحة العميل" copy="المفضلة، التنبيهات، مسارات القرار ومواعيد المعاينات داخل مساحة واحدة تعيدك إلى سياقك بدل أن تبدأ رحلة البحث من الصفر كل مرة." highlights={['مفضلة','تنبيهات','معاينات','مسارات قرار']} stats={[{label:'المساحة',value:'شخصية',note:'داخل النموذج'},{label:'الحفظ',value:'محلي',note:'Portfolio demo'},{label:'المسارات',value:'بحث + قرار',note:'ومعاينات'}]}/><section className="shell accountUtilityStrip"><Link href="/alerts"><BellRing/><span><b>التنبيهات الذكية</b><small>احفظ قواعد بحثك ولا تبدأ من الصفر.</small></span><ArrowLeft/></Link><Link href="/viewing-planner"><Route/><span><b>مخطط المعاينات</b><small>رتّب العقارات المحفوظة في يوم منظم.</small></span><ArrowLeft/></Link></section><section className="section shell"><ClientSpace/></section></>}
