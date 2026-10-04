import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Footprints, Home, TrendingUp } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { NeighborhoodCompare } from '@/components/atheeldar/ExperienceTools';
import { neighborhoods } from '@/lib/atheeldar-data';
export const metadata:Metadata={title:'دليل الأحياء'};
export default function NeighborhoodsPage(){return <><PageHero eyebrow="قرار الموقع قبل قرار العقار" title="دليل الأحياء" copy="صفحات مستقلة للأحياء تجمع الطلب، طبيعة المنطقة، نطاقات سعرية تجريبية ومؤشرات تساعد العميل على تكوين صورة أوضح."/><section className="section shell"><NeighborhoodCompare/></section><section className="section softSection"><div className="shell"><div className="sectionHead"><div><p className="eyebrow">ملفات مكانية</p><h2>افتح الحي كأنه <em>منتج مستقل</em></h2></div></div><div className="neighborhoodGrid">{neighborhoods.map(n=><Link href={`/neighborhoods/${n.slug}`} key={n.slug} className="neighborhoodCard"><img src={n.image} alt={n.name}/><div className="neighborhoodOverlay"/><div className="neighborhoodCardTop"><span>{n.city}</span><b>{n.score}</b></div><div className="neighborhoodCardBottom"><small>{n.label}</small><h2>{n.name}</h2><p>{n.summary}</p><div><span><TrendingUp/> الطلب: {n.demand}</span><span><Footprints/> المشي: {n.walk}</span><span><Home/> عائلي: {n.family}</span></div><strong>فتح ملف الحي <ArrowLeft/></strong></div></Link>)}</div></div></section></>}
