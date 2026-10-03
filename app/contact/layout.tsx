import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "التواصل | Contact — رِفْعة RIFAA",
  description: "RIFAA client-care showcase and configurable live contact channels.",
  alternates: { canonical: "/contact" },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
