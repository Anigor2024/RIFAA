import type {Metadata} from 'next';
import {ToolsDirectory} from '@/components/atheeldar/DiscoveryHome';
export const metadata:Metadata={title:'أدوات القرار',description:'أدوات أثيلدار للبحث والمقارنة والتمويل والمعاينات والاختيارات المحفوظة، في دليل واحد واضح.'};
export default function ToolsPage(){return <><section className="at-simple-hero"><div className="shell"><h1>لكل خطوة، أداتها.</h1><p>ابدأ بما تحتاجه الآن. أدوات البحث والمقارنة والميزانية والمعاينة، مجتمعة في مكان واحد.</p></div></section><ToolsDirectory/></>}
