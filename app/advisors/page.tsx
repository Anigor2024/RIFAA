import type { Metadata } from 'next';
import { BadgeCheck, Clock3, MapPin, Star } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { AdvisorBooking } from '@/components/atheeldar/InteractiveTools';
import { AdvisorMatcher } from '@/components/atheeldar/ExperienceTools';
import { advisors } from '@/lib/atheeldar-data';
export const metadata:Metadata={title:'المستشارون'};
export default function AdvisorsPage(){return <><PageHero eyebrow="خبرة بشرية داخل تجربة رقمية" title="المستشارون" copy="تخصصات واضحة، مطابقة ذكية أولية، وحجز جلسة يدخل مباشرة إلى مساحة العميل داخل نموذج المنصة."/><section className="section shell"><AdvisorMatcher/></section><section className="section softSection"><div className="shell"><div className="sectionHead"><div><p className="eyebrow">فريق متعدد التخصصات</p><h2>اختر خبرة تناسب <em>نوع القرار</em></h2></div></div><div className="advisorGrid">{advisors.map((a,i)=><article key={a.name} className="advisorCard"><div className="advisorMedia"><img src={a.image} alt={a.name}/><span className="availability"><Clock3/> {i===0?'متاح اليوم':i===1?'موعد غدًا':'هذا الأسبوع'}</span></div><div><span className="advisorRating"><Star size={15} fill="currentColor"/>{a.rating}</span><h2>{a.name} <BadgeCheck size={18}/></h2><b>{a.role}</b><p><MapPin size={15}/>{a.city}</p><small>{a.focus}</small><AdvisorBooking advisor={a.name}/></div></article>)}</div></div></section></>}
