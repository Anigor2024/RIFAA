import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { PortfolioLab } from '@/components/atheeldar/Phase14Suite';
export const metadata:Metadata={title:'مختبر المحفظة العقارية'};
export default function PortfolioLabPage(){return <><PageHero variant="portfolio-lab" image="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=88" eyebrow="PORTFOLIO INTELLIGENCE · ما بعد الأصل الواحد" title="مختبر المحفظة" copy="ابنِ سيناريو من عدة أصول، واختبر رأس المال والعائد النموذجي وتوزيع المدن والأنواع وتركيز المخاطر قبل التفكير في محفظة فعلية." highlights={['حتى 4 أصول','تنويع','عائد نموذجي','استخدام الميزانية']} stats={[{label:'زاوية القرار',value:'Portfolio',note:'بدل أصل منفرد'},{label:'المؤشرات',value:'4',note:'رأس مال · عائد · تنويع · دخل'},{label:'الحفظ',value:'Local',note:'على جهازك'}]} actions={<Link href="/investment" className="lightOutline">مختبر الاستثمار <ArrowLeft/></Link>}/><section className="section shell"><PortfolioLab/></section></>}