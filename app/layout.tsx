import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import './atheel.css';
import { SiteShell } from '@/components/atheeldar/SiteShell';

const arabic=IBM_Plex_Sans_Arabic({subsets:['arabic','latin'],weight:['300','400','500','600','700'],variable:'--font-arabic',display:'swap'});
const serif=Cormorant_Garamond({subsets:['latin'],weight:['500','600','700'],variable:'--font-serif',display:'swap'});

export const metadata: Metadata={
  metadataBase:new URL('https://atheeldar.vercel.app'),
  title:{default:'أثيلدار العقارية | ATHEELDAR',template:'%s | أثيلدار'},
  description:'بيوت تشبهك وأحياء تناسب يومك. اكتشف العقارات، قارن التفاصيل، واحسب ميزانيتك عبر تجربة أثيلدار العقارية.',
  keywords:['عقارات السعودية','عقارات الرياض','عقارات جدة','فلل','شقق','استثمار عقاري','أثيلدار','ATHEELDAR'],
  openGraph:{title:'أثيلدار العقارية | ATHEELDAR',description:'اكتشف عقارك عبر تجربة سعودية ذكية متعددة الصفحات.',type:'website',locale:'ar_SA',images:[{url:'/images/atheeldar/villa-dusk.png',width:1642,height:958,alt:'أثيلدار — مساحتك القادمة تبدأ من هنا'}]},
  twitter:{card:'summary_large_image',title:'أثيلدار العقارية | ATHEELDAR',description:'منصة عقارية سعودية متقدمة متعددة الصفحات.'}
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl" className={`${arabic.variable} ${serif.variable}`}><body><SiteShell>{children}</SiteShell></body></html>}
