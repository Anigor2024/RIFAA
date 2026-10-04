import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Atelier | مشغل رِفْعة',
  description:
    'Compose complete RIFAA edits with color and size selection, material comparison, wishlist saving and one-step bag actions.',
  alternates: {
    canonical: '/atelier',
  },
};

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
