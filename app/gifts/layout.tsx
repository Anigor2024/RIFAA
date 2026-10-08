import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Gift Atelier | مشغل الهدايا',
  description:
    'Find an elegant RIFAA gift by recipient, occasion, budget and style. Explore real catalog pieces with transparent prices and shareable selections.',
  alternates: { canonical: '/gifts' },
};

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
