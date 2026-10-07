import type { Metadata } from 'next';
import { PresentationDeck } from '@/components/atheeldar/Phase18Suite';

export const metadata:Metadata={title:'Private Client Presentation'};

type Focus='متوازن'|'عائلي'|'استثماري'|'فاخر';
const focuses:Focus[]=['متوازن','عائلي','استثماري','فاخر'];

export default async function PresentationPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const q=await searchParams;
  const raw=typeof q.items==='string'?q.items:'';
  const items=raw.split(',').map(x=>x.trim()).filter(Boolean).slice(0,5);
  const client=typeof q.client==='string'&&q.client.trim()?q.client.trim().slice(0,50):'عميل خاص';
  const title=typeof q.title==='string'&&q.title.trim()?q.title.trim().slice(0,80):'مراجعة الخيارات العقارية';
  const focusRaw=typeof q.focus==='string'?q.focus:'متوازن';
  const focus=(focuses.includes(focusRaw as Focus)?focusRaw:'متوازن') as Focus;
  return <PresentationDeck items={items} client={client} title={title} focus={focus}/>;
}