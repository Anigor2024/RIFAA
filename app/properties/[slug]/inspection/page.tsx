import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty, properties } from '@/lib/atheeldar-data';
import { InspectionRoom } from '@/components/atheeldar/Phase16Suite';

export function generateStaticParams(){return properties.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const p=getProperty(slug);
  return p?{title:'Inspection Room · '+p.title,description:'تقرير معاينة شخصي للعقار '+p.title}:{title:'Inspection Room'}
}
export default async function InspectionPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=getProperty(slug);if(!p)notFound();
  return <section className="inspectionPageV16"><div className="shell"><InspectionRoom property={p}/></div></section>
}