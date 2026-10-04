import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Curator | منسّق رِفْعة',
  description:
    'An intelligent bilingual fashion discovery experience that recommends RIFAA pieces by department, occasion, fabrication and tailoring preference.',
  alternates: {
    canonical: '/discover',
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
