import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مساحة العميل | Client Space — رِفْعة RIFAA',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
