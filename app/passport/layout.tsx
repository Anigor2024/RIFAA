import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Style Passport | جواز أسلوب رِفْعة',
  description:
    'Save non-sensitive style preferences locally and use them to preconfigure RIFAA Curator and Capsule Studio.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PassportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
