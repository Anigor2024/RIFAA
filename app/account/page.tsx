import type { Metadata } from 'next';
import { ClientSpace } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'مساحة العميل'};
export default function AccountPage(){return <><PageHero eyebrow="حسابك العقاري" title="مساحة العميل" copy="المفضلة، عمليات البحث المحفوظة، مواعيد المعاينات والجلسات — في صفحة حساب مستقلة بدل نافذة صغيرة داخل الرئيسية."/><section className="section shell"><ClientSpace/></section></>}
