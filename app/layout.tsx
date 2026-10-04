import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { BagDrawer } from '@/components/bag/BagDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rifaa-ashy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
  description: 'RIFAA — a premium bilingual Saudi fashion ecommerce experience for women, men, and children, engineered as a production-ready portfolio storefront.',
  keywords: ['أزياء سعودية', 'رِفْعة', 'RIFAA', 'Saudi Fashion', 'Contemporary Modest', 'عبايات فاخرة', 'أزياء رجالية', 'أزياء أطفال', 'Riyadh Fashion'],
  openGraph: {
    title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
    url: '/',
    description: 'Premium bilingual Saudi fashion ecommerce experience with responsive shopping, wishlist, bag, checkout, and client account flows.',
    type: 'website',
    locale: 'ar_SA',
    images: [{ url: '/images/hero_campaign_riyadh.jpg', alt: 'RIFAA contemporary Saudi fashion campaign' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
    description: 'Premium bilingual Saudi fashion ecommerce experience with responsive shopping, wishlist, bag, checkout, and client account flows.',
    images: ['/images/hero_campaign_riyadh.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#511D24',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-[#F7F4EF] text-[#111111] antialiased overflow-x-hidden selection:bg-[#511D24] selection:text-white min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">تجاوز إلى المحتوى / Skip to content</a>
        <AppProviders>
          <ScrollProgress />
          <Header />
          <div id="main-content" className="flex-1 w-full" tabIndex={-1}>
            {children}
          </div>
          <ProductQuickView />
          <BagDrawer />
          <SearchModal />
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
