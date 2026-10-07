import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Pairing Studio | استوديو التنسيق',
  description:
    'Start from any RIFAA piece and build a complementary edit using category, collection, color harmony and availability signals.',
  alternates: {
    canonical: '/pairing',
  },
};

export default function PairingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
