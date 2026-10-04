import type { Metadata } from 'next';
import { PropertyExplorer } from '@/components/atheeldar/PropertyExplorer';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'العقارات',description:'بحث ذكي ومتقدم بين عقارات أثيلدار مع الفلاتر والمقارنة والخريطة.'};
export default async function PropertiesPage({searchParams}:{searchParams:Promise<{q?:string}>}){const sp=await searchParams;return <><PageHero eyebrow="سوق أثيلدار" title="العقارات" copy="ابحث، صفِّ، قارن، احفظ، وانتقل إلى تفاصيل كل عقار في صفحة مستقلة غنية بالمعلومات."/><section className="shell explorerSection explorerLift"><PropertyExplorer initialQuery={sp.q||''}/></section></>}
