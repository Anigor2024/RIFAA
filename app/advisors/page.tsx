import type { Metadata } from 'next';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { AdvisorBooking } from '@/components/atheeldar/InteractiveTools';
import { advisors } from '@/lib/atheeldar-data';
export const metadata:Metadata={title:'المستشارون'};
export default function AdvisorsPage(){return <><PageHero eyebrow="خبرة بشرية داخل تجربة رقمية" title="المستشارون" copy="كل تخصص له مستشار واضح، وصفحة الحجز تربط مباشرة بمواعيد العميل داخل نموذج المنصة."/><section className="section shell"><div className="advisorGrid">{advisors.map(a=><article key={a.name} className="advisorCard"><img src={a.image}/><div><span className="advisorRating"><Star size={15} fill="currentColor"/>{a.rating}</span><h2>{a.name} <BadgeCheck size={18}/></h2><b>{a.role}</b><p><MapPin size={15}/>{a.city}</p><small>{a.focus}</small><AdvisorBooking advisor={a.name}/></div></article>)}</div></section></>}
