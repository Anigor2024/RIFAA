import type { Metadata } from 'next';
import { BadgeCheck, Clock3, MapPin, Sparkles, Star } from 'lucide-react';
import { PageHero } from '@/components/atheeldar/SiteShell';
import { AdvisorBooking } from '@/components/atheeldar/InteractiveTools';
import { AdvisorMatcher } from '@/components/atheeldar/ExperienceTools';
import { advisors } from '@/lib/atheeldar-data';

export const metadata:Metadata={title:'المستشارون'};

export default function AdvisorsPage(){
  return <>
    <PageHero eyebrow="خبرة بشرية داخل تجربة رقمية" title="المستشارون" copy="تخصصات واضحة، مطابقة ذكية أولية، وحجز جلسة يدخل مباشرة إلى مساحة العميل داخل نموذج المنصة."/>
    <section className="advisorMatchSection shell"><AdvisorMatcher/></section>
    <section className="section softSection advisorDirectory"><div className="shell">
      <div className="sectionHead"><div><p className="eyebrow">شبكة خبرات أثيلدار</p><h2>اختصاص واضح لكل <em>نوع قرار</em></h2></div><p className="sectionAsideCopy">بدل صور مخزنة ضخمة لا تضيف قيمة، صممنا بطاقات استشارية تركّز على التخصص، الموقع ومسار الحجز. ملفات الفريق هنا تجريبية لأغراض العرض.</p></div>
      <div className="advisorGrid">{advisors.map((a,i)=>{
        const initials=a.name.split(' ').map(x=>x[0]).join('').slice(0,2);
        return <article key={a.name} className="advisorCard advisorCardEditorial">
          <div className="advisorIdentity">
            <div className="advisorMonogram">{initials}</div>
            <div className="advisorIdentityMeta"><span className="advisorIndex">0{i+1}</span><span className="availabilityText"><Clock3/> {i===0?'متاح اليوم':i===1?'موعد غدًا':'هذا الأسبوع'}</span></div>
          </div>
          <div className="advisorBody">
            <div className="advisorTopline"><span className="advisorRating"><Star size={14} fill="currentColor"/>{a.rating} <small>تجريبي</small></span><span><Sparkles size={13}/> ملف استشاري</span></div>
            <h2>{a.name} <BadgeCheck size={18}/></h2>
            <b>{a.role}</b>
            <p><MapPin size={15}/>{a.city}</p>
            <div className="advisorFocus">{a.focus.split('·').map(x=><span key={x.trim()}>{x.trim()}</span>)}</div>
            <AdvisorBooking advisor={a.name}/>
          </div>
        </article>
      })}</div>
    </div></section>
  </>
}
