import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProperty, properties } from '@/lib/atheeldar-data';
import { PropertyDealRoom } from '@/components/atheeldar/Phase13Suite';
export function generateStaticParams(){return properties.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=getProperty(slug);return p?{title:`Deal Room · ${p.title}`,description:`مساحة قرار خاصة للعقار ${p.title}`}:{title:'Deal Room'}}
export default async function DealRoomPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=getProperty(slug);if(!p)notFound();return <section className="dealRoomPageV13"><div className="shell"><PropertyDealRoom property={p}/></div></section>}