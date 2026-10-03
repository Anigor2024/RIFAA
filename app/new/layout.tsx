import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "وصل حديثاً | New In — رِفْعة RIFAA",
  description: "Latest RIFAA arrivals across women, men and kids.",
  alternates: { canonical: "/new" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
