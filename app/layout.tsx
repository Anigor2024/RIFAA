import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/atheeldar/SiteShell';

const arabic=IBM_Plex_Sans_Arabic({subsets:['arabic','latin'],weight:['300','400','500','600','700'],variable:'--font-arabic',display:'swap'});
const serif=Cormorant_Garamond({subsets:['latin'],weight:['500','600','700'],variable:'--font-serif',display:'swap'});

export const metadata: Metadata={
  metadataBase:new URL('https://atheeldar.vercel.app'),
  title:{default:'أثيلدار العقارية | ATHEELDAR',template:'%s | أثيلدار'},
  description:'منصة عقارية سعودية متقدمة متعددة الصفحات للبحث عن العقارات والمشاريع والأحياء والاستثمار والتمويل وإدارة رحلة العميل.',
  keywords:['عقارات السعودية','عقارات الرياض','عقارات جدة','فلل','شقق','استثمار عقاري','أثيلدار','ATHEELDAR'],
  openGraph:{title:'أثيلدار العقارية | ATHEELDAR',description:'اكتشف عقارك عبر تجربة سعودية ذكية متعددة الصفحات.',type:'website',locale:'ar_SA'},
  twitter:{card:'summary_large_image',title:'أثيلدار العقارية | ATHEELDAR',description:'منصة عقارية سعودية متقدمة متعددة الصفحات.'}
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl" className={`${arabic.variable} ${serif.variable}`}><body><SiteShell>{children}</SiteShell></body></html>}
