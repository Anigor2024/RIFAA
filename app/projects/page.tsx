import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, CalendarClock, Layers3 } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { projects, money } from '@/lib/atheeldar-data';
export const metadata:Metadata={title:'المشاريع الجديدة'};
export default function ProjectsPage(){return <><PageHero eyebrow="مشاريع تحت التطوير" title="المشاريع الجديدة" copy="صفحة مستقلة للمشاريع السكنية النوعية، مراحل الإنجاز، مواعيد التسليم، الوحدات والمرافق."/><section className="section shell"><div className="projectList">{projects.map((p,i)=><article key={p.slug} className="projectRow"><div className="projectRowMedia"><img src={p.image}/><span>{String(i+1).padStart(2,'0')}</span></div><div className="projectRowBody"><p className="eyebrow">{p.city} · {p.type}</p><h2>{p.name}</h2><p>{p.description}</p><div className="projectFacts"><span><Building2/><small>وحدة</small><b>{p.units}</b></span><span><Layers3/><small>نسبة الإنجاز</small><b>{p.progress}%</b></span><span><CalendarClock/><small>التسليم</small><b>{p.delivery}</b></span></div><div className="progressLine"><i style={{width:`${p.progress}%`}}/></div><div className="projectRowFoot"><b>يبدأ من {money(p.from)} ر.س</b><Link href={`/projects/${p.slug}`}>تفاصيل المشروع <ArrowLeft/></Link></div></div></article>)}</div></section></>}
