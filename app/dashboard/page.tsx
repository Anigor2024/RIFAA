import type { Metadata } from 'next';
import { CRMBoard } from '@/components/atheeldar/InteractiveTools';
import { PageHero } from '@/components/atheeldar/SiteShell';
export const metadata:Metadata={title:'بوابة المستشار'};
export default function DashboardPage(){return <><PageHero variant="dashboard" image="/images/atheeldar/catalog/photo-1517048676732-d65bc937f952.jpg" eyebrow="ATHEELDAR OPERATIONS · التشغيل والمتابعة" title="بوابة المستشار" copy="الجانب التشغيلي للمنصة: Leads، مراحل متابعة، جلسات ومعاينات — حتى لا يبقى المنتج مجرد واجهة جميلة منفصلة عن رحلة البيع." highlights={['Leads','Pipeline','جلسات','متابعة']} stats={[{label:'نوع المساحة',value:'تشغيل داخلي',note:'للمستشار'},{label:'المسار',value:'من الاهتمام للمتابعة',note:'داخل لوحة واحدة'},{label:'التكامل',value:'الموقع + العميل',note:'نموذج مترابط'}]}/><section className="section shell"><CRMBoard/></section></>}
