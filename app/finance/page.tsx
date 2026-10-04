import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BadgeDollarSign, FileCheck2, Landmark, Scale } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { FinanceLab } from '@/components/atheeldar/InteractiveTools';
export const metadata:Metadata={title:'التمويل العقاري'};
export default function FinancePage(){return <><PageHero eyebrow="قبل أن تختار العقار" title="مختبر التمويل" copy="محاكاة للقسط والدفعة ومبلغ التمويل ونسبة العبء، في صفحة مستقلة تساعد العميل على بناء ميزانية أكثر واقعية."/><section className="section shell"><FinanceLab/></section><section className="section shell"><div className="processGrid"><article><span>01</span><Landmark/><h3>حدد ميزانيتك</h3><p>ابدأ بالدخل والالتزامات وليس بسعر العقار الذي أعجبك.</p></article><article><span>02</span><Scale/><h3>وازن الدفعة والقسط</h3><p>زيادة الدفعة قد تخفض التمويل لكنها تقلل السيولة المتاحة.</p></article><article><span>03</span><BadgeDollarSign/><h3>قارن التكلفة الكلية</h3><p>لا تقارن القسط فقط؛ راجع التكلفة الكلية والرسوم والشروط.</p></article><article><span>04</span><FileCheck2/><h3>اطلب عرضًا رسميًا</h3><p>المحاكاة هنا تعليمية، والعرض الفعلي يصدر من الجهة التمويلية.</p></article></div><div className="centerCta"><Link href="/contact" className="primaryWide">اطلب مساعدة مستشار <ArrowLeft/></Link></div></section></>}
