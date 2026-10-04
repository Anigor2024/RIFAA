import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Compare Studio | استوديو المقارنة',
  description:
    'Compare up to three RIFAA pieces side by side across fabrication, tailoring, fit, care, origin, color, size and price.',
  alternates: {
    canonical: '/compare',
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
