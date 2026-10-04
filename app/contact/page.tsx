import type { Metadata } from 'next';
import { Mail, MapPin, Phone, Workflow } from 'lucide-react';
import { ContactLeadForm } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'تواصل معنا'};
export default function ContactPage(){return <><PageHero eyebrow="تواصل مباشر" title="كيف نقدر نخدمك؟" copy="صفحة تواصل مستقلة تحول الطلب إلى Lead داخل بوابة المستشار التجريبية، لتوضيح دورة العمل من الواجهة إلى التشغيل."/><section className="section shell contactLayout"><div><div className="contactInfo"><article><MapPin/><span><b>الموقع</b><small>الرياض · المملكة العربية السعودية</small></span></article><article><Phone/><span><b>الهاتف التجريبي</b><small>+966 11 555 0900</small></span></article><article><Workflow/><span><b>مسار الطلب</b><small>الموقع ← CRM ← مستشار ← معاينة</small></span></article></div><p className="demoNotice">بيانات التواصل والهواتف في النموذج لأغراض المعاينة وليست قناة خدمة فعلية.</p></div><ContactLeadForm/></section></>}
