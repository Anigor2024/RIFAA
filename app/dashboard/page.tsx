import type { Metadata } from 'next';
import { CRMBoard } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'بوابة المستشار'};
export default function DashboardPage(){return <><PageHero eyebrow="ATHEELDAR OPERATIONS" title="بوابة المستشار" copy="لوحة تشغيل تجريبية تُظهر كيف تتحول طلبات الموقع إلى Leads ومراحل متابعة ومواعيد، بدل أن يظل الموقع مجرد واجهة تسويقية."/><section className="section shell"><CRMBoard/></section></>}
