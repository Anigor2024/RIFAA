import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Footprints, Home, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { neighborhoods } from '@/lib/atheeldar-data';
export const metadata:Metadata={title:'دليل الأحياء'};
export default function NeighborhoodsPage(){return <><PageHero eyebrow="قرار الموقع قبل قرار العقار" title="دليل الأحياء" copy="صفحات مستقلة للأحياء تجمع الطلب، طبيعة المنطقة، نطاقات سعرية تجريبية ومؤشرات تساعد العميل على تكوين صورة أوضح."/><section className="section shell"><div className="neighborhoodGrid">{neighborhoods.map(n=><Link href={`/neighborhoods/${n.slug}`} key={n.slug} className="neighborhoodCard"><img src={n.image}/><div className="neighborhoodOverlay"/><div className="neighborhoodCardTop"><span>{n.city}</span><b>{n.score}</b></div><div className="neighborhoodCardBottom"><small>{n.label}</small><h2>{n.name}</h2><p>{n.summary}</p><div><span><TrendingUp/> الطلب: {n.demand}</span><span><Footprints/> المشي: {n.walk}</span><span><Home/> عائلي: {n.family}</span></div><strong>فتح ملف الحي <ArrowLeft/></strong></div></Link>)}</div></section></>}
