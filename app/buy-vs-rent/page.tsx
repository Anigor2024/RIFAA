import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { BuyVsRentLab } from '@/components/atheeldar/Phase15Suite';
export const metadata:Metadata={title:'شراء أم استئجار'};
export default function BuyVsRentPage(){return <><PageHero variant="buy-vs-rent" image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=88" eyebrow="DECISION ECONOMICS · شراء أم استئجار؟" title="مختبر شراء أم استئجار" copy="اختبر القرار على أفق زمني بدل مقارنة الإيجار بالقسط فقط: دفعة أولى، تمويل، نمو قيمة، نمو إيجار وحقوق ملكية داخل سيناريو واحد." highlights={['أفق 3–20 سنة','تمويل','نمو قيمة','إيجار متغير']} stats={[{label:'نوع الأداة',value:'Scenario Lab',note:'تعليمي'},{label:'المقارنة',value:'Buy vs Rent',note:'على الزمن'},{label:'الحفظ',value:'Local',note:'على جهازك'}]} actions={<Link href="/finance" className="lightOutline">مختبر التمويل <ArrowLeft/></Link>}/><section className="section shell"><BuyVsRentLab/></section></>}