import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Studio | استوديو رِفْعة',
  description:
    'A single premium workspace for RIFAA Curator, Atelier, Compare Studio and Capsule Studio.',
  alternates: {
    canonical: '/studio',
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
