import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'البحث | Search — رِفْعة RIFAA',
  robots: { index: false, follow: false },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
