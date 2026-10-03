import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "دليل المقاسات | Size Guide — رِفْعة RIFAA",
  description: "RIFAA bilingual sizing guide experience for women, men and kids.",
  alternates: { canonical: "/size-guide" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
