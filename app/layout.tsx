import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { BagDrawer } from '@/components/bag/BagDrawer';
import { SearchModal } from '@/components/search/SearchModal';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
  description: 'دار رِفْعة للأزياء المعاصرة — تصاميم راقية للمرأة والرجل والطفل في المملكة العربية السعودية. Contemporary Saudi Fashion House.',
  keywords: ['أزياء سعودية', 'رِفْعة', 'RIFAA', 'Saudi Fashion', 'Contemporary Modest', 'عبايات فاخرة', 'أزياء رجالية', 'أزياء أطفال', 'Riyadh Fashion'],
  openGraph: {
    title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
    description: 'دار رِفْعة للأزياء المعاصرة — تصاميم راقية للمرأة والرجل والطفل في المملكة العربية السعودية.',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رِفْعة | RIFAA — Contemporary Saudi Fashion',
    description: 'دار رِفْعة للأزياء المعاصرة — تصاميم راقية للمرأة والرجل والطفل في المملكة العربية السعودية.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${plusJakartaSans.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#F7F4EF] text-[#111111] antialiased overflow-x-hidden selection:bg-[#511D24] selection:text-white min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <AppProviders>
          <Header />
          <div className="flex-1 w-full">
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
