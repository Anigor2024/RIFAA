import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIFAA Concierge | كونسيرج رِفْعة',
  description:
    'A privacy-first clienteling journey that turns saved RIFAA signals into a clear next best action.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConciergeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
