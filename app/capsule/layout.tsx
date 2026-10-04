import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Capsule Studio | استوديو الكابسولة',
  description:
    'Build a five-piece RIFAA capsule by audience, occasion and palette, then save or add the complete edit in one action.',
  alternates: {
    canonical: '/capsule',
  },
};

export default function CapsuleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
