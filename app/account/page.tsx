import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BellRing, Route } from 'lucide-react';
import { ClientSpace } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'مساحة العميل'};
export default function AccountPage(){return <><PageHero eyebrow="حسابك العقاري" title="مساحة العميل" copy="المفضلة، عمليات البحث المحفوظة، مواعيد المعاينات والجلسات — في صفحة حساب مستقلة بدل نافذة صغيرة داخل الرئيسية."/><section className="shell accountUtilityStrip"><Link href="/alerts"><BellRing/><span><b>التنبيهات الذكية</b><small>احفظ قواعد بحثك ولا تبدأ من الصفر.</small></span><ArrowLeft/></Link><Link href="/viewing-planner"><Route/><span><b>مخطط المعاينات</b><small>رتّب العقارات المحفوظة في يوم منظم.</small></span><ArrowLeft/></Link></section><section className="section shell"><ClientSpace/></section></>}
