import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { DecisionBoard } from '@/components/atheeldar/Phase07Suite';
export const metadata:Metadata={title:'لوحة القرار'};
export default function Page(){return <><PageHero eyebrow="COMPARE WHAT MATTERS" title="لوحة القرار" copy="مساحة تجمع الأصول المحفوظة وتسمح لك بتغيير أوزان الجودة ونمط الحياة والاستثمار والميزانية لتفهم لماذا يتغير ترتيب الخيارات." actions={<Link href="/properties" className="lightOutline">أضف عقارات <ArrowLeft/></Link>}/><section className="section shell"><DecisionBoard/></section></>}